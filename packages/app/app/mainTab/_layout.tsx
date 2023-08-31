import { Tabs } from 'expo-router';
import { PlayIcon } from '../../feature/icons';
import { theme } from '../../feature/styles/theme';
import { StyleSheet, Text, View } from 'react-native';
import MiniPlayer from '../../feature/Player/MiniPlayer';
import { BOTTOM_TAB_HEIGHT } from '../../constants';
import { useHideMiniPlayer } from '../../feature/hooks/useHideMiniPlayer';

export default function Layout() {
  const hideMiniPlayer = useHideMiniPlayer();
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: BOTTOM_TAB_HEIGHT,
            borderWidth: 0,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            elevation: 0,
            backgroundColor: theme.color.bgNone,
          },
        }}
      >
        <Tabs.Screen
          name="search"
          options={{
            tabBarLabel: (props) => (
              <Text style={props.focused ? styles.labelFocused : styles.label}>
                {props.children}
              </Text>
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
              <Text style={props.focused ? styles.labelFocused : styles.label}>
                {props.children}
              </Text>
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

      <View style={styles.miniPlayerContainer}>
        <MiniPlayer hide={hideMiniPlayer} />
      </View>
    </>
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
  miniPlayerContainer: {
    position: 'absolute',
    bottom: BOTTOM_TAB_HEIGHT,
    borderBottomColor: theme.color.bgEmphasis,
    borderBottomWidth: 1,
  },
});
