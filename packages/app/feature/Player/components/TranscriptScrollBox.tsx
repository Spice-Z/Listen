import { useQuery } from '@tanstack/react-query';
import { Suspense, memo, useCallback, useEffect, useRef, useState } from 'react';
import { getTranscriptFromUrl } from '../../dataLoader/getTranscriptFromUrl';
import { ScrollView } from 'react-native-gesture-handler';
import { DimensionValue, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../styles/theme';

type Props = {
  transcriptUrl?: string;
  height: number | DimensionValue;
  width: number | DimensionValue;
  currentTimePosition: number;
};

function TranscriptScrollBox({ transcriptUrl, height, width, currentTimePosition }: Props) {
  const { data } = useQuery({
    queryKey: ['getTranscriptFromUrl', transcriptUrl],
    queryFn: () => getTranscriptFromUrl(transcriptUrl),
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
    <ScrollView style={{ height, width }} ref={transcriptsContainerRef}>
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
      ) : (
        <Text style={styles.noTranscriptText}>No Transcript, sorry...</Text>
      )}
    </ScrollView>
  );
}

function withSuspense(props: Props) {
  return (
    <Suspense>
      <TranscriptScrollBox {...props} />
    </Suspense>
  );
}

export default memo(withSuspense);

const styles = StyleSheet.create({
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
