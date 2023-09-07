import * as functions from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { ulid } from 'ulid';
import {
  CHANNEL_DOCUMENT_NAME,
  EPISODE_DOCUMENT_NAME,
  TRANSLATE_PENDING_EPISODES_DOCUMENT_NAME,
} from '../constants.js';
import { downloadFile } from '../utils/file.js';
import { uploadTranslationToGCS } from '../api/firebase.js';
import { translateSegmentsByEach } from '../api/openAI.js';

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY || '';

export const autoGenerateTranslatedTranscript = functions
  .runWith({
    timeoutSeconds: 540,
  })
  .region('asia-northeast1')
  .pubsub.schedule('every 2 hours')
  .onRun(async (context) => {
    const store = getFirestore();
    const pendingEpisodesSnapshot = await store
      .collection(TRANSLATE_PENDING_EPISODES_DOCUMENT_NAME)
      .get();

    const episodes = pendingEpisodesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        channelId: data.channelId,
        url: data.url,
        langCode: data.langCode,
      };
    });

    functions.logger.info(`translate pending Episodes length: ${episodes.length}`);

    for (const episode of episodes) {
      try {
        const episodeRef = store
          .collection(CHANNEL_DOCUMENT_NAME)
          .doc(episode.channelId)
          .collection(EPISODE_DOCUMENT_NAME)
          .doc(episode.id);

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
          targetLanguage: episode.langCode,
        });
        const translatedTranscriptUrl = await uploadTranslationToGCS({
          segments: translatedTranscriptContent,
          id: ulId,
        });

        // 他の処理でDBのtranslatedTranscriptsが更新されている可能性があるので、
        // ここで再度取得して更新する
        const latestEpisodeSnapshot = await episodeRef.get();
        const latestEpisodeData = latestEpisodeSnapshot.data();
        if (!latestEpisodeData) {
          throw new functions.https.HttpsError('failed-precondition', 'The episode is not found.');
        }
        const translatedTranscripts = latestEpisodeData.translatedTranscripts || {};
        translatedTranscripts[episode.langCode] = translatedTranscriptUrl;

        await episodeRef.update({
          translatedTranscripts,
        });

        functions.logger.info('delete translate pending', {
          episodeId: episode.id,
          channelId: episode.channelId,
          DBName: TRANSLATE_PENDING_EPISODES_DOCUMENT_NAME,
        });

        // トランスクリプトが正常に保存された後、対象のepisodeIdを持つtranscriptPendingEpisodesドキュメントを削除
        await store.collection(TRANSLATE_PENDING_EPISODES_DOCUMENT_NAME).doc(episode.id).delete();
      } catch (error) {
        functions.logger.info('error while transcribing', {
          error,
        });
      }
    }
    return;
  });
