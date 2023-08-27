import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as os from 'os';
import * as path from 'path';
import { ulid } from 'ulid';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../constants';
import { downloadFile, getAudioFileExtensionFromUrl } from '../utils/file';
import { convertSpeed, splitAudio } from '../api/ffmpeg';
import { transcribeAudioFiles } from '../api/openAI';
import { uploadSegmentsToGCS } from '../api/firebase';

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY || '';

export const generateTranscriptFromIds = functions
  .region('asia-northeast1')
  .runWith({
    timeoutSeconds: 540,
  })
  .https.onCall(async (data, _) => {
    const channelId = data.channelId;
    const episodeId = data.episodeId;

    if (!channelId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a "channelId" argument.',
      );
    }

    if (!episodeId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with an "episodeId" argument.',
      );
    }

    const episodeRef = admin
      .firestore()
      .collection(CHANNEL_DOCUMENT_NAME)
      .doc(channelId)
      .collection(EPISODE_DOCUMENT_NAME)
      .doc(episodeId);

    const episodeSnapshot = await episodeRef.get();
    const episodeData = episodeSnapshot.data();
    if (!episodeData) {
      throw new functions.https.HttpsError('failed-precondition', 'The episode is not found.');
    }
    const targetFileUrl = episodeData.url;

    const ulId = ulid();
    const fileExtension = getAudioFileExtensionFromUrl(targetFileUrl);
    if (fileExtension === null) {
      return;
    }
    const downloadTargetPath = path.resolve(os.tmpdir(), `${ulId}_download.${fileExtension}`);
    await downloadFile(targetFileUrl, downloadTargetPath);
    const convertTargetDir = path.resolve(os.tmpdir());
    const convertTargetFileName = `${ulId}_converted.${fileExtension}`;
    const convertTargetPath = path.resolve(convertTargetDir, convertTargetFileName);

    const speed = 1.2;
    await convertSpeed(downloadTargetPath, convertTargetPath, speed);
    const splitSeconds = 60 * 20;
    const chunkFilePaths = await splitAudio(convertTargetDir, convertTargetFileName, splitSeconds);
    const { segments } = await transcribeAudioFiles({
      apiKey: OPEN_AI_API_KEY,
      audioFilePaths: chunkFilePaths,
      model: 'whisper-1',
      speed,
      splitSeconds,
    });
    const transcriptUrl = await uploadSegmentsToGCS({ segments, id: ulId });

    await episodeRef.update({
      transcriptUrl,
    });

    return;
  });
