import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
import { useMemo, useState } from 'react';
import { EpisodeAvailableType } from '../../../feature/graphql/__generated__/graphql';
import { TabHeader } from '../../../feature/Tab/TabHeader';
import { EpisodeQueriedList } from '../../../feature/Episode/components/EpisodeQueriedList';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const App = () => {
  const [selectedFilter, setSelectedFilter] = useState<EpisodeAvailableType | undefined>(
    EpisodeAvailableType.Perfect,
  );

  const filterItems = useMemo(() => {
    return [
      {
        title: 'PERFECT',
        onPress: () => setSelectedFilter(EpisodeAvailableType.Perfect),
        selected: selectedFilter === EpisodeAvailableType.Perfect,
      },
      {
        title: 'TRANSCRIPT',
        onPress: () => setSelectedFilter(EpisodeAvailableType.Transcript),
        selected: selectedFilter === EpisodeAvailableType.Transcript,
      },
      {
        title: 'ALL',
        onPress: () => setSelectedFilter(undefined),
        selected: selectedFilter === undefined,
      },
    ];
  }, [selectedFilter]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TabHeader items={filterItems} horizontalPadding={12} />
      </View>
      <EpisodeQueriedList type={selectedFilter} />
    </View>
  );
};

export default function withSuspense() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ExpoStatusBar style="inverted" />
      <SafeAreaView style={styles.container}>
        <App />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  filterContainer: {
    marginVertical: 8,
  },
  footerContainer: {
    marginTop: 24,
    width: '100%',
  },
});
