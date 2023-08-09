import * as admin from 'firebase-admin';

import {
  CLOUD_STORAGE_TRANSCRIPTION_SEGMENTS_DIR_PATH,
  CLOUD_STORAGE_TRANSCRIPTION_TRANSLATION_DIR_PATH,
} from '../constants';

export const uploadSegmentsToGCS = async ({
  segments,
  id,
}: {
  segments: { start: number; end: number; text: string }[];
  id: string;
}): Promise<string> => {
  const roundedSegments = segments.map(({ start, end, text }) => ({
    start: start.toFixed(2),
    end: end.toFixed(2),
    text,
  }));
  const segmentsJson = JSON.stringify({ segments: roundedSegments });
  const bucket = admin.storage().bucket();
  const segmentsFirebaseFile = bucket.file(
    `${CLOUD_STORAGE_TRANSCRIPTION_SEGMENTS_DIR_PATH}/${id}.json`
  );
  await segmentsFirebaseFile.save(segmentsJson, {
    contentType: 'application/json',
  });
  await segmentsFirebaseFile.makePublic();
  return segmentsFirebaseFile.publicUrl();
};

export const uploadTranslationToGCS = async ({
  segments,
  id,
}: {
  segments: { start: string; end: string; text: string }[];
  id: string;
}): Promise<string> => {
  const segmentsJson = JSON.stringify({ segments });
  const bucket = admin.storage().bucket();
  const segmentsFirebaseFile = bucket.file(
    `${CLOUD_STORAGE_TRANSCRIPTION_TRANSLATION_DIR_PATH}/${id}.json`
  );
  await segmentsFirebaseFile.save(segmentsJson, {
    contentType: 'application/json',
  });
  await segmentsFirebaseFile.makePublic();
  return segmentsFirebaseFile.publicUrl();
};
