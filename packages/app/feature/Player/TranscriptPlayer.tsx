
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ViewProps,
} from 'react-native';
import {
  useProgress,
} from 'react-native-track-player';
import { useTrackPlayer } from './hooks/useTrackPlayer';
import { theme } from '../styles/theme';
import { useEpisodeByIds } from '../Episode/hooks/useEpisodeByIds';
import TranscriptScrollBox from './components/TranscriptScrollBox';
import { useEffect, useMemo, useState } from 'react';
import { useDidMount } from '../hooks/useDidMount';

const windowDimensions = Dimensions.get('window');

type Props = {
  targetLang: string;
}

function TranscriptPlayer({ targetLang }: Props) {
  const { currentQueue, currentTrack } = useTrackPlayer();
  const currentEpisodeId = !!currentTrack ? currentTrack.id : null;
  const currentEpisodeChannelId = !!currentTrack ? currentTrack.channelId : null;

  const { data } = useEpisodeByIds({
    channelId: currentEpisodeChannelId,
    episodeId: currentEpisodeId,
  })
  const translatedTranscriptUrl = useMemo(() => {
    if (data?.translatedTranscripts) {
      return data?.translatedTranscripts[targetLang]
    }
    return null
  }, [data?.translatedTranscripts, targetLang])

  const [shouldTwoColumn, setShouldTwoColumn] = useState(false);
  const scrollBoxHeight = useMemo(() => {
    if (shouldTwoColumn) {
      return '100%'
    }
    return '49%'
  }, [shouldTwoColumn])
  const scrollBoxWidth = useMemo(() => {
    if (shouldTwoColumn) {
      return '49%'
    }
    return '100%'
  }, [shouldTwoColumn])
  const separatorStyle: ViewProps['style'] = useMemo(() => {
    if (shouldTwoColumn) {
      return {
        width: '2%',
        height: '100%',
      }
    }
    return {
      width: '100%',
      height: 4,
    }
  }, [shouldTwoColumn])

  useDidMount(() => {
    setShouldTwoColumn(windowDimensions.width > windowDimensions.height);
  })

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window }) => {
        setShouldTwoColumn(window.width > window.height);
      },
    );
    return () => subscription?.remove();
  });


  const progress = useProgress(500);

  return currentQueue.length === 0 || currentTrack === null ? <View style={styles.container}>
    <Text style={{ color: theme.color.textMain }}>No Playing </Text>
  </View> : (
    <View style={[styles.container, { flexDirection: shouldTwoColumn ? 'row' : 'column' }]}>
      {/* 再レンダリングしないとコンポーネントのonLayoutが発火しないので同じ要素を出し分けている */}
      {
        shouldTwoColumn ?
          <>
            <TranscriptScrollBox
              transcriptUrl={data?.transcriptUrl}
              currentTimePosition={progress.position}
              width={scrollBoxWidth}
              height={scrollBoxHeight}
            />
            <View style={separatorStyle}></View>
            <TranscriptScrollBox
              transcriptUrl={translatedTranscriptUrl}
              currentTimePosition={progress.position}
              width={scrollBoxWidth}
              height={scrollBoxHeight}
            />
          </>
          : <>
            <TranscriptScrollBox
              transcriptUrl={data?.transcriptUrl}
              currentTimePosition={progress.position}
              width={scrollBoxWidth}
              height={scrollBoxHeight}
            />
            <View style={separatorStyle}></View>
            <TranscriptScrollBox
              transcriptUrl={translatedTranscriptUrl}
              currentTimePosition={progress.position}
              width={scrollBoxWidth}
              height={scrollBoxHeight}
            />
          </>
      }

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
  }
});

export default TranscriptPlayer;
