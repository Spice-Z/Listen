import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../constans';

const PAGE_SIZE = 30;

export const getEpisodesByChannelId = functions
  .region('asia-northeast1')
  .https.onCall(async (data, _) => {
    // if (request.app == null) {
    //   throw new functions.https.HttpsError(
    //     'failed-precondition',
    //     'The function must be called from an App Check verified app.'
    //   );
    // }
    const channelId = data.channelId;
    const page = data.page || 1;

    if (!channelId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a "channelId" argument.'
      );
    }

    const channelRef = admin.firestore().collection(CHANNEL_DOCUMENT_NAME).doc(channelId);
    const channelDoc = await channelRef.get();

    if (!channelDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'The specified channel does not exist.');
    }

    const offset = (page - 1) * PAGE_SIZE;
    const episodesSnapshot = await channelRef
      .collection(EPISODE_DOCUMENT_NAME)
      .orderBy('pubDate', 'desc')
      .offset(offset)
      .limit(PAGE_SIZE)
      .get();

    const episodesData = episodesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        url: data.url,
        transcriptUrl: data.transcriptUrl,
        imageUrl: data.imageUrl,
        content: data.content,
        duration: data.duration,
        pubDate: data.pubDate,
        season: data.season,
        episode: data.episode,
      };
    });

    return episodesData;
  });
