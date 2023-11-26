import { Fragment, memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';
import PressableScale from '../Pressable/PressableScale';

type Props = {
  items: {
    title: string;
    onPress: () => void;
    selected: boolean;
  }[];
  horizontalPadding: number;
};

export const TabHeader = memo<Props>(({ items, horizontalPadding }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filter}>
      <View key={'first-spacer'} style={{ width: horizontalPadding }} />
      {items.map((item) => (
        <Fragment key={item.title}>
          <PressableScale
            onPress={item.onPress}
            style={[styles.filterContent, item.selected && styles.selected]}
          >
            <Text style={[styles.filterText, item.selected && styles.filterTextSelected]}>
              {item.title}
            </Text>
          </PressableScale>
          <View style={{ width: 8 }} />
        </Fragment>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  filter: {
    flexDirection: 'row',
    gap: 8,
  },
  filterContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.color.bgNone,
  },
  selected: {
    backgroundColor: theme.color.accents.normal,
  },
  filterText: {
    fontWeight: '600',
  },
  filterTextSelected: {
    color: theme.color.bgNone,
  },
  footerContainer: {
    marginTop: 24,
    width: '100%',
  },
});
