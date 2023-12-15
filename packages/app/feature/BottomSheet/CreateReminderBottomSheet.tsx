import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { theme } from '../styles/theme';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { DailyTriggerInput } from 'expo-notifications';
import PressableOpacity from '../Pressable/PressableOpacity';
import Spacer from '../Spacer/Spacer';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export type CreateReminderBottomSheetHandler = {
  toggleBottomSheet: () => void;
};

type Props = {
  addNotification: (props: {
    title: string;
    subtitle: string;
    body: string;
    trigger: DailyTriggerInput;
  }) => Promise<void>;
};

const CreateReminderBottomSheet = forwardRef<CreateReminderBottomSheetHandler, Props>(
  ({ addNotification }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['70%'], []);

    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    }, []);

    const toggleBottomSheet = useCallback(() => {
      if (bottomSheetRef.current) {
        if (isOpen) {
          bottomSheetRef.current.close();
          return;
        }
        bottomSheetRef.current.snapToIndex(0);
      }
    }, [isOpen]);
    useImperativeHandle(ref, () => ({
      toggleBottomSheet,
    }));

    const renderBackDrop = useCallback((props) => {
      return (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          style={[props.style, { backgroundColor: theme.color.bgDrop }]}
          opacity={0.9}
        />
      );
    }, []);
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

    const [title, setTitle] = useState<string>('Reminder');
    const [subtitle, setSubtitle] = useState<string>('This is the subtitle');
    const [body, setBody] = useState<string>('This is the body');

    const onPress = useCallback(async () => {
      await addNotification({
        title,
        subtitle,
        body,
        trigger: {
          hour: hour,
          minute: minute,
          repeats: true,
        },
      });

      bottomSheetRef.current.close();
    }, [addNotification, body, hour, minute, subtitle, title]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: theme.color.bgMain,
        }}
        onChange={handleSheetChanges}
        backdropComponent={renderBackDrop}
        enablePanDownToClose
        keyboardBlurBehavior="restore"
        keyboardBehavior="fillParent"
      >
        <BottomSheetScrollView style={styles.contentContainer}>
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
          <BottomSheetTextInput value={title} onChangeText={setTitle} style={styles.textInput} />
          <Spacer height={12} />
          <Text style={styles.inputTitle}>SubTitle</Text>
          <Spacer height={4} />
          <BottomSheetTextInput
            value={subtitle}
            onChangeText={setSubtitle}
            style={styles.textInput}
          />
          <Spacer height={12} />
          <Text style={styles.inputTitle}>Message</Text>
          <Spacer height={4} />
          <BottomSheetTextInput value={body} onChangeText={setBody} style={styles.textInput} />
          <Spacer height={20} />
          <PressableOpacity style={styles.register} onPress={onPress}>
            <Text style={styles.registerText}>Set Reminder</Text>
          </PressableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

export default CreateReminderBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
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
  register: {
    backgroundColor: theme.color.accents.normal,
    padding: 18,
    alignItems: 'center',
    borderRadius: 8,
  },
  registerText: {
    color: theme.color.bgNone,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
