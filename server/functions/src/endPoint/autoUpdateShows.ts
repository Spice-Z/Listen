import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CHANNEL_DOCUMENT_NAME, TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME } from '../constans';
import { fetchAndSavePodcast } from '../services/fetchAndSavePodcast';

export const autoUpdateShows = functions
  .runWith({
    timeoutSeconds: 300,
  })
  .region('asia-northeast1')
  .pubsub.schedule('every 1 minutes')
  .onRun(async (context) => {
    const snapshot = await admin.firestore().collection(CHANNEL_DOCUMENT_NAME).get();
    await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const { channelId, episodes } = await fetchAndSavePodcast(data.feedUrl);

        // TODO: 開発中はコストを抑えるため、特定Showのみでトランスクリプト生成を行う
        if (channelId !== '8Q7yb9qiVaWZ3YN1Zwrq') {
          return;
        }

        const pendingEpisodesPromises = episodes.map(async (episode) => {
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
