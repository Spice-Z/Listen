import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { theme } from '../styles/theme';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import PressableScale from '../Pressable/PressableScale';

type Props = {
  onAfterClose?: () => void | Promise<void>;
};

const PlaySettingBottomSheet = forwardRef(({ onAfterClose }: Props, ref) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);

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
      bottomSheetRef.current.snapToIndex(1);
    }
  }, [isOpen]);
  useImperativeHandle(ref, () => ({
    toggleBottomSheet,
  }));

  const onPressSwitchToDictation = useCallback(async () => {
    if (!bottomSheetRef.current) {
      return;
    }
    bottomSheetRef.current.close();
    if (onAfterClose) {
      await onAfterClose();
    }

    router.push('/modalDictationPlayer');
  }, [onAfterClose, router]);

  const onPressSwitchToNormal = useCallback(async () => {
    if (!bottomSheetRef.current) {
      return;
    }
    bottomSheetRef.current.close();
    if (onAfterClose) {
      await onAfterClose();
    }

    router.push('/modalPlayer');
  }, [onAfterClose, router]);
  const currentPath = usePathname();
  const isOnTranscriptPlayer = currentPath === '/modalPlayer';
  const isOnDictationPlayer = currentPath === '/modalDictationPlayer';

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
    >
      <View style={styles.contentContainer}>
        <View>
          {!isOnDictationPlayer && (
            <PressableScale onPress={onPressSwitchToDictation}>
              <Text style={styles.bottomSheetText}>Switch to Dictation Mode</Text>
            </PressableScale>
          )}
          {!isOnTranscriptPlayer && (
            <PressableScale onPress={onPressSwitchToNormal}>
              <Text style={styles.bottomSheetText}>Switch to Transcript Mode</Text>
            </PressableScale>
          )}
        </View>
      </View>
    </BottomSheet>
  );
});

export default PlaySettingBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomSheetText: {
    color: theme.color.textMain,
    fontSize: 16,
    fontWeight: '800',
  },
});
