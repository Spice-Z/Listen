import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CHANNEL_DOCUMENT_NAME } from '../constants';
import { fetchAndSavePodcast } from '../services/fetchAndSavePodcast';

export const updateShow = functions
  .runWith({
    timeoutSeconds: 300,
  })
  .region('asia-northeast1')
  .https.onCall(async (data: { channelId: string }, context: functions.https.CallableContext) => {
    // if (!context.auth) {
    //   throw new functions.https.HttpsError(
    //     'unauthenticated',
    //     'The function must be called while authenticated.'
    //   );
    // }

    const channelId = data.channelId;
    if (!channelId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a "channelId" argument.',
      );
    }

    const channelRef = admin.firestore().collection(CHANNEL_DOCUMENT_NAME).doc(channelId);
    const channelSnapshot = await channelRef.get();

    if (!channelSnapshot.exists) {
      throw new functions.https.HttpsError('already-exists', 'The channel is already registered.');
    }
    const channelData = channelSnapshot.data();

    if (channelData === undefined) {
      throw new functions.https.HttpsError('not-found', 'The requested channel does not exist.');
    }

    await fetchAndSavePodcast(channelData.feedUrl);
  });
