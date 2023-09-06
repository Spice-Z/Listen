import { useQuery } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getTranscriptFromUrl } from '../../dataLoader/getTranscriptFromUrl';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../styles/theme';
import SquareShimmer from '../../Shimmer/SquareShimmer';

type Props = {
  transcriptUrl?: string;
  currentTimePosition: number;
  width: number;
  height: number;
};

function TranscriptScrollBox({ transcriptUrl, currentTimePosition, width, height }: Props) {
  const { data, isFetching } = useQuery({
    queryKey: ['getTranscriptFromUrl', transcriptUrl],
    queryFn: () => getTranscriptFromUrl(transcriptUrl || null),
    enabled: !!transcriptUrl,
  });

  const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(null);
  const transcriptsContainerRef = useRef<ScrollView>(null);
  const transcriptYPositions = useRef<{
    [key: number]: number;
  }>({});

  const scrollToCurrentTranscript = useCallback(() => {
    if (activeTranscriptIndex !== null) {
      const targetY = transcriptYPositions.current[activeTranscriptIndex];
      transcriptsContainerRef.current?.scrollTo({
        y: targetY - 70,
        animated: true,
      });
    }
  }, [activeTranscriptIndex]);

  useEffect(() => {
    if (data) {
      const transcription = data;
      const currentTranscript = transcription.findIndex(
        (transcript) =>
          transcript.start <= currentTimePosition && transcript.end >= currentTimePosition,
      );
      if (currentTranscript === -1) {
        return;
      }
      setActiveTranscriptIndex(currentTranscript);
      scrollToCurrentTranscript();
    }
  }, [currentTimePosition, data, scrollToCurrentTranscript]);

  return (
    <ScrollView style={{ width, height }} ref={transcriptsContainerRef}>
      {!!data ? (
        data.map((transcript, index) => (
          <View
            key={index}
            style={[
              styles.transcriptContainer,
              activeTranscriptIndex >= index ? styles.highlighted : null,
              activeTranscriptIndex === index ? styles.superHighlighted : null,
            ]}
            onLayout={(event) => {
              const Ys = transcriptYPositions.current;
              Ys[index] = event.nativeEvent.layout.y;
              transcriptYPositions.current = Ys;
            }}
          >
            <Text style={[styles.transcript]} selectable>
              {transcript.text}
            </Text>
          </View>
        ))
      ) : isFetching ? (
        <SquareShimmer width={width} height={height} />
      ) : (
        <Text style={styles.noTranscriptText}>No Transcript</Text>
      )}
    </ScrollView>
  );
}

export default memo(TranscriptScrollBox);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  transcriptsContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: theme.color.bgDark,
  },
  transcriptContainer: {
    width: '100%',
    paddingLeft: 8,
    paddingRight: 8,
  },
  highlighted: {
    backgroundColor: theme.color.accent,
  },
  superHighlighted: {
    backgroundColor: theme.color.accent90,
  },
  transcript: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.color.textMain,
    fontWeight: '600',
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
