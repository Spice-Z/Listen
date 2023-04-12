import { format } from 'date-fns';

export const formatDMMMYY = (date: Date) => {
  const formattedDate = format(date, 'd MMM yy');
  return formattedDate;
};
