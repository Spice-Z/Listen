import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';

import * as Notifications from 'expo-notifications';
import {
  getAllScheduledNotifications,
  registerForPushNotifications,
} from '../../../feature/Notification/notificationControllers';
import { ReminderListItem } from '../../../feature/Reminder/ReminderListItem';
import PressableScale from '../../../feature/Pressable/PressableScale';
import { theme } from '../../../feature/styles/theme';
import PlusIcon from '../../../feature/icons/PlusIcon';
import Spacer from '../../../feature/Spacer/Spacer';

export default function ReminderPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notifications.NotificationRequest[]>([]);
  const updateNotifications = useCallback(async () => {
    const notifications = await getAllScheduledNotifications();
    setNotifications(notifications);
  }, []);

  useFocusEffect(
    useCallback(() => {
      updateNotifications();
    }, [updateNotifications]),
  );

  useEffect(() => {
    const init = async () => {
      await registerForPushNotifications();
      await updateNotifications();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Notifications.NotificationRequest }) => {
      const cancelNotification = async () => {
        await Notifications.cancelScheduledNotificationAsync(item.identifier);
        await updateNotifications();
      };

      return <ReminderListItem item={item} cancelNotification={cancelNotification} />;
    },
    [updateNotifications],
  );
  const ListFooterComponent = useMemo(() => {
    return <Spacer height={120} />;
  }, []);

  const onPressAdd = useCallback(() => {
    router.push('modalCreateReminder');
  }, [router]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Reminder',
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: theme.color.bgMain,
          },
        }}
      />
      <View style={styles.container}>
        <FlatList
          style={styles.listContainer}
          data={notifications}
          renderItem={renderItem}
          ListFooterComponent={ListFooterComponent}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
        <View style={styles.addContainer}>
          <PressableScale onPress={onPressAdd} style={styles.add}>
            <PlusIcon width={28} height={28} color={theme.color.bgNone} />
          </PressableScale>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  addContainer: {
    position: 'absolute',
    bottom: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  add: {
    width: 64,
    height: 64,
    borderRadius: 100,
    backgroundColor: theme.color.accents.normal,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    shadowColor: theme.color.accents.normal,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
});
