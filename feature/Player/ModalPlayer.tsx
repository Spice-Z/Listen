import {
  useState, useEffect, useRef,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from 'react-native-track-player';
import text2Json from '../../assets/text2.json';
import { parseTimestamp } from '../../utils/vtt';
import {
  PauseIcon, PlayIcon, SkipForwardIcon, SkipBackwardIcon,
} from '../icons';
import { useTrackPlayer } from './hooks/useTrackPlayer';
import { useDidMount } from '../hooks/useDidMount';
import { theme } from '../styles/theme';

function ModalPlayer() {

  const [captions, setCaptions] = useState([]);
  const captionsRef = useRef([]);
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);

  const playbackState = usePlaybackState();

  useDidMount(() => {
    loadCaptions();
  });

  const loadCaptions = async () => {
    const text = text2Json.data;
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

  const { playingTrackDuration, currentQueue, currentTrack } = useTrackPlayer();

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
      await TrackPlayer.play();
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

  return currentQueue.length === 0 || currentTrack === null ? <View style={styles.container}>
    <Text style={{ color: theme.color.textMain }}>No Playing </Text>
  </View> : (
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
      <View style={styles.episodeContainer}>
        {typeof currentTrack.artwork === 'string' ?
          <Image
            style={styles.thumbnail}
            // @ts-ignore
            src={currentTrack.artwork}
          />
          : <Image
            style={styles.thumbnail}
            source={require('../../assets/image/empty-artwork.png')}
          />
        }

        <View style={styles.episodeInfo}>
          <Text style={styles.episodeTitle} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.channelName} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.seekBar}
          value={
            playingTrackDuration > 0
              ? playbackPosition / playingTrackDuration
              : 0
          }
          onSlidingComplete={handleSeek}
          minimumTrackTintColor={theme.color.accent}
          maximumTrackTintColor={theme.color.bgEmphasis}
          thumbImage={require('../../assets/player/thumb.png')}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
        />
      </View>
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
            <PauseIcon width={26} height={26} fill={theme.color.textMain} />
          ) : (
            <PlayIcon width={26} height={26} fill={theme.color.textMain} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => handleSkip(15)}
        >
          <SkipForwardIcon width={24} height={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.bgMain,
    color: theme.color.textMain,
  },
  episodeContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    width: '100%',
    maxWidth: '100%',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'gray',
  },
  episodeInfo: {
    marginLeft: 8,
    flexShrink: 1,
  },
  episodeTitle: {
    color: theme.color.textMain,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800'
  },
  channelName: {
    fontSize: 14,
    lineHeight: 18,
    color: theme.color.textWeak,
  },
  sliderContainer: {
    width: '100%',
    marginTop: 4,
  },
  seekBar: {
    width: Dimensions.get('window').width - 32,
    height: 40,
    marginHorizontal: 16,
  },
  captionsScrollView: {
    height: '70%',
  },
  captionsContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: theme.color.bgEmphasis
  },
  captionText: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.color.textWeak,
    fontWeight: '400',
  },
  highlightedCaption: {
    color: theme.color.accent
  },
  playerContainer: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  playPauseButton: {
    backgroundColor: theme.color.accent,
    height: 56,
    width: 56,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    height: 56,
    width: 56,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ModalPlayer;
