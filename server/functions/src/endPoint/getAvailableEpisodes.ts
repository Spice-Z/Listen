import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import {
  AVAILABLE_EPISODES_DOCUMENT_NAME,
  CHANNEL_DOCUMENT_NAME,
  EPISODE_DOCUMENT_NAME,
} from '../constants';

export const getAvailableEpisodes = functions
  .region('asia-northeast1')
  .https.onCall(async (_, context: functions.https.CallableContext) => {
    // if (!context.auth) {
    //   throw new functions.https.HttpsError(
    //     'unauthenticated',
    //     'The function must be called while authenticated.'
    //   );

    const availableEpisodesSnapshot = await admin
      .firestore()
      .collection(AVAILABLE_EPISODES_DOCUMENT_NAME)
      .orderBy('pubDate', 'desc')
      .limit(20)
      .get();

    const episodes: any[] = [];

    for (const availableEpisodeDoc of availableEpisodesSnapshot.docs) {
      const episodeId = availableEpisodeDoc.id;
      const channelId = availableEpisodeDoc.data().channelId;

      const episodeRef = admin
        .firestore()
        .collection(CHANNEL_DOCUMENT_NAME)
        .doc(channelId)
        .collection(EPISODE_DOCUMENT_NAME)
        .doc(episodeId);

      const episodeSnapshot = await episodeRef.get();
      const episodeData = episodeSnapshot.data();
      if (episodeData == null) {
        return;
      }
      episodes.push({
        ...episodeData,
        id: episodeId,
        channelId,
        pubDate: episodeData.pubDate,
      });
    }

    return episodes;
  });
