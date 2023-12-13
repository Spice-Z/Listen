import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const getAllScheduledNotifications = async () => {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  return notifications;
};

export const registerNotification = async ({
  title,
  subtitle,
  body,
  trigger,
}: {
  title: string;
  subtitle?: string;
  body: string;
  trigger: Notifications.NotificationTriggerInput;
}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      subtitle,
      body,
    },
    trigger,
  });
};

export async function registerForPushNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  }

  return;
}
