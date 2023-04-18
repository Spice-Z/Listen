import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { theme } from '../feature/styles/theme';
import { BackDownIcon, TranslateIcon } from '../feature/icons';
import TranscriptPlayer from '../feature/Player/TranscriptPlayer';
import { useCallback, useMemo, useState } from 'react';
import { useTrackPlayer } from '../feature/Player/hooks/useTrackPlayer';
import { useEpisodeByIds } from '../feature/Episode/hooks/useEpisodeByIds';

function BackButton() {
 const navigation = useNavigation();
 return (
  <TouchableOpacity onPress={navigation.goBack}>
   <Text>
    <BackDownIcon width={24} height={24} color={theme.color.textMain} />,
   </Text>
  </TouchableOpacity>
 );
}

function TranslateIconButton({ onPress }: { onPress: () => void }) {
 return (
  <TouchableOpacity onPress={onPress}>
   <Text>
    <TranslateIcon width={28} height={28} color={theme.color.textMain} />,
   </Text>
  </TouchableOpacity>
 );
}

export default function ModalTranscriptPlayer() {
 const [targetLang, setTargetLang] = useState('ja');
 const { currentTrack } = useTrackPlayer();
 const currentEpisodeId = !!currentTrack ? currentTrack.id : null;
 const currentEpisodeChannelId = !!currentTrack ? currentTrack.channelId : null;

 const { data } = useEpisodeByIds({
  channelId: currentEpisodeChannelId,
  episodeId: currentEpisodeId,
 })

 const targetLangList = useMemo(() => {
  if (data?.translatedTranscripts) {
   return Object.keys(data?.translatedTranscripts)
  }
  return []
 }, [data?.translatedTranscripts])

 const switchTargetLang = useCallback(() => {
  const currentIndex = targetLangList.indexOf(targetLang)
  const nextIndex = (currentIndex + 1) % targetLangList.length
  setTargetLang(targetLangList[nextIndex])
 }, [targetLang, targetLangList])

 return (
  <>
   <Stack.Screen
    options={{
     headerTitle: 'Transcript',
     // eslint-disable-next-line react/no-unstable-nested-components
     headerLeft: () => <BackButton />,
     headerRight: () => <TranslateIconButton onPress={switchTargetLang} />,
    }}
   />
   <View style={styles.container}>
    <TranscriptPlayer targetLang={targetLang} />
   </View>
  </>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: theme.color.bgMain,
  alignItems: 'center',
  justifyContent: 'center',
 },
});
