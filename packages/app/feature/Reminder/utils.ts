import { NotificationTrigger } from 'expo-notifications';

export const getTimeFromTrigger = (
  trigger: NotificationTrigger,
): {
  time: string;
  ampm: 'AM' | 'PM';
} => {
  if (trigger.type === 'daily') {
    const hour = trigger.hour;
    const minute = trigger.minute;
    const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return {
      time: `${hour % 12}:${minuteString}`,
      ampm,
    };
  }
  if (trigger.type === 'calendar') {
    const date = trigger.dateComponents;
    const hour = date.hour;
    const minute = date.minute;
    const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return {
      time: `${hour % 12}:${minuteString}`,
      ampm,
    };
  }
  return {
    time: '',
    ampm: 'AM',
  };
};
