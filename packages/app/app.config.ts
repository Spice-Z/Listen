import { ExpoConfig, ConfigContext } from 'expo/config';

const isProd = process.env.NODE_ENV === 'production';

export default ({ config }: ConfigContext): Partial<ExpoConfig> => {
  return {
    ...config,
    ios: {
      ...config.ios,
      googleServicesFile: isProd ? './GoogleService-Info.plist' : './GoogleService-Info-Dev.plist',
    },
    android: {
      ...config.android,
      googleServicesFile: isProd ? './google-services.json' : './google-services-dev.json',
    },
  };
};
