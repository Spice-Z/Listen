import { Stack } from 'expo-router';
import { theme } from '../../../feature/styles/theme';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.color.bgMain,
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        statusBarColor: theme.color.accent,
        navigationBarColor: theme.color.accent,
        headerTitleStyle: {
          color: theme.color.textMain,
          fontWeight: theme.fontWeight.bold,
          fontSize: 18,
        },
      }}
    />
  );
}
