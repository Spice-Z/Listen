import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../constants';
import { IEpisode } from '../types/IEpisode';
import { getTotalSeconds } from '../utils/duration';

export const getEpisodeById = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context: functions.https.CallableContext) => {
    // if (request.app == null) {
    //   throw new functions.https.HttpsError(
    //     'failed-precondition',
    //     'The function must be called from an App Check verified app.'
    //   );
    // }
    const channelId = data.channelId;
    const episodeId = data.episodeId;

    if (!channelId || !episodeId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with "channelId" and "episodeId" arguments.'
      );
    }

    const channelRef = admin.firestore().collection(CHANNEL_DOCUMENT_NAME).doc(channelId);
    const channelDoc = await channelRef.get();

    if (!channelDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'The specified channel does not exist.');
    }

    const episodeDoc = await channelRef.collection(EPISODE_DOCUMENT_NAME).doc(episodeId).get();

    if (!episodeDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'The specified episode does not exist.');
    }

    const episodeData = episodeDoc.data();
    if (!episodeData) {
      throw new functions.https.HttpsError('not-found', 'The specified episode does not exist.');
    }

    const episode: IEpisode = {
      id: episodeDoc.id,
      title: episodeData.title,
      description: episodeData.description,
      url: episodeData.url,
      transcriptUrl: episodeData.transcriptUrl,
      imageUrl: episodeData.imageUrl,
      content: episodeData.content,
      duration: getTotalSeconds(episodeData.duration),
      pubDate: episodeData.pubDate,
      season: episodeData.season,
      episode: episodeData.episode,
      translatedTranscripts: episodeData.translatedTranscripts || {},
    };
    return episode;
  });
