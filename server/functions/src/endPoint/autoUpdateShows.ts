import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CHANNEL_DOCUMENT_NAME, TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME } from '../constants';
import { fetchAndSavePodcast } from '../services/fetchAndSavePodcast';

export const autoUpdateShows = functions
  .runWith({
    timeoutSeconds: 300,
  })
  .region('asia-northeast1')
  .pubsub.schedule('every 2 hours')
  .onRun(async (context) => {
    const snapshot = await admin.firestore().collection(CHANNEL_DOCUMENT_NAME).get();
    await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const { channelId, upDatedEpisodes: episodes } = await fetchAndSavePodcast(data.feedUrl);

        // TODO: 開発中はコストを抑えるため、特定Showのみでトランスクリプト生成を行う
        if (channelId !== '8Q7yb9qiVaWZ3YN1Zwrq') {
          return;
        }
        const pendingEpisodesPromises = episodes.map(async (episode) => {
          // TODO: 一ヶ月以上前のエピソードはトランスクリプト生成対象外とする
          // if (episode.pubDate.toDate() < new Date(new Date().setMonth(new Date().getMonth() - 1))) {
          //   return;
          // }
          await admin
            .firestore()
            .collection(TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME)
            .doc(episode.episodeId)
            .set({
              channelId: channelId,
              pubDate: episode.pubDate,
              url: episode.url,
            });
        });
        await Promise.all(pendingEpisodesPromises);
      })
    );
  });
