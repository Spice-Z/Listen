import { ExpoConfig, ConfigContext } from 'expo/config';

const IS_PROD = process.env.APP_VARIANT === 'production';

export default ({ config }: ConfigContext): Partial<ExpoConfig> => {
  return {
    ...config,
    name: IS_PROD ? 'Listen' : '[dev]Listen',
    ios: {
      ...config.ios,
      googleServicesFile: IS_PROD ? './GoogleService-Info.plist' : './GoogleService-Info-Dev.plist',
      bundleIdentifier: IS_PROD ? 'com.spicex.Listen' : 'com.spicex.Listen.dev',
    },
    android: {
      ...config.android,
      googleServicesFile: IS_PROD ? './google-services.json' : './google-services-dev.json',
      package: IS_PROD ? 'com.spicex.Listen' : 'com.spicex.Listen.dev',
    },
  };
};
