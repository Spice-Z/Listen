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

export function formatSecToMin(input: number | string): string {
  const totalSeconds = getTotalSeconds(input);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
