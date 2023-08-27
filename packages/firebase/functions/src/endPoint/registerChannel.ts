import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CHANNEL_DOCUMENT_NAME, TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME } from '../constants';
import { fetchAndSavePodcast } from '../services/fetchAndSavePodcast';

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

    const feedUrl = data.url;
    if (!feedUrl) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a "url" argument.',
      );
    }

    const existingChannelSnapshot = await admin
      .firestore()
      .collection(CHANNEL_DOCUMENT_NAME)
      .where('feedUrl', '==', feedUrl)
      .get();

    if (!existingChannelSnapshot.empty) {
      throw new functions.https.HttpsError('already-exists', 'The channel is already registered.');
    }

    const { channelId, upDatedEpisodes: episodes } = await fetchAndSavePodcast(feedUrl);

    const pendingEpisodesPromises = episodes.map(async (episode) => {
      // pubDateが一ヶ月以上前の場合、トランスクリプトを更新しない
      if (
        episode.pubDate.valueOf() <
        new Date(new Date().setMonth(new Date().getMonth() - 1)).valueOf()
      ) {
        return;
      }
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

    return { success: true };
  });
