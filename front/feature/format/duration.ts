export function formatDuration(input: number | string): string {
  let totalSeconds: number;

  if (typeof input === 'string') {
    if (input.includes(':')) {
      const parts = input.split(':').map(Number);
      totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else {
      totalSeconds = Number(input);
    }
  } else {
    totalSeconds = input;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}min`;
  }

  return `${hours}h${minutes}min`;
}
