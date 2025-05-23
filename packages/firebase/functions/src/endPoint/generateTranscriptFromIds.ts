import * as functions from 'firebase-functions';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { ulid } from 'ulid';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../constants.js';
import { downloadFile, getAudioFileExtensionFromUrl } from '../utils/file.js';
import { splitAudio } from '../api/ffmpeg.js';
import { transcribeAudioFiles } from '../api/openAI.js';
import { uploadSegmentsToGCS } from '../api/firebase.js';
import { getFirestore } from 'firebase-admin/firestore';

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
    const firestore = getFirestore();
    const channelDoc = await firestore.collection(CHANNEL_DOCUMENT_NAME).doc(channelId).get();
    const channelData = channelDoc.data();
    if (!channelData) {
      throw new functions.https.HttpsError('failed-precondition', 'The channel is not found.');
    }
    const episodeRef = firestore
      .collection(CHANNEL_DOCUMENT_NAME)
      .doc(channelId)
      .collection(EPISODE_DOCUMENT_NAME)
      .doc(episodeId);

    const episodeDoc = await episodeRef.get();
    const episodeData = episodeDoc.data();
    if (!episodeData) {
      throw new functions.https.HttpsError('failed-precondition', 'The episode is not found.');
    }
    const targetFileUrl = episodeData.url;

    const ulId = ulid();
    const fileExtension = getAudioFileExtensionFromUrl(targetFileUrl);
    if (fileExtension === null) {
      return;
    }
    const downloadTargetDir = path.resolve(os.tmpdir());
    const donwloadTargetName = `${ulId}_download.${fileExtension}`;
    const downloadTargetPath = path.resolve(downloadTargetDir, donwloadTargetName);
    await downloadFile(targetFileUrl, downloadTargetPath);
    // const convertTargetDir = path.resolve(os.tmpdir());
    // const convertTargetFileName = `${ulId}_converted.${fileExtension}`;
    // const convertTargetPath = path.resolve(convertTargetDir, convertTargetFileName);

    // const speed = 1.1;
    // await convertSpeed(downloadTargetPath, convertTargetPath, speed);
    const splitSeconds = 60 * 20;
    const chunkFilePaths = await splitAudio(downloadTargetDir, donwloadTargetName, splitSeconds);
    const { segments } = await transcribeAudioFiles({
      apiKey: OPEN_AI_API_KEY,
      audioFilePaths: chunkFilePaths,
      model: 'whisper-1',
      speed: 1,
      splitSeconds,
      channelName: channelData.title,
      episodeName: episodeData.title,
      episodeDescription: episodeData.content,
      includeInfoInPrompt: channelData.includeInfoInPrompt,
    });
    const transcriptUrl = await uploadSegmentsToGCS({ segments, id: ulId });
    console.log({ transcriptUrl });

    // 使い終わった元音源ファイルをunlink
    await Promise.all(
      [downloadTargetPath, ...chunkFilePaths].map((filePath) => {
        return new Promise((resolve, reject) => {
          fs.unlink(filePath, (err) => {
            if (err) {
              reject(err);
            }
            resolve('deleted');
          });
        });
      }),
    );

    await episodeRef.update({
      transcriptUrl,
    });

    return;
  });
