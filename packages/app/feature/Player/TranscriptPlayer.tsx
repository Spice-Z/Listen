import { StyleSheet, View, Dimensions, ViewProps } from 'react-native';
import { useProgress } from 'react-native-track-player';
import { useTrackPlayer } from './hooks/useTrackPlayer';
import { theme } from '../styles/theme';
import TranscriptScrollBox from './components/TranscriptScrollBox';
import { memo, useEffect, useMemo, useState } from 'react';
import { useDidMount } from '../hooks/useDidMount';
import { gql } from '../graphql/__generated__';
import { useQuery } from '@apollo/client';
import SquareShimmer from '../Shimmer/SquareShimmer';

const windowDimensions = Dimensions.get('window');

type Props = {
  targetLang: string;
};

const GET_EPISODE_TRANSLATED_SCRIPTS = gql(/* GraphQL */ `
  query GetEpisodeTranslatedScripts($channelId: String!, $episodeId: String!) {
    episode(channelId: $channelId, episodeId: $episodeId) {
      id
      transcriptUrl
      translatedTranscripts {
        language
        transcriptUrl
      }
    }
  }
`);

const LoadingView = memo(() => {
  return <SquareShimmer width="100%" height={500} />;
});

export default function TranscriptPlayer({ targetLang }: Props) {
  const { currentQueue, currentTrack, isLoading } = useTrackPlayer();
  const currentEpisodeId = !!currentTrack ? currentTrack.id : null;
  const currentEpisodeChannelId = !!currentTrack ? currentTrack.channelId : null;

  const { data, loading } = useQuery(GET_EPISODE_TRANSLATED_SCRIPTS, {
    variables: {
      channelId: currentEpisodeChannelId,
      episodeId: currentEpisodeId,
    },
    skip: currentEpisodeId === null || currentEpisodeChannelId === null,
  });

  const translatedTranscriptUrl = useMemo(() => {
    if (data === undefined) {
      return null;
    }
    const targetTranscript = data.episode.translatedTranscripts.find((translatedTranscript) => {
      return translatedTranscript.language === targetLang;
    });
    if (targetTranscript) {
      return targetTranscript.transcriptUrl;
    }
    return null;
  }, [data, targetLang]);

  const [shouldTwoColumn, setShouldTwoColumn] = useState(false);
  const scrollBoxHeight = useMemo(() => {
    if (shouldTwoColumn) {
      return '100%';
    }
    return '49%';
  }, [shouldTwoColumn]);
  const scrollBoxWidth = useMemo(() => {
    if (shouldTwoColumn) {
      return '49%';
    }
    return '100%';
  }, [shouldTwoColumn]);
  const separatorStyle: ViewProps['style'] = useMemo(() => {
    if (shouldTwoColumn) {
      return {
        width: '2%',
        height: '100%',
      };
    }
    return {
      width: '100%',
      height: 4,
    };
  }, [shouldTwoColumn]);

  useDidMount(() => {
    setShouldTwoColumn(windowDimensions.width > windowDimensions.height);
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setShouldTwoColumn(window.width > window.height);
    });
    return () => subscription?.remove();
  });

  const progress = useProgress(500);

  return currentQueue.length === 0 || currentTrack === null || loading || isLoading ? (
    <View style={styles.container}>
      <LoadingView />;
    </View>
  ) : (
    <View style={[styles.container, { flexDirection: shouldTwoColumn ? 'row' : 'column' }]}>
      {/* 再レンダリングしないとコンポーネントのonLayoutが発火しないので同じ要素を出し分けている */}
      {shouldTwoColumn ? (
        <View style={{ width: scrollBoxWidth, height: scrollBoxHeight }}>
          <TranscriptScrollBox
            transcriptUrl={data?.episode.transcriptUrl}
            currentTimePosition={progress.position}
          />
          <View style={separatorStyle}></View>
          <TranscriptScrollBox
            transcriptUrl={translatedTranscriptUrl}
            currentTimePosition={progress.position}
          />
        </View>
      ) : (
        <View style={{ width: scrollBoxWidth, height: scrollBoxHeight }}>
          <TranscriptScrollBox
            transcriptUrl={data?.episode.transcriptUrl}
            currentTimePosition={progress.position}
          />
          <View style={separatorStyle}></View>
          <TranscriptScrollBox
            transcriptUrl={translatedTranscriptUrl}
            currentTimePosition={progress.position}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.color.bgMain,
    color: theme.color.textMain,
  },
  separator: {
    width: '100%',
    height: 4,
  },
  noTranscriptText: {
    width: '100%',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    textAlign: 'center',
    color: theme.color.textMain,
  },
});
