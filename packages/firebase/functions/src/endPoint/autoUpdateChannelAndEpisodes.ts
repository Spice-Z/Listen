import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  CHANNEL_DOCUMENT_NAME,
  EPISODE_DOCUMENT_NAME,
  TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME,
} from '../constants';
import { fetchChannelDataByFeedUrl } from '../services/fetchChannelDataByFeedUrl';
import { Timestamp } from 'firebase-admin/firestore';

export const autoUpdateChannelAndEpisodes = functions
  .runWith({
    timeoutSeconds: 300,
  })
  .region('asia-northeast1')
  .pubsub.schedule('every 2 hours')
  .onRun(async (context) => {
    const channelCollectionShapshot = await admin
      .firestore()
      .collection(CHANNEL_DOCUMENT_NAME)
      .get();
    await Promise.all(
      channelCollectionShapshot.docs.map(async (channelDoc) => {
        const channelFromDB = channelDoc.data();
        const { channel, episodes } = await fetchChannelDataByFeedUrl(channelFromDB.feedUrl);

        // pubDateが更新されていない場合は処理を終了する
        if (
          channelFromDB.channelPubDate &&
          channel.channelPubDate <= channelFromDB.channelPubDate
        ) {
          return;
        }

        // チャンネルデータを更新する
        // ※firestoreの書き込みカウントはupdateの実行数なので、差分データだけ抽出する必要はない
        await admin
          .firestore()
          .collection(CHANNEL_DOCUMENT_NAME)
          .doc(channelDoc.id)
          .update(channel);

        const updatedEpisodes: {
          episodeId: string;
          pubDate: Timestamp;
          url: string;
        }[] = [];

        const episodesFromDB = await admin
          .firestore()
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
            return;
          }
          const pubDateFromDB = fromDB.pubDate;
          // pubDateに変更がない場合は処理を終了する
          if (episodeData.pubDate.isEqual(pubDateFromDB)) {
            return;
          }
          // エピソードの更新を行う
          await episodeFromDB.ref.update(episodeData);
          updatedEpisodes.push({
            episodeId: episodeFromDB.id,
            pubDate: episodeData.pubDate,
            url: episodeData.url,
          });
        });
        await Promise.all(updateEpisodesPromises);

        // 新規エピソードを追加する
        const newEpisodes = episodes.filter(
          (episode) =>
            !episodeFromDBDocs.some((episodeFromDB) => episodeFromDB.data().guid === episode.guid),
        );
        const channelRef = admin.firestore().collection(CHANNEL_DOCUMENT_NAME).doc(channelDoc.id);
        const newEpisodesPromises = newEpisodes.map(async (episode) => {
          const addedEpisode = await channelRef.collection(EPISODE_DOCUMENT_NAME).add(episode);
          updatedEpisodes.push({
            episodeId: addedEpisode.id,
            pubDate: episode.pubDate,
            url: episode.url,
          });
        });
        await Promise.all(newEpisodesPromises);

        console.log('updatedEpisodesLength', updatedEpisodes.length);

        // トランスクリプト生成対象のエピソードをpendingEpisodesに追加する
        // TODO: 広告が変更可能なShowは音声の中身が頻繁に変わるのでトランスクリプト生成対象外とする
        if (channelFromDB.hasChangeableAd) {
          return;
        }
        const pendingEpisodesPromises = updatedEpisodes.map(async (episode) => {
          // pubDateが一ヶ月以上前の場合、追加しない
          if (episode.pubDate.toDate() < new Date(new Date().setMonth(new Date().getMonth() - 1))) {
            console.log('追加しない');
            return;
          }
          await admin
            .firestore()
            .collection(TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME)
            .doc(episode.episodeId)
            .set({
              channelId: channelDoc.id,
              pubDate: episode.pubDate,
              url: episode.url,
            });
        });
        await Promise.all(pendingEpisodesPromises);
      }),
    );
  });
