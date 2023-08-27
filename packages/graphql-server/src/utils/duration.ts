export function getTotalSeconds(input: number | string): number {
  let totalSeconds: number = 0;

  if (typeof input === 'string') {
    if (input.includes(':')) {
      const parts = input.split(':').map(Number);
      if (parts.length === 1) {
        totalSeconds = parts[0];
      } else if (parts.length === 2) {
        totalSeconds = parts[0] * 60 + parts[1];
      } else if (parts.length >= 3) {
        console.log(parts);
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
