import { Fragment, memo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { theme } from '../../styles/theme';
import { StyleSheet } from 'react-native';
import PressableOpacity from '../../Pressable/PressableOpacity';
import { formatSecToMin } from '../../format/duration';

type Props = {
  currentTabIndex: number;
  onPressTab: (index: number) => void;
  tabs: { id: number; startTimeSec: number; endTimeSec: number }[];
};

const TabList = memo<Props>(({ currentTabIndex, onPressTab, tabs }) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabUnder} />
      <ScrollView
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContentContainerStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View key={'tabSpacer-1'} style={styles.tabSpacer} />
        {tabs.map((tab, index) => {
          const isCurrent = currentTabIndex === index;
          const onPress = () => onPressTab(index);
          return (
            <Fragment key={tab.id}>
              <View style={styles.tabSpacer} />
              <PressableOpacity
                onPress={onPress}
                style={[styles.tab, isCurrent && styles.currentTab]}
              >
                <Text>{`${formatSecToMin(tab.startTimeSec)} ~ ${formatSecToMin(
                  tab.endTimeSec,
                )}`}</Text>
              </PressableOpacity>
            </Fragment>
          );
        })}
        <View key={'tabSpacer-2'} style={styles.tabSpacer} />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse',
  },
  tabUnder: {
    backgroundColor: theme.color.bgMain,
    height: 4,
    width: '100%',
  },
  tabsContainer: {
    marginTop: 4,
    flexDirection: 'row',
  },
  tabsContentContainerStyle: {
    alignItems: 'flex-end',
  },
  tab: {
    backgroundColor: theme.color.bgMain,
    padding: 4,
    width: 100,
    height: 40,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 3,
    borderColor: theme.color.accent,
  },
  tabSpacer: {
    width: 16,
    height: 3,
    backgroundColor: theme.color.accent,
  },
  currentTab: {
    marginBottom: -2,
    borderBottomWidth: 0,
    height: 43,
  },
});

export default TabList;
