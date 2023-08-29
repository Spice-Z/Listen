import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../../feature/styles/theme';
import SettingListItemComponent from '../../../feature/Setting/components/SettingListItem';
import { memo, useCallback } from 'react';
import type { Props as SettingListItemProps } from '../../../feature/Setting/components/SettingListItem';

const ListHeaderComponent = memo(() => (
  <View style={styles.headerContainer}>
    <Image
      width={2292}
      height={2292}
      style={styles.headerImage}
      source={require('../../../assets/image/login-artwork.png')}
    />
    <Text style={styles.headerText}>{`Version 1.0`}</Text>
  </View>
));

export default function SettingPage() {
  const router = useRouter();
  const goToLicenses = useCallback(() => {
    router.push('/mainTab/setting/licenses');
  }, []);
  const renderListItem = useCallback(({ item }: { item: SettingListItemProps }) => {
    return <SettingListItemComponent {...item} />;
  }, []);
  // const { signOut } = useSignOut();
  // const { user } = useAuthContext();
  // const currentLoginExplanation = useMemo(() => {
  //   const provider = user?.providerData[0]?.providerId;
  //   switch (provider) {
  //     case 'google.com':
  //       return 'Googleでログイン中';
  //     case 'apple.com':
  //       return 'Appleでログイン中';
  //     default:
  //       return 'その他の方法でログイン中';
  //   }
  // }, [user?.providerData]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.color.bgMain,
          },
        }}
      />
      <StatusBar style="inverted" />
      <SafeAreaView style={styles.container}>
        <FlatList
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={ListHeaderComponent}
          data={[
            {
              id: '1',
              text: 'Licenses',
              onPress: goToLicenses,
            },
            {
              id: '4',
              text: "App's future",
              onPress: () => {
                /* */
              },
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
  headerContainer: {
    alignItems: 'center',
    paddingBottom: 32,
    marginBottom: 32,
    backgroundColor: theme.color.bgNone,
    borderRadius: 8,
  },
  headerImage: {
    width: '70%',
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain',
    marginVertical: 'auto',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.color.textMain,
    textAlign: 'center',
  },
});
