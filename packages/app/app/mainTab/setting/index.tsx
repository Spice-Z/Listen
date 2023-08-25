import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../../feature/styles/theme';
import SettingListItemComponent from '../../../feature/Setting/components/SettingListItem';
import { useCallback } from 'react';
import type { Props as SettingListItemProps } from '../../../feature/Setting/components/SettingListItem';
import { useSignOut } from '../../../feature/Auth/hooks/useSignOut';

export default function SettingPage() {
  const renderListItem = useCallback(({ item }: { item: SettingListItemProps }) => {
    return <SettingListItemComponent {...item} />;
  }, []);
  const { signOut } = useSignOut();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerShown: true,
        }}
      />
      <StatusBar style="inverted" />
      <SafeAreaView style={styles.container}>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={[
            {
              id: '1',
              text: 'Account',
              onPress: () => {},
            },
            {
              id: '2',
              text: 'Notifications',
              onPress: () => {},
            },
            {
              id: '3',
              text: 'Licenses',
              onPress: () => {},
            },
            {
              id: '4',
              text: "App's future",
              onPress: () => {},
            },
            {
              id: '5',
              text: 'Sign out',
              subText: 'Sign out from your account',
              onPress: signOut,
            },
          ]}
          renderItem={renderListItem}
          ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});
