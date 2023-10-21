import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
import { StatusBar } from 'expo-status-bar';
import { memo, useCallback, useMemo } from 'react';
import { gql } from '../../../feature/graphql/__generated__';
import { useSuspenseQuery } from '@apollo/client';
import PressableScale from '../../../feature/Pressable/PressableScale';
import MiniPlayerSpacer from '../../../feature/Spacer/MiniPlayerSpacer';
import WithSuspenseAndBoundary from '../../../feature/Suspense/WithSuspenseAndBoundary';
import { Image as ExpoImage } from 'expo-image';
import { IMAGE_DEFAULT_BLUR_HASH } from '../../../constants';
import SquareShimmer from '../../../feature/Shimmer/SquareShimmer';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import BannerAdMob from '../../../feature/Ad/BannerAdMob';
import { GetChannelsQuery } from '../../../feature/graphql/__generated__/graphql';

type ChannelNode = GetChannelsQuery['channels']['edges'][0]['node'];
type ListNode = ChannelNode & { isAd: boolean; isAdSpace: boolean };
const emptyChannelNode = {
  channelId: '',
  title: '',
  description: '',
  imageUrl: '',
  author: '',
};

const SeparatorComponent = memo(() => <View style={{ marginTop: 18 }} />);

const GET_CHANNELS = gql(/* GraphQL */ `
  query GetChannels($cursor: String) {
    channels(after: $cursor) {
      edges {
        node {
          id
          channelId
          title
          description
          imageUrl
          author
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`);

const ListHeaderComponent = memo(() => {
  return (
    <View style={styles.headerContainer}>
      <BannerAdMob size={BannerAdSize.BANNER} />
    </View>
  );
});

const ListFooterComponent = () => {
  return (
    <>
      <View style={styles.footerContainer}>
        <BannerAdMob size={BannerAdSize.BANNER} />
      </View>
      <MiniPlayerSpacer />
    </>
  );
};

function App() {
  const { data } = useSuspenseQuery(GET_CHANNELS);

  const router = useRouter();
  const onPressChannel = useCallback(
    (channelId: string) => {
      router.push({ pathname: 'mainTab/search/channel', params: { channelId } });
    },
    [router],
  );
  const listData = useMemo(() => {
    let edges = data.channels.edges;
    // dev環境の場合はedgesが少ないので10倍
    if (__DEV__) {
      edges = [
        ...edges,
        ...edges,
        ...edges,
        ...edges,
        ...edges,
        ...edges,
        ...edges,
        ...edges,
        ...edges,
        ...edges,
      ];
    }
    // 6個に一回、広告データを差し込んだ新しいリストを作成する
    const list: ListNode[] = [];
    for (let i = 0; i < edges.length; i++) {
      list.push({ ...edges[i].node, isAd: false, isAdSpace: false });
      if (i !== 0 && (i + 1) % 6 === 0) {
        list.push({ ...emptyChannelNode, id: `ad-${i}`, isAd: true, isAdSpace: false });
        list.push({ ...emptyChannelNode, id: `ad-${i}-space`, isAd: true, isAdSpace: true });
      }
    }
    return list;
  }, [data.channels.edges]);
  const renderItem = useCallback(
    ({ item }: { item: ListNode }) => {
      if (item.isAd) {
        // isAdは二個分のスペースを取る
        if (item.isAdSpace) {
          return null;
        }
        return (
          <View style={styles.adInList}>
            <BannerAdMob size={BannerAdSize.MEDIUM_RECTANGLE} />
          </View>
        );
      }
      return (
        <PressableScale style={styles.channelCard} onPress={() => onPressChannel(item.channelId)}>
          <ExpoImage
            style={styles.artwork}
            source={item.imageUrl}
            placeholder={IMAGE_DEFAULT_BLUR_HASH}
          />
          <Text numberOfLines={3} style={styles.channelTitle}>
            {item.title}
          </Text>
        </PressableScale>
      );
    },
    [onPressChannel],
  );
  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={listData}
          numColumns={2}
          renderItem={renderItem}
          ItemSeparatorComponent={SeparatorComponent}
          contentContainerStyle={styles.contentContainer}
          columnWrapperStyle={styles.columnWrapperStyle}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
        />
      </View>
    </>
  );
}

function FallBack() {
  const squareSize = useMemo(() => {
    return (Dimensions.get('window').width - 16 * 2 - 8) / 2;
  }, []);
  const data = useMemo(() => {
    return [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }];
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        renderItem={() => {
          return (
            <View style={styles.channelCard}>
              <SquareShimmer width="100%" height={squareSize} />
              <View style={{ width: '100%', height: 10 }} />
              <SquareShimmer width="100%" height={30} />
            </View>
          );
        }}
        ItemSeparatorComponent={SeparatorComponent}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.columnWrapperStyle}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
}

export default function withSuspense() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Search',
          headerStyle: {
            backgroundColor: theme.color.bgMain,
          },
        }}
      />
      <StatusBar style="inverted" />
      <WithSuspenseAndBoundary fallback={<FallBack />}>
        <App />
      </WithSuspenseAndBoundary>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  fallbackContentContainer: {
    backgroundColor: 'red',
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    flexShrink: 0,
    justifyContent: 'space-between',
  },
  loading: {
    color: theme.color.textMain,
  },
  channelCard: {
    borderRadius: 8,
    color: theme.color.textMain,
    width: (Dimensions.get('window').width - 16 * 2 - 8) / 2,
  },
  adInList: {
    width: Dimensions.get('window').width - 16 * 2 - 8,
  },
  artwork: {
    width: '100%',
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  channelTitle: {
    color: theme.color.textMain,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  columnWrapperStyle: {
    width: '100%',
    justifyContent: 'space-between',
  },
  headerContainer: {
    width: '100%',
    marginBottom: 16,
  },
  footerContainer: {
    marginTop: 24,
    width: '100%',
  },
});
