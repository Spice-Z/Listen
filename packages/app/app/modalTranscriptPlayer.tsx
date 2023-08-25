import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { theme } from '../feature/styles/theme';
import { BackDownIcon, TranslateIcon } from '../feature/icons';
import TranscriptPlayer from '../feature/Player/TranscriptPlayer';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTrackPlayer } from '../feature/Player/hooks/useTrackPlayer';
import { gql } from '../feature/graphql/__generated__';
import { useQuery } from '@apollo/client';

function BackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={navigation.goBack}>
      <Text>
        <BackDownIcon width={24} height={24} color={theme.color.textMain} />
      </Text>
    </TouchableOpacity>
  );
}

function TranslateIconButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>
        <TranslateIcon width={28} height={28} color={theme.color.textMain} />
      </Text>
    </TouchableOpacity>
  );
}

const GET_EPISODE_IN_MODAL = gql(/* GraphQL */ `
  query GetEpisodeInModalTranscript($channelId: String!, $episodeId: String!) {
    episode(channelId: $channelId, episodeId: $episodeId) {
      id
      title
      content
      url
      imageUrl
      duration
      pubDate
      translatedTranscripts {
        language
        transcriptUrl
      }
    }
  }
`);

const ModalTranscriptPlayer = memo(() => {
  const [targetLang, setTargetLang] = useState('ja');
  const { currentTrack } = useTrackPlayer();
  const currentEpisodeId = !!currentTrack ? currentTrack.id : null;
  const currentEpisodeChannelId = !!currentTrack ? currentTrack.channelId : null;

  const { data, loading } = useQuery(GET_EPISODE_IN_MODAL, {
    variables: {
      channelId: currentEpisodeChannelId,
      episodeId: currentEpisodeId,
    },
    skip: currentEpisodeId === null || currentEpisodeChannelId === null,
  });
  const episode = data?.episode;

  const targetLangList = useMemo(() => {
    return episode ? episode.translatedTranscripts.map((t) => t.language) : [];
  }, [episode]);

  const switchTargetLang = useCallback(() => {
    const currentIndex = targetLangList.indexOf(targetLang);
    const nextIndex = (currentIndex + 1) % targetLangList.length;
    setTargetLang(targetLangList[nextIndex]);
  }, [targetLang, targetLangList]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Transcript',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <BackButton />,
          headerRight: () => <TranslateIconButton onPress={switchTargetLang} />
        }}
      />
      <View style={styles.container}>
        {loading ? <ActivityIndicator /> : <TranscriptPlayer targetLang={targetLang} />}
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
