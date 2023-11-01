import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, RequestOptions, TestIds } from 'react-native-google-mobile-ads';
import ErrorBoundary from '../Suspense/ErrorBoundary';

const isIOS = Platform.OS === 'ios';

type Props = {
  size: BannerAdSize;
  requestOptions?: RequestOptions;
};

const BannerAdMob = ({ size, requestOptions }: Props) => {
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
};

const withErrorBoundary = (props: Props) => {
  return (
    <ErrorBoundary>
      <BannerAdMob {...props} />
    </ErrorBoundary>
  );
};

export default withErrorBoundary;

const styles = StyleSheet.create({
  adContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
