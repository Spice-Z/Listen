import { Stack } from 'expo-router';
import { theme } from '../../../feature/styles/theme';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.color.bgMain,
        },
        animation: 'slide_from_right',
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTintColor: theme.color.accent,
        headerTitleStyle: {
          color: theme.color.textMain,
          fontWeight: theme.fontWeight.bold,
          fontSize: 18,
        },
        headerBackTitle: '',
      }}
    />
  );
}
