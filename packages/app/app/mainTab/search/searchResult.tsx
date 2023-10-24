import { Dimensions, FlatList, Linking, StyleSheet, Text, View, Image } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
import { StatusBar } from 'expo-status-bar';
import { memo, useCallback, useMemo } from 'react';
import { useSuspenseQuery } from '@apollo/client';
import PressableScale from '../../../feature/Pressable/PressableScale';
import MiniPlayerSpacer from '../../../feature/Spacer/MiniPlayerSpacer';
import WithSuspenseAndBoundary from '../../../feature/Suspense/WithSuspenseAndBoundary';
import { Image as ExpoImage } from 'expo-image';

import { IMAGE_DEFAULT_BLUR_HASH, URL_INQUIRY } from '../../../constants';
import SquareShimmer from '../../../feature/Shimmer/SquareShimmer';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import BannerAdMob from '../../../feature/Ad/BannerAdMob';
import { ChannelNode, GET_CHANNELS } from '.';

const SeparatorComponent = memo(() => <View style={{ marginTop: 18 }} />);

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

function SearchResult() {
  const { data } = useSuspenseQuery(GET_CHANNELS);
  const { searchText } = useLocalSearchParams();

  const router = useRouter();
  const onPressChannel = useCallback(
    (channelId: string) => {
      router.push({ pathname: 'mainTab/search/channel', params: { channelId } });
    },
    [router],
  );
  const listData = useMemo(() => {
    const edges = data.channels.edges;
    const filteredEdges = edges.filter((edge) => edge.node.title.includes(searchText as string));
    return filteredEdges.map((edge) => edge.node);
  }, [data.channels.edges, searchText]);
  const renderItem = useCallback(
    ({ item }: { item: ChannelNode }) => {
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

  const openInquiryForm = useCallback(async () => {
    await Linking.openURL(URL_INQUIRY);
  }, []);

  const ListEmptyComponent = useMemo(() => {
    return (
      <View style={styles.emptyContainer}>
        <Image
          width={1810}
          height={1810}
          style={styles.emptyImage}
          source={require('../../../assets/image/depressed-woman.png')}
        />
        <Text style={styles.emptyApologize}>Sorry, no channels found...</Text>
        <Text style={styles.but}>But, you can request any shows!</Text>
        <PressableScale style={styles.inquiryButton} onPress={openInquiryForm}>
          <Text style={styles.inquiryText}>リクエストを送る</Text>
        </PressableScale>
      </View>
    );
  }, [openInquiryForm]);
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
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
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
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
}

export default function WithSuspense() {
  const { searchText } = useLocalSearchParams();
  const title = `search result of '${searchText}'`;
  return (
    <>
      <Stack.Screen
        options={{
          title,
          headerStyle: {
            backgroundColor: theme.color.bgMain,
          },
        }}
      />
      <StatusBar style="inverted" />
      <WithSuspenseAndBoundary fallback={<FallBack />}>
        <SearchResult />
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
  emptyContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyImage: {
    marginTop: 40,
    width: 200,
    height: 200,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  emptyApologize: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '500',
  },
  but: {
    marginTop: 20,
  },
  inquiryButton: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.color.accent,
    borderRadius: 4,
  },
  inquiryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.color.bgNone,
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
    height: 250,
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
  footerContainer: {
    marginTop: 24,
    width: '100%',
  },
});
