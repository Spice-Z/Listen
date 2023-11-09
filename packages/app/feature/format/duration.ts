export function getTotalSeconds(input: number | string): number {
  let totalSeconds: number;

  if (typeof input === 'string') {
    if (input.includes(':')) {
      const parts = input.split(':').map(Number);
      if (parts.length === 1) {
        totalSeconds = parts[0];
      } else if (parts.length === 2) {
        totalSeconds = parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
    } else {
      totalSeconds = Number(input);
    }
  } else {
    totalSeconds = input;
  }
  return totalSeconds;
}

export function formatDuration(input: number | string): string {
  const totalSeconds = getTotalSeconds(input);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}min`;
  }

  return `${hours}h${minutes}min`;
}

// 秒を分:秒に変換する
// 少数点以下は切り捨てる
export function formatSecToMin(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
