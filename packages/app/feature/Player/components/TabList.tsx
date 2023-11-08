import { memo, useCallback, useEffect, useRef } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { theme } from '../../styles/theme';
import { StyleSheet } from 'react-native';
import PressableOpacity from '../../Pressable/PressableOpacity';
import { formatSecToMin } from '../../format/duration';
import { FlatList } from 'react-native-gesture-handler';

const TAB_WIDTH = 100;
const TAB_SPACER_WIDTH = 16;

type Props = {
  currentTabIndex: number;
  onPressTab: (index: number) => void;
  tabs: { id: number; startTimeSec: number; endTimeSec: number }[];
};

const TabList = memo<Props>(({ currentTabIndex, onPressTab, tabs }) => {
  const listRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();

  const renderItem = useCallback(
    ({ item, index }) => {
      const isCurrent = currentTabIndex === index;
      const onPress = () => onPressTab(index);
      return (
        <View style={styles.item}>
          <View style={styles.tabSpacer} />
          <PressableOpacity onPress={onPress} style={[styles.tab, isCurrent && styles.currentTab]}>
            <Text>{`${formatSecToMin(item.startTimeSec)} ~ ${formatSecToMin(
              item.endTimeSec,
            )}`}</Text>
          </PressableOpacity>
          {index === tabs.length - 1 && <View style={styles.tabSpacer} />}
        </View>
      );
    },
    [currentTabIndex, onPressTab, tabs.length],
  );
  const getItemLayout = useCallback((_, index) => {
    const itemLength = TAB_WIDTH + TAB_SPACER_WIDTH;
    return {
      length: itemLength,
      offset: itemLength * index + TAB_SPACER_WIDTH,
      index,
    };
  }, []);

  // タブが変わった時にスクロールする
  useEffect(() => {
    if (tabs.length === 0) {
      return;
    }
    const itemLength = TAB_WIDTH + TAB_SPACER_WIDTH;

    listRef.current?.scrollToIndex({
      index: currentTabIndex,
      viewOffset: width / 2 - itemLength / 2,
    });
  }, [currentTabIndex, tabs.length, width]);

  return (
    <View style={styles.container}>
      <View style={styles.tabUnder} />
      <FlatList
        ref={listRef}
        data={tabs}
        style={styles.tabsContainer}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        getItemLayout={getItemLayout}
      />
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
  },
  tab: {
    backgroundColor: theme.color.bgMain,
    padding: 4,
    width: TAB_WIDTH,
    height: 40,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 3,
    borderColor: theme.color.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSpacer: {
    width: TAB_SPACER_WIDTH,
    height: 3,
    backgroundColor: theme.color.accent,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currentTab: {
    marginBottom: 0,
    borderBottomWidth: 0,
    height: 43,
  },
});

export default TabList;
