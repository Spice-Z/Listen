import analytics from '@react-native-firebase/analytics';

const _logEvent = (eventName: string, params?: any) => {
  analytics().logEvent(eventName, params);
};

// 再生開始を計測
// showId, episodeIdを渡す
export const logPlayStart = (showId: string, episodeId: string) => {
  _logEvent('play_start', {
    show_id: showId,
    episode_id: episodeId,
  });
};
