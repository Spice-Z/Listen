import { memo, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, RequestOptions, TestIds } from 'react-native-google-mobile-ads';

const isIOS = Platform.OS === 'ios';

type Props = {
  size: BannerAdSize;
  requestOptions?: RequestOptions;
};

const BannerAdMob = memo<Props>(({ size, requestOptions }) => {
  const adUnitId = useMemo(() => {
    if (__DEV__) {
      return TestIds.BANNER;
    }
    if (isIOS) {
      return process.env.EXPO_PUBLIC_AD_ID_IOS;
    }
    return process.env.EXPO_PUBLIC_AD_ID_ANDROID;
  }, []);
  return (
    <View style={styles.adContainer}>
      <BannerAd unitId={adUnitId} size={size} requestOptions={requestOptions} />
    </View>
  );
});

export default BannerAdMob;

const styles = StyleSheet.create({
  adContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
