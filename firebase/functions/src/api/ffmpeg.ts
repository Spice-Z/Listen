import { execSync } from 'child_process';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import * as path from 'path';
import { getFileExtensionFromFileName } from '../utils/file';

export async function convertSpeed(inputFilePath: string, outputFilePath: string, speed: number) {
  functions.logger.info('convertSpeed');
  try {
    execSync(`ffmpeg -i ${inputFilePath} -filter:a "atempo=${speed}" -vn ${outputFilePath}`);
    functions.logger.info('ffmpeg convert completed');
  } catch (e) {
    functions.logger.info('ffmpeg error', {
      error: e,
    });
    throw e;
  }
}

export async function splitAudio(
  inputFileDir: string,
  inputFileName: string,
  durationSec: number
): Promise<string[]> {
  functions.logger.info('splitAudio');
  const fileExtension = getFileExtensionFromFileName(inputFileName);
  const inputFilePath = path.resolve(inputFileDir, inputFileName);
  const outputFileNamePattern = `${inputFileName}-chunk_%03d.${fileExtension}`;
  const outputFilePath = path.resolve(inputFileDir, outputFileNamePattern);
  try {
    execSync(
      `ffmpeg -i ${inputFilePath} -map 0 -c copy -f segment -segment_time ${durationSec} -reset_timestamps 1 ${outputFilePath}`
    );
    functions.logger.info('ffmpeg split completed');
    const outputFileGlob = outputFileNamePattern.replace('%03d', '.*');
    const files = fs.readdirSync(`${inputFileDir}`);
    const splittedFiles = files.filter((file) => file.match(outputFileGlob));
    const splittedFilePaths = splittedFiles.map((file) => path.resolve(`${inputFileDir}`, file));
    return splittedFilePaths;
  } catch (e) {
    functions.logger.info('ffmpeg error', {
      error: e,
    });
    throw e;
  }
}
