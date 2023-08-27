import { format } from 'date-fns';

export const formatDMMMYY = (unixTime: number) => {
  const date = new Date(unixTime * 1000);
  const formattedDate = format(date, 'd MMM yyyy');
  return formattedDate;
};
