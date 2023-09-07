import * as functions from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';

import {
  AVAILABLE_EPISODES_DOCUMENT_NAME,
  CHANNEL_DOCUMENT_NAME,
  EPISODE_DOCUMENT_NAME,
} from '../constants.js';

export const getAvailableEpisodes = functions
  .region('asia-northeast1')
  .https.onCall(async (_, context: functions.https.CallableContext) => {
    // if (!context.auth) {
    //   throw new functions.https.HttpsError(
    //     'unauthenticated',
    //     'The function must be called while authenticated.'
    //   );
    const store = getFirestore();

    const availableEpisodesSnapshot = await store
      .collection(AVAILABLE_EPISODES_DOCUMENT_NAME)
      .orderBy('pubDate', 'desc')
      .limit(20)
      .get();

    const episodes: any[] = [];
    const episodesChannelIds: { [key: string]: string } = {};

    for (const availableEpisodeDoc of availableEpisodesSnapshot.docs) {
      const episodeId = availableEpisodeDoc.id;
      const channelId = availableEpisodeDoc.data().channelId;

      const episodeRef = store
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
      episodesChannelIds[episodeId] = channelId;
    }

    return {
      episodes,
      episodesChannelIds,
    };
  });
