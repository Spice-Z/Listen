import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { theme } from '../styles/theme';
import { StyleSheet, Text, View } from 'react-native';
import { DailyTriggerInput } from 'expo-notifications';
import PressableOpacity from '../Pressable/PressableOpacity';

export type CreateReminderBottomSheetHandler = {
  toggleBottomSheet: () => void;
};

type Props = {
  addNotification: (props: {
    title: string;
    subTitle: string;
    body: string;
    trigger: DailyTriggerInput;
  }) => Promise<void>;
};

const CreateReminderBottomSheet = forwardRef<CreateReminderBottomSheetHandler, Props>(
  ({ addNotification }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['60%'], []);

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

    const [target, setTarget] = useState<{ hour: number; minute: number }>({
      hour: 20,
      minute: 48,
    });
    const [title, setTitle] = useState<string>('Reminder');
    const [subTitle, setSubTitle] = useState<string>('This is the subtitle');
    const [body, setBody] = useState<string>('This is the body');

    const onPress = useCallback(async () => {
      await addNotification({
        title,
        subTitle,
        body,
        trigger: {
          hour: target.hour,
          minute: target.minute,
          repeats: true,
        },
      });

      bottomSheetRef.current.close();
    }, [addNotification, body, subTitle, target.hour, target.minute, title]);

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
      >
        <View style={styles.contentContainer}>
          <BottomSheetTextInput
            value={target.hour ? target.hour.toString() : ''}
            onChangeText={(text) => {
              setTarget((prev) => ({
                ...prev,
                hour: parseInt(text),
              }));
            }}
            inputMode="numeric"
          />
          <BottomSheetTextInput
            value={target.minute ? target.minute.toString() : ''}
            onChangeText={(text) => {
              setTarget((prev) => ({
                ...prev,
                minute: parseInt(text),
              }));
            }}
            inputMode="numeric"
          />
          <BottomSheetTextInput value={title} onChangeText={setTitle} />
          <BottomSheetTextInput value={subTitle} onChangeText={setSubTitle} />
          <BottomSheetTextInput value={body} onChangeText={setBody} />
          <PressableOpacity onPress={onPress}>
            <Text>登録</Text>
          </PressableOpacity>
        </View>
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
  item: {
    paddingVertical: 16,
  },
  textInput: {
    color: theme.color.textMain,
    fontSize: 16,
    fontWeight: '800',
    backgroundColor: theme.color.bgMain,
  },
});
