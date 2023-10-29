import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { theme } from '../feature/styles/theme';
import TranscriptPlayer from '../feature/Player/TranscriptPlayer';
import { memo, useState } from 'react';
import BackDownButton from '../feature/Header/BackDownButton';

// function TranslateIconButton({ onPress }: { onPress: () => void }) {
//   return (
//     <PressableOpacity hitSlop={4} onPress={onPress}>
//       <TranslateIcon width={28} height={28} color={theme.color.textMain} />
//     </PressableOpacity>
//   );
// }

// const GET_EPISODE_IN_MODAL = gql(/* GraphQL */ `
//   query GetEpisodeInModalTranscript($channelId: String!, $episodeId: String!) {
//     episode(channelId: $channelId, episodeId: $episodeId) {
//       id
//       title
//       content
//       url
//       imageUrl
//       duration
//       pubDate
//       translatedTranscripts {
//         language
//         transcriptUrl
//       }
//     }
//   }
// `);

const ModalTranscriptPlayer = memo(() => {
  const [targetLang] = useState('ja');
  // const { currentTrack } = useTrackPlayer();
  // const currentEpisodeId = !!currentTrack ? currentTrack.id : null;
  // const currentEpisodeChannelId = !!currentTrack ? currentTrack.channelId : null;

  // // const { data, loading } = useQuery(GET_EPISODE_IN_MODAL, {
  // //   variables: {
  // //     channelId: currentEpisodeChannelId,
  // //     episodeId: currentEpisodeId,
  // //   },
  // //   skip: currentEpisodeId === null || currentEpisodeChannelId === null,
  // // });

  // const targetLangList = useMemo(() => {
  //   return episode ? episode.translatedTranscripts.map((t) => t.language) : [];
  // }, [episode]);

  // const switchTargetLang = useCallback(() => {
  //   const currentIndex = targetLangList.indexOf(targetLang);
  //   const nextIndex = (currentIndex + 1) % targetLangList.length;
  //   setTargetLang(targetLangList[nextIndex]);
  // }, [targetLang, targetLangList]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Translated Transcription',
          headerLeft: () => <BackDownButton />,
          // headerRight: () => <TranslateIconButton onPress={switchTargetLang} />,
        }}
      />
      <View style={styles.container}>
        <TranscriptPlayer targetLang={targetLang} />
      </View>
    </>
  );
});

ModalTranscriptPlayer.displayName = 'ModalTranscriptPlayer';

export default ModalTranscriptPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
