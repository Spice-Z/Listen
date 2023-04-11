import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as os from 'os';
import * as path from 'path';
import { ulid } from 'ulid';
import {
  CHANNEL_DOCUMENT_NAME,
  EPISODE_DOCUMENT_NAME,
  TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME,
} from '../constans';
import { downloadFile, getAudioFileExtensionFromUrl } from '../utils/file';
import { convertSpeed, splitAudio } from '../api/ffmpeg';
import { transcribeAudioFiles } from '../api/openAI';
import { uploadSegmentsToGCS } from '../api/firebase';

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY || '';

export const generateTranscript = functions
  .region('asia-northeast1')
  .runWith({
    timeoutSeconds: 540,
  })
  .https.onCall(async (data, _) => {
    // if (request.app == null) {
    //   throw new functions.https.HttpsError(
    //     'failed-precondition',
    //     'The function must be called from an App Check verified app.'
    //   );
    // }
    const channelId = data.channelId;

    if (!channelId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a "channelId" argument.'
      );
    }

    if (!data.targetDate) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a "targetDate" argument.'
      );
    }
    const targetDate = new Date(data.targetDate);

    const channelRef = admin.firestore().collection(CHANNEL_DOCUMENT_NAME).doc(channelId);
    const pendingEpisodesSnapshot = await admin
      .firestore()
      .collection(TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME)
      .where('channelId', '==', channelId)
      .where('pubDate', '>', targetDate)
      .get();

    const episodes = pendingEpisodesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        channelId: data.channelId,
        url: data.url,
      };
    });

    console.log(`episodes length: ${episodes.length}`);

    for (const episode of episodes) {
      try {
        const ulId = ulid();
        const targetFileUrl = episode.url;
        const fileExtension = getAudioFileExtensionFromUrl(targetFileUrl);
        if (fileExtension === null) {
          return;
        }
        const downloadTargetPath = path.resolve(os.tmpdir(), `${ulId}_download.${fileExtension}`);
        await downloadFile(targetFileUrl, downloadTargetPath);
        const convertTargetDir = path.resolve(os.tmpdir());
        const convertTargetFileName = `${ulId}_converted.${fileExtension}`;
        const convertTargetPath = path.resolve(convertTargetDir, convertTargetFileName);

        const speed = 1.4;
        await convertSpeed(downloadTargetPath, convertTargetPath, speed);

        const chunkFilePaths = await splitAudio(convertTargetDir, convertTargetFileName, 60 * 20);
        const { segments } = await transcribeAudioFiles({
          apiKey: OPEN_AI_API_KEY,
          audioFilePaths: chunkFilePaths,
          model: 'whisper-1',
          speed,
        });
        const transcriptUrl = await uploadSegmentsToGCS({ segments, id: ulId });

        console.log('update channel collection');
        await channelRef.collection(EPISODE_DOCUMENT_NAME).doc(episode.id).update({
          transcriptUrl,
        });
        console.log('update channel collection done');

        // トランスクリプトが正常に保存された後、対象のepisodeIdを持つtranscriptPendingEpisodesドキュメントを削除
        await admin
          .firestore()
          .collection(TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME)
          .doc(episode.id)
          .delete();
        console.log('delete episode done');
      } catch (error) {
        functions.logger.info('error while transcribing', {
          error,
        });
      }
    }
    return;
  });
