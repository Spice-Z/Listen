import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import * as Notifications from 'expo-notifications';
import {
  getAllScheduledNotifications,
  registerForPushNotifications,
  registerNotification,
} from '../../../feature/Notification/notificationControllers';
import { ReminderListItem } from '../../../feature/Reminder/ReminderListItem';
import PressableScale from '../../../feature/Pressable/PressableScale';
import { theme } from '../../../feature/styles/theme';
import PlusIcon from '../../../feature/icons/PlusIcon';
import CreateReminderBottomSheet, {
  CreateReminderBottomSheetHandler,
} from '../../../feature/BottomSheet/CreateReminderBottomSheet';
import Spacer from '../../../feature/Spacer/Spacer';

export default function ReminderPage() {
  const [notifications, setNotifications] = useState<Notifications.NotificationRequest[]>([]);
  const updateNotifications = useCallback(async () => {
    const notifications = await getAllScheduledNotifications();
    setNotifications(notifications);
  }, []);

  useEffect(() => {
    const init = async () => {
      await registerForPushNotifications();
      await updateNotifications();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNotification = useCallback(
    async (props: {
      title: string;
      subTitle: string;
      body: string;
      trigger: Notifications.DailyTriggerInput;
    }) => {
      await registerNotification(props);
      await updateNotifications();
    },
    [updateNotifications],
  );

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

  const playSettingBottomSheetRef = useRef<CreateReminderBottomSheetHandler>(null);
  const toggleBottomSheet = useCallback(() => {
    if (playSettingBottomSheetRef.current) {
      playSettingBottomSheetRef.current.toggleBottomSheet();
    }
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Reminder', animation: 'slide_from_right' }} />
      <View style={styles.container}>
        <FlatList
          style={styles.listContainer}
          data={notifications}
          renderItem={renderItem}
          ListFooterComponent={ListFooterComponent}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
        <View style={styles.addContainer}>
          <PressableScale onPress={toggleBottomSheet} style={styles.add}>
            <PlusIcon width={28} height={28} color={theme.color.bgNone} />
          </PressableScale>
        </View>
        <CreateReminderBottomSheet
          ref={playSettingBottomSheetRef}
          addNotification={addNotification}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});
