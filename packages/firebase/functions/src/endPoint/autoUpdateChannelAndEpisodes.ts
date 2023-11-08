import * as functions from 'firebase-functions';
import {
  CHANNEL_DOCUMENT_NAME,
  EPISODE_DOCUMENT_NAME,
  TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME,
  TRANSLATE_PENDING_EPISODES_DOCUMENT_NAME,
} from '../constants.js';
import { fetchChannelDataByFeedUrl } from '../services/fetchChannelDataByFeedUrl.js';
import { Timestamp, getFirestore, FieldValue } from 'firebase-admin/firestore';

export const autoUpdateChannelAndEpisodes = functions
  .runWith({
    timeoutSeconds: 300,
  })
  .region('asia-northeast1')
  .pubsub.schedule('every 1 hours')
  // .pubsub.schedule('every 12 hours') // dev用
  .onRun(async (context) => {
    const firestore = getFirestore();
    const channelCollectionShapshot = await firestore.collection(CHANNEL_DOCUMENT_NAME).get();
    await Promise.all(
      channelCollectionShapshot.docs.map(async (channelDoc) => {
        const channelFromDB = channelDoc.data();
        const { channel, episodes } = await fetchChannelDataByFeedUrl(channelFromDB.feedUrl);
        const canDirection = channelFromDB.canDirection ? !!channelFromDB.canDirection : false;

        // pubDateが更新されていない場合は処理を終了する
        if (
          channelFromDB.channelPubDate &&
          channel.channelPubDate <= channelFromDB.channelPubDate
        ) {
          return;
        }

        // チャンネルデータを更新する
        // ※firestoreの書き込みカウントはupdateの実行数なので、差分データだけ抽出する必要はない
        await firestore
          .collection(CHANNEL_DOCUMENT_NAME)
          .doc(channelDoc.id)
          .update({ ...channel, updatedAt: channel.channelPubDate });

        const updatedEpisodes: {
          episodeId: string;
          pubDate: Timestamp;
          url: string;
          isAudioUpdated: boolean;
        }[] = [];

        const episodesFromDB = await firestore
          .collection(CHANNEL_DOCUMENT_NAME)
          .doc(channelDoc.id)
          .collection(EPISODE_DOCUMENT_NAME)
          .get();

        const episodeFromDBDocs = episodesFromDB.docs;
        // 既存エピソードの更新を行う
        const updateEpisodesPromises = episodeFromDBDocs.map(async (episodeFromDB) => {
          const fromDB = episodeFromDB.data();
          const episodeData = episodes.find((episode) => episode.guid === fromDB.guid);
          if (!episodeData) {
            // エピソードが削除された場合
            await episodeFromDB.ref.delete();

            // transcriptPendingEpisodes,transcriptPendingEpisodesからも削除する
            try {
              await firestore
                .collection(TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME)
                .doc(episodeFromDB.id)
                .delete();
              await firestore
                .collection(TRANSLATE_PENDING_EPISODES_DOCUMENT_NAME)
                .doc(episodeFromDB.id)
                .delete();
            } catch (error) {
              console.log('delete 失敗', error);
            }

            return;
          }
          const pubDateFromDB = fromDB.pubDate;
          // pubDateに変更がない場合は処理を終了する
          if (episodeData.pubDate.isEqual(pubDateFromDB)) {
            return;
          }
          const isAudioUpdated = episodeData.url !== fromDB.url;
          // エピソードの更新を行う
          await episodeFromDB.ref.update({
            ...episodeData,
            updatedAt: episodeData.pubDate,
            ...(isAudioUpdated
              ? {
                  transcriptUrl: FieldValue.delete(),
                  translatedTranscripts: [],
                }
              : {}),
          });
          updatedEpisodes.push({
            episodeId: episodeFromDB.id,
            pubDate: episodeData.pubDate,
            url: episodeData.url,
            isAudioUpdated,
          });
        });
        await Promise.all(updateEpisodesPromises);

        // 新規エピソードを追加する
        const newEpisodes = episodes.filter(
          (episode) =>
            !episodeFromDBDocs.some((episodeFromDB) => episodeFromDB.data().guid === episode.guid),
        );
        const channelRef = firestore.collection(CHANNEL_DOCUMENT_NAME).doc(channelDoc.id);
        const newEpisodesPromises = newEpisodes.map(async (episode) => {
          const addedEpisode = await channelRef.collection(EPISODE_DOCUMENT_NAME).add({
            ...episode,
            canDirection,
          });
          updatedEpisodes.push({
            episodeId: addedEpisode.id,
            pubDate: episode.pubDate,
            url: episode.url,
            isAudioUpdated: true,
          });
        });
        await Promise.all(newEpisodesPromises);

        console.log('updatedEpisodesLength', updatedEpisodes.length);

        const pendingEpisodesPromises = updatedEpisodes.map(async (episode) => {
          // pubDateが一ヶ月以上前の場合、追加しない
          if (episode.pubDate.toDate() < new Date(new Date().setMonth(new Date().getMonth() - 1))) {
            console.log('追加しない');
            return;
          }
          // channelDocのshouldNotMakeTextが存在してtrueの場合、追加しない
          if (!!channelFromDB.shouldNotMakeText) {
            return;
          }
          // audioが更新された場合、transcriptPendingEpisodesに追加する
          if (episode.isAudioUpdated) {
            await firestore
              .collection(TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME)
              .doc(episode.episodeId)
              .set({
                channelId: channelDoc.id,
                pubDate: episode.pubDate,
                url: episode.url,
              });
          }
        });
        await Promise.all(pendingEpisodesPromises);
      }),
    );
  });
