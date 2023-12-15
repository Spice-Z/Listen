import * as Notifications from 'expo-notifications';
import { getTimeFromTrigger } from './utils';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PressableOpacity from '../Pressable/PressableOpacity';
import { theme } from '../styles/theme';
import CloseIcon from '../icons/CloseIcon';
type Props = {
  item: Notifications.NotificationRequest;
  cancelNotification: () => Promise<void>;
};

export const ReminderListItem = memo<Props>(({ item, cancelNotification }) => {
  const title = item.content.title;
  const subTitle = item.content.subtitle;
  const body = item.content.body;
  const { time, ampm } = getTimeFromTrigger(item.trigger);

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.time} adjustsFontSizeToFit numberOfLines={1}>
          {time}
        </Text>
        <Text style={styles.ampm}>{ampm}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subTitle && <Text style={styles.subtitle}>{subTitle}</Text>}
        <Text style={styles.body}>{body}</Text>
      </View>
      <PressableOpacity style={styles.close} onPress={cancelNotification}>
        <CloseIcon width={24} height={24} />
      </PressableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.bgNone,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 16,
    position: 'relative',
    minHeight: 120,
  },
  timeContainer: {
    width: '40%',
  },
  time: {
    fontSize: 80,
    fontWeight: '900',
  },
  ampm: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  content: {
    gap: 6,
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 24,
  },
  subtitle: {
    fontSize: 14,
    color: theme.color.textWeak,
  },
  body: {
    fontSize: 16,
  },
  close: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
