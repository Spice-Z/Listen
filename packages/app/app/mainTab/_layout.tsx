import { Tabs } from 'expo-router';
import { PlayIcon } from '../../feature/icons';
import { theme } from '../../feature/styles/theme';
import { StyleSheet, Text } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: (props) => (
            <Text style={props.focused ? styles.labelFocused : styles.label}>{props.children}</Text>
          ),
          tabBarIcon: (props) => (
            <PlayIcon
              width={props.size}
              height={props.size}
              fill={props.focused ? theme.color.accent : theme.color.textWeak}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: (props) => (
            <Text style={props.focused ? styles.labelFocused : styles.label}>{props.children}</Text>
          ),
          tabBarIcon: (props) => (
            <PlayIcon
              width={props.size}
              height={props.size}
              fill={props.focused ? theme.color.accent : theme.color.textWeak}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    color: theme.color.textWeak,
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
  },
  labelFocused: {
    color: theme.color.accent,
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
  },
});
