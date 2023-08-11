import axios from 'axios';
import { createWriteStream } from 'fs';
import * as stream from 'stream';
import { promisify } from 'util';

export function getAudioFileExtensionFromUrl(url: string) {
  if (url === '') return null;

  try {
    const { pathname } = new URL(url);
    // pathname末尾で音声ファイルの拡張子を判断
    const pattern = /\.(mp3|m4a|mp4|aac|wav)$/i;
    const match = pathname.match(pattern);

    if (match) {
      return match[1];
    }

    // パターンに一致しない場合はnullを返す
    return null;
  } catch (_error) {
    return null;
  }
}

export async function downloadFile(url: string, downloadTargetPath: string): Promise<void> {
  const finished = promisify(stream.finished);
  const writer = createWriteStream(downloadTargetPath);
  await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  }).then((response) => {
    response.data.pipe(writer);
    return finished(writer);
  });
}

export function getFileExtensionFromFileName(filename: string) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return ''; // ファイル名にドットがない場合、拡張子がないとみなす
  return filename.slice(lastDotIndex + 1);
}
