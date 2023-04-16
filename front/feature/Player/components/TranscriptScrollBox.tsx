import { useQuery } from '@tanstack/react-query';
import { Suspense, memo, useCallback, useEffect, useRef, useState } from "react";
import { getTranscriptFromUrl } from "../../dataLoader/getTranscriptFromUrl";
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../styles/theme';



type Props = {
 transcriptUrl?: string;
 height: number | string;
 currentTimePosition: number;
}

function TranscriptScrollBox({
 transcriptUrl,
 height,
 currentTimePosition
}: Props) {
 const { data } = useQuery({
  queryKey: ['getTranscriptFromUrl', transcriptUrl],
  queryFn: () => getTranscriptFromUrl(transcriptUrl),
  enabled: !!transcriptUrl,
 })

 const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(null);
 const transcriptsContainerRef = useRef<ScrollView>(null);
 const transcriptYPositions = useRef<{
  [key: number]: number
 }>({});

 const scrollToCurrentTranscript = useCallback(
  () => {
   if (activeTranscriptIndex !== null) {
    const targetY = transcriptYPositions.current[activeTranscriptIndex];
    transcriptsContainerRef.current?.scrollTo({
     y: targetY - 70,
     animated: true,
    });
   }
  },
  [activeTranscriptIndex],
 )

 useEffect(() => {
  if (data) {
   const transcription = data;
   const currentTranscript = transcription.findIndex(
    (transcript) => transcript.start <= currentTimePosition && transcript.end >= currentTimePosition,
   );
   if (currentTranscript === -1) {
    return
   }
   setActiveTranscriptIndex(currentTranscript);
   scrollToCurrentTranscript()
  }
 }, [currentTimePosition, data, scrollToCurrentTranscript]);

 return <ScrollView style={{ height }} ref={transcriptsContainerRef}>
  {!!data ? data.map((transcript, index) => (
   <View
    key={index}
    style={[
     styles.transcriptContainer,
     activeTranscriptIndex >= index ? styles.highlighted : null
    ]}
    onLayout={(event) => {
     const Ys = transcriptYPositions.current
     Ys[index] = event.nativeEvent.layout.y
     transcriptYPositions.current = Ys
    }}
   >
    <Text
     style={[
      styles.transcript,
     ]}
     selectable
    >
     {transcript.text}
    </Text>
   </View>
  )) : <Text style={styles.noTranscriptText}>No Transcript, sorry...</Text>}
 </ScrollView>

}

function withSuspense(props: Props) {
 return <Suspense>
  <TranscriptScrollBox {...props} />
 </Suspense>;
}

export default memo(withSuspense);


const styles = StyleSheet.create({
 transcriptsContainer: {
  paddingVertical: 20,
  paddingHorizontal: 16,
  flexDirection: 'row',
  flexWrap: 'wrap',
  backgroundColor: theme.color.bgEmphasis
 },
 transcriptContainer: {
  width: '100%',
  paddingHorizontal: 8,
 },
 transcript: {
  fontSize: 16,
  lineHeight: 22,
  color: theme.color.textWeak,
  fontWeight: '600',
 },
 highlighted: {
  backgroundColor: theme.color.accent,
 },
 noTranscriptText: {
  width: '100%',
  fontSize: 20,
  lineHeight: 26,
  fontWeight: '800',
  textAlign: 'center',
  color: theme.color.textMain,
 }
})