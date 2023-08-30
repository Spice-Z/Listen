import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as os from 'os';
import * as path from 'path';
import { ulid } from 'ulid';
import {
  CHANNEL_DOCUMENT_NAME,
  EPISODE_DOCUMENT_NAME,
  TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME,
  TRANSLATE_PENDING_EPISODES_DOCUMENT_NAME,
} from '../constants';
import { downloadFile, getAudioFileExtensionFromUrl } from '../utils/file';
import { splitAudio } from '../api/ffmpeg';
import { transcribeAudioFiles } from '../api/openAI';
import { uploadSegmentsToGCS } from '../api/firebase';

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY || '';

export const autoGenerateTranscript = functions
  .runWith({
    timeoutSeconds: 300,
  })
  .region('asia-northeast1')
  .pubsub.schedule('every 1 hours')
  .onRun(async (context) => {
    const pendingEpisodesSnapshot = await admin
      .firestore()
      .collection(TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME)
      .get();

    const episodes = pendingEpisodesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        channelId: data.channelId,
        url: data.url,
        title: data.title,
        description: data.content,
      };
    });

    functions.logger.info('pandingEpisodes', {
      length: episodes.length,
    });

    for (const episode of episodes) {
      try {
        const channelRef = admin
          .firestore()
          .collection(CHANNEL_DOCUMENT_NAME)
          .doc(episode.channelId);
        const channelDoc = await channelRef.get();

        if (!channelDoc.exists) {
          throw new functions.https.HttpsError('not-found', 'target channel does not exist.');
        }
        const channelData = channelDoc.data();
        if (!channelData) {
          throw new functions.https.HttpsError('not-found', 'target channel does not exist.');
        }

        const ulId = ulid();
        const targetFileUrl = episode.url;
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

        // const speed = 1.2;
        // await convertSpeed(downloadTargetPath, convertTargetPath, speed);
        const splitSeconds = 60 * 20;
        const chunkFilePaths = await splitAudio(
          downloadTargetDir,
          donwloadTargetName,
          splitSeconds,
        );
        const { segments } = await transcribeAudioFiles({
          apiKey: OPEN_AI_API_KEY,
          audioFilePaths: chunkFilePaths,
          model: 'whisper-1',
          speed: 1,
          splitSeconds,
          channelName: channelData.title,
          episodeName: episode.title,
          episodeDescription: episode.description,
        });
        const transcriptUrl = await uploadSegmentsToGCS({ segments, id: ulId });

        await channelRef.collection(EPISODE_DOCUMENT_NAME).doc(episode.id).update({
          transcriptUrl,
        });

        // 翻訳待ちのドキュメントを作成
        // ひとまず日本語だけ
        await admin
          .firestore()
          .collection(TRANSLATE_PENDING_EPISODES_DOCUMENT_NAME)
          .doc(episode.id)
          .set({
            channelId: episode.channelId,
            transcriptUrl: transcriptUrl,
            langCode: 'ja',
          });

        // トランスクリプトが正常に保存された後、対象のepisodeIdを持つtranscriptPendingEpisodesドキュメントを削除
        await admin
          .firestore()
          .collection(TRANSCRIPT_PENDING_EPISODES_DOCUMENT_NAME)
          .doc(episode.id)
          .delete();
      } catch (error) {
        functions.logger.info('error while transcribing', {
          error,
        });
      }
    }
    return;
  });
