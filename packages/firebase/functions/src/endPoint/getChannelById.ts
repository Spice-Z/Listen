import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CHANNEL_DOCUMENT_NAME } from '../constants';

export const getChannelById = functions.region('asia-northeast1').https.onCall(async (data, _) => {
  // if (request.app == null) {
  //   throw new functions.https.HttpsError(
  //     'failed-precondition',
  //     'The function must be called from an App Check verified app.'
  //   );
  // }
  const channelId = data.id;

  if (!channelId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with an "id" argument.'
    );
  }

  const channelDoc = await admin.firestore().collection(CHANNEL_DOCUMENT_NAME).doc(channelId).get();

  if (!channelDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'The requested channel does not exist.');
  }

  const channelData = channelDoc.data();

  if (channelData === undefined) {
    throw new functions.https.HttpsError('not-found', 'The requested channel does not exist.');
  }

  return {
    id: channelDoc.id,
    title: channelData.title,
    imageUrl: channelData.imageUrl,
    description: channelData.description,
    author: channelData.author,
    categories: channelData.categories,
    categoriesWithSubs: channelData.categoriesWithSubs,
    language: channelData.language,
    copyright: channelData.copyright,
  };
});
