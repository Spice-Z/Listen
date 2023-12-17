import { Platform, StyleSheet, TextInput, View, Text } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { theme } from '../feature/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackDownButton from '../feature/Header/BackDownButton';
import { useCallback, useMemo, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { registerNotification } from '../feature/Notification/notificationControllers';
import Spacer from '../feature/Spacer/Spacer';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import PressableOpacity from '../feature/Pressable/PressableOpacity';

const CreateReminder = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const addNotification = useCallback(
    async (props: {
      title: string;
      subtitle?: string;
      body: string;
      trigger: Notifications.DailyTriggerInput;
    }) => {
      await registerNotification(props);
    },
    [],
  );
  const showTimepicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: 'time',
      is24Hour: true,
    });
  };
  const [date, setDate] = useState(new Date());
  const hour = useMemo(() => {
    return date.getHours();
  }, [date]);
  const minute = useMemo(() => {
    return date.getMinutes();
  }, [date]);
  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const [title, setTitle] = useState<string>('英語の勉強をしよう！');
  const [body, setBody] = useState<string>('毎日やるって決めたよね？');

  const onPress = useCallback(async () => {
    await addNotification({
      title,
      body,
      trigger: {
        hour: hour,
        minute: minute,
        repeats: true,
      },
    });
    navigation.goBack();
  }, [addNotification, body, hour, minute, navigation, title]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'New Reminder',
          headerLeft: () => <BackDownButton />,
        }}
      />
      <View
        style={[
          styles.container,
          {
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <Spacer height={12} />
        {Platform.OS === 'ios' ? (
          <View style={styles.times}>
            <DateTimePicker
              themeVariant="light"
              style={styles.iosTimePicker}
              textColor={theme.color.textMain}
              accentColor={theme.color.accents.normal}
              value={date}
              mode="time"
              display="default"
              onChange={onChange}
            />
          </View>
        ) : (
          <PressableOpacity onPress={showTimepicker} style={styles.times}>
            <Text style={styles.time}>{hour}</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.time}>{minute}</Text>
          </PressableOpacity>
        )}
        <Spacer height={12} />
        <Text style={styles.inputTitle}>Title</Text>
        <Spacer height={4} />
        <TextInput value={title} onChangeText={setTitle} style={styles.textInput} />
        <Spacer height={12} />
        <Text style={styles.inputTitle}>Message</Text>
        <Spacer height={4} />
        <TextInput value={body} onChangeText={setBody} style={styles.textInput} />
        <Spacer height={20} />
        <View style={styles.registerContainer}>
          <PressableOpacity style={styles.register} onPress={onPress}>
            <Text style={styles.registerText}>Set Reminder</Text>
          </PressableOpacity>
        </View>
      </View>
    </>
  );
};

CreateReminder.displayName = 'CreateReminder';

export default CreateReminder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
    marginHorizontal: 16,
  },
  iosTimePicker: {
    // backgroundColor: theme.color.bgNone,
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  time: {
    backgroundColor: theme.color.bgNone,
    paddingHorizontal: 4,
    paddingVertical: 8,
    width: 64,
    height: 56,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 32,
    color: theme.color.textMain,
    fontWeight: 'bold',
  },
  colon: {
    fontSize: 20,
    color: theme.color.textMain,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginHorizontal: 4,
  },
  item: {
    paddingVertical: 16,
  },
  inputTitle: {
    fontSize: 14,
    color: theme.color.textWeak,
  },
  textInput: {
    color: theme.color.textMain,
    fontSize: 16,
    backgroundColor: theme.color.bgNone,
    paddingHorizontal: 4,
    paddingVertical: 8,
    width: '100%',
    borderRadius: 4,
  },
  registerContainer: {
    alignItems: 'center',
    alignContent: 'center',
  },
  register: {
    backgroundColor: theme.color.accents.normal,
    padding: 18,
    alignItems: 'center',
    borderRadius: 8,
    width: '100%',
    maxWidth: 320,
    flexShrink: 0,
  },
  registerText: {
    color: theme.color.bgNone,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
