import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import textJson from '../../assets/text.json';
import text2Json from '../../assets/text2.json';
import { useSearchParams } from 'expo-router';
import { parseTimestamp } from '../../utils/vtt';
import { PauseIcon, PlayIcon, SkipForwardIcon, SkipBackwardIcon } from '../icons';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from 'react-native-track-player';

const Player = () => {
  const { episodeId } = useSearchParams();
  const [captions, setCaptions] = useState([]);
  const captionsRef = useRef([]);
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  const playbackState = usePlaybackState();

  useEffect(() => {
    loadCaptions();
    setupPlayer();
  }, []);

  const loadCaptions = async () => {
    const text = episodeId === '1' ? textJson.data : text2Json.data;
    const lines = text.split('\n');

    const parsedCaptions = lines.reduce((acc, line) => {
      if (line.includes('-->')) {
        const [start, end] = line.split(' --> ').map(parseTimestamp);
        acc.push({ start, end, text: '' });
      } else if (line.trim() !== '' && !line.startsWith('WEBVTT')) {
        acc[acc.length - 1].text += line.trim() + ' ';
      }
      return acc;
    }, []);

    setCaptions(parsedCaptions);
    captionsRef.current = parsedCaptions;
  };

  const setupPlayer = async () => {
    const audio = episodeId === '1' ? 'https://anchor.fm/s/81fb5eec/podcast/play/67591883/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2023-2-30%2Fefa8c91f-d674-0399-9ee4-b7900c797b90.mp3' : require('../../assets/audio2.mp3');
    await TrackPlayer.add({ url: audio });
  }

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async (event) => {
    setActiveCaptionIndex(null);
    setPlaybackPosition(0);
  });

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    const track = await TrackPlayer.getCurrentTrack();
    if (track === null) {
      setActiveCaptionIndex(null);
      setPlaybackPosition(0);
      return
    }
    console.log('track changed')
    const duration = await TrackPlayer.getDuration();
    setPlaybackDuration(duration);
  });

  const progress = useProgress();
  useEffect(() => {
    const { position } = progress;
    setPlaybackPosition(position);
    const captions = captionsRef.current;
    const activeCaption = captions.findIndex(
      (caption) =>
        caption.start <= position && caption.end >= position
    );
    setActiveCaptionIndex(activeCaption);
  }, [progress.position]);

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
    const newPosition = value * playbackDuration;
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
          playbackDuration > 0
            ? playbackPosition / playbackDuration
            : 0
        }
        onSlidingComplete={handleSeek}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
      />
    </View>
  );
};

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
