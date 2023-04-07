import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import textJson from '../../assets/text.json'
import text2Json from '../../assets/text2.json'
import { useSearchParams } from 'expo-router';
import { parseTimestamp } from '../../utils/vtt';
import { PauseIcon, PlayIcon, SkipForwardIcon } from '../icons';
import Back15SecIcon from '../icons/Back15SecIcon';

const Player = () => {
  const { episodeId } = useSearchParams();
  const [captions, setCaptions] = useState([]);
  const captionsRef = useRef([])
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadCaptions();
    loadAudio();
    console.log({ episodeId })
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadCaptions = async () => {
    console.log('loadCaptions')
    const text = episodeId === '1' ? textJson.data : text2Json.data
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

    setCaptions(parsedCaptions)
    captionsRef.current = parsedCaptions
  };

  const loadAudio = async () => {
    const audio = episodeId === '1' ? require('../../assets/audio.mp3') : require('../../assets/audio2.mp3')
    const { sound } = await Audio.Sound.createAsync(
      audio,
      { shouldPlay: false }
    );
    setSound(sound);

    sound.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.isLoaded) {
        const positionSeconds = playbackStatus.positionMillis / 1000;
        const captions = captionsRef.current;
        const activeCaption = captions.findIndex(
          (caption) =>
            caption.start <= positionSeconds && caption.end >= positionSeconds
        );
        setActiveCaptionIndex(activeCaption);
        setPlaybackPosition(playbackStatus.positionMillis);
        setPlaybackDuration(playbackStatus.durationMillis);
      }
    });
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = async (seconds) => {
    if (sound) {
      const newPosition = playbackPosition + seconds * 1000;
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleSeek = async (value) => {
    if (sound) {
      const newPosition = value * playbackDuration;
      await sound.setPositionAsync(newPosition);
    }
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
          <Back15SecIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={handlePlayPause}
        >
          {isPlaying ? <PauseIcon width={24} height={24} fill='#fff'/>:<PlayIcon width={24} height={24} fill='#fff'/>}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => handleSkip(15)}
        >
          <SkipForwardIcon width={24} height={24} color='#fff'/>
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
    backgroundColor: 'beige'
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