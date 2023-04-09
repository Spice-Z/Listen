export const parseTimestamp = (timestamp) => {
  const [hours, minutes, seconds] = timestamp.split(':').map(parseFloat);
  return hours * 3600 + minutes * 60 + seconds;
};
