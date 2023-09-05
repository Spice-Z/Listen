import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as os from 'os';
import * as path from 'path';
import { ulid } from 'ulid';
import { CHANNEL_DOCUMENT_NAME, EPISODE_DOCUMENT_NAME } from '../constants';
import { downloadFile } from '../utils/file';
import { uploadTranslationToGCS } from '../api/firebase';
import { translateSegmentsByEach } from '../api/openAI';
import * as fs from 'fs';
import { getLanguageName } from '../utils/language';
const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY || '';

export const generateTranslatedTranscript = functions
  .region('asia-northeast1')
  .runWith({
    timeoutSeconds: 540,
  })
  .https.onCall(async (data, _) => {
    const channelId = data.channelId;
    const episodeId = data.episodeId;
    const langCode: string = data.langCode;

    if (!channelId || !episodeId || !langCode) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with "channelId", "episodeId" and "language" arguments.',
      );
    }
    const language = getLanguageName(langCode);

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
    const transcriptUrl = episodeData.transcriptUrl;

    if (!transcriptUrl) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The episode must have a transcriptUrl before translating.',
      );
    }

    const ulId = ulid();
    const jsonFileDownloadPath = path.resolve(os.tmpdir(), `${ulId}_transcript.json`);
    await downloadFile(transcriptUrl, jsonFileDownloadPath);
    let segmentsData: {
      segments: {
        start: string;
        end: string;
        text: string;
      }[];
    };
    try {
      const data = fs.readFileSync(jsonFileDownloadPath, 'utf-8');
      segmentsData = JSON.parse(data);
    } catch (error) {
      console.error(`Error while reading JSON file: ${error}`);
      throw error;
    }

    const translatedTranscriptContent = await translateSegmentsByEach({
      apiKey: OPEN_AI_API_KEY,
      segments: segmentsData.segments,
      originalLanguage: 'English',
      targetLanguage: language,
    });
    const translatedTranscriptUrl = await uploadTranslationToGCS({
      segments: translatedTranscriptContent,
      id: ulId,
    });
    const translatedTranscripts = episodeData.translatedTranscripts || {};
    translatedTranscripts[langCode] = translatedTranscriptUrl;

    await episodeRef.update({
      translatedTranscripts,
    });

    console.log('translate Succeed');
    return;
  });
