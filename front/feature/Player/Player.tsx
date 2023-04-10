import {
  useState, useEffect, useRef,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useSearchParams } from 'expo-router';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from 'react-native-track-player';
import textJson from '../../assets/text.json';
import text2Json from '../../assets/text2.json';
import { parseTimestamp } from '../../utils/vtt';
import {
  PauseIcon, PlayIcon, SkipForwardIcon, SkipBackwardIcon,
} from '../icons';
import { TrackPlayerTrack, useTrackPlayer } from './hooks/useTrackPlayer';
import { useDidMount } from '../hooks/useDidMount';

function Player() {
  const { episodeId } = useSearchParams();
  const [captions, setCaptions] = useState([]);
  const captionsRef = useRef([]);
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);

  const playbackState = usePlaybackState();

  useDidMount(() => {
    loadCaptions();
  });

  const loadCaptions = async () => {
    const text = episodeId === '1' ? textJson.data : text2Json.data;
    const lines = text.split('\n');

    const parsedCaptions = lines.reduce((acc, line) => {
      if (line.includes('-->')) {
        const [start, end] = line.split(' --> ').map(parseTimestamp);
        acc.push({ start, end, text: '' });
      } else if (line.trim() !== '' && !line.startsWith('WEBVTT')) {
        acc[acc.length - 1].text += `${line.trim()} `;
      }
      return acc;
    }, []);

    setCaptions(parsedCaptions);
    captionsRef.current = parsedCaptions;
  };

  const { playTrackIfNotCurrentlyPlaying, playingTrackDuration } = useTrackPlayer();
  const track: TrackPlayerTrack = episodeId === '2' ? {
    title: '【4月5日】トランプ前大統領が罪状認否。大統領選にらみ「遅延と攻撃」',
    artist: 'News Connect ~あなたと経済をつなぐ5分間~',
    date: 'Tue, 04 Apr 2023 21:00:15 GMT',
    artwork: 'https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo/21707347/21707347-1644160555988-248024357475.jpg',
    url: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2023-3-4/5fc7a6ae-6bb4-0c45-fc8f-dbb5fd5ed9f5.mp3',
    duration: 463,
  } : {
    url: require('../../assets/audio.mp3'),
    title: '',
    artwork: '',
    duration: 0,
  };


  useTrackPlayerEvents([Event.PlaybackQueueEnded], async (event) => {
    setActiveCaptionIndex(null);
    setPlaybackPosition(0);
  });

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    const track = await TrackPlayer.getCurrentTrack();
    if (track === null) {
      setActiveCaptionIndex(null);
      setPlaybackPosition(0);
    }
  });

  const progress = useProgress(500);

  useEffect(() => {
    const { position } = progress;
    setPlaybackPosition(position);
    const captions = captionsRef.current;
    const activeCaption = captions.findIndex(
      (caption) => caption.start <= position && caption.end >= position,
    );
    setActiveCaptionIndex(activeCaption);
  }, [progress]);

  const handlePlayPause = async () => {
    if (playbackState === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await playTrackIfNotCurrentlyPlaying(track);;
    }
  };

  const handleSkip = async (seconds) => {
    const newPosition = playbackPosition + seconds;
    await TrackPlayer.seekTo(newPosition);
  };
  const handleSeek = async (value) => {
    const newPosition = value * playingTrackDuration;
    await TrackPlayer.seekTo(newPosition);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.captionsScrollView}
        contentContainerStyle={styles.captionsContainer}
      >
        {captions.map((caption, index) => (
          <Text
            key={index}
            style={[
              styles.captionText,
              activeCaptionIndex === index ? styles.highlightedCaption : null,
            ]}
          >
            {caption.text}
            {index < captions.length - 1 ? ' ' : ''}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.playerContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => handleSkip(-15)}
        >
          <SkipBackwardIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={handlePlayPause}
        >
          {playbackState === State.Playing ? (
            <PauseIcon width={24} height={24} fill="#fff" />
          ) : (
            <PlayIcon width={24} height={24} fill="#fff" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => handleSkip(15)}
        >
          <SkipForwardIcon width={24} height={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.seekBar}
        value={
          playingTrackDuration > 0
            ? playbackPosition / playingTrackDuration
            : 0
        }
        onSlidingComplete={handleSeek}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerContainer: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'beige',
  },
  playPauseButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
  },
  playPauseButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  controlButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  seekBar: {
    width: 300,
    height: 40,
    marginTop: 10,
    backgroundColor: 'beige',
  },
  captionsScrollView: {
    maxHeight: 300,
  },
  captionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  captionText: {
    fontSize: 16,
  },
  highlightedCaption: {
    backgroundColor: 'yellow',
  },
});

export default Player;
