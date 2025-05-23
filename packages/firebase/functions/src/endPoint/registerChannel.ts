import * as functions from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { CHANNEL_DOCUMENT_NAME, TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME } from '../constants.js';
import { fetchAndSavePodcast } from '../services/fetchAndSavePodcast.js';

export const registerChannel = functions
  .runWith({
    timeoutSeconds: 300,
  })
  .region('asia-northeast1')
  .https.onCall(async (data: { url: string }, context: functions.https.CallableContext) => {
    // if (!context.auth) {
    //   throw new functions.https.HttpsError(
    //     'unauthenticated',
    //     'The function must be called while authenticated.'
    //   );
    // }
    const store = getFirestore();

    const feedUrl = data.url;
    if (!feedUrl) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a "url" argument.',
      );
    }

    const existingChannelSnapshot = await store
      .collection(CHANNEL_DOCUMENT_NAME)
      .where('feedUrl', '==', feedUrl)
      .get();

    if (!existingChannelSnapshot.empty) {
      throw new functions.https.HttpsError('already-exists', 'The channel is already registered.');
    }

    const { channelId, upDatedEpisodes: episodes } = await fetchAndSavePodcast(feedUrl);

    const pendingEpisodesPromises = episodes.map(async (episode) => {
      if (!episode.pubDate || !episode.episodeId) {
        return;
      }
      // pubDateが3日以上前の場合、トランスクリプトを更新しない
      if (episode.pubDate.valueOf() < new Date().valueOf() - 1000 * 60 * 60 * 24 * 3) {
        return;
      }
      await store.collection(TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME).doc(episode.episodeId).set({
        channelId: channelId,
        pubDate: episode.pubDate,
        url: episode.url,
      });
    });
    await Promise.all(pendingEpisodesPromises);

    return { success: true };
  });
