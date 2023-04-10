import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CHANNEL_DOCUMENT_NAME } from '../constans';

export const getChannels = functions.region('asia-northeast1').https.onCall(async (_) => {
  // if (request.app == null) {
  //   throw new functions.https.HttpsError(
  //     'failed-precondition',
  //     'The function must be called from an App Check verified app.'
  //   );
  // }

  const snapshot = await admin.firestore().collection(CHANNEL_DOCUMENT_NAME).get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      imageUrl: data.imageUrl,
      description: data.description,
      author: data.author,
      categories: data.categories,
      categoriesWithSubs: data.categoriesWithSubs,
      language: data.language,
      copyright: data.copyright,
    };
  });
});
