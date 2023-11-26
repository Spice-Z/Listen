import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import WithSuspenseAndBoundary from '../../Suspense/WithSuspenseAndBoundary';
import { FlatList, View } from 'react-native';
import SquareShimmer from '../../Shimmer/SquareShimmer';
import MiniPlayerSpacer from '../../Spacer/MiniPlayerSpacer';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import BannerAdMob from '../../../feature/Ad/BannerAdMob';
import { theme } from '../../styles/theme';
import { StyleSheet } from 'react-native';
import { EpisodeAvailableType, GetAllEpisodesQuery } from '../../graphql/__generated__/graphql';
import { gql } from '../../graphql/__generated__';
import { useSuspenseQuery } from '@apollo/client';
import { useRouter } from 'expo-router';
import { TrackPlayerTrack, useTrackPlayer } from '../../Player/hooks/useTrackPlayer';
import EpisodePlayCard from './EpisodePlayCard';
import { usePlayerContext } from '../../context/player/context';

type Props = {
  type: EpisodeAvailableType | undefined;
};

export type AllEpisodeNode = GetAllEpisodesQuery['allEpisodes']['edges'][0]['node'];
export const GET_ALL_EPISODES = gql(/* GraphQL */ `
  query GetAllEpisodes($cursor: String, $type: EpisodeAvailableType) {
    allEpisodes(after: $cursor, filter: { availableType: $type }) {
      edges {
        node {
          id
          episodeId
          title
          url
          imageUrl
          duration
          pubDate
          transcriptUrl
          translatedTranscripts {
            language
            transcriptUrl
          }
          channel {
            id
            channelId
            title
            hasChangeableAd
            imageUrl
          }
          canDictation
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`);

const EpisodeQueriedList = memo<Props>(({ type }) => {
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  // typeが変わったら、一番上にスクロールする
  useEffect(() => {
    listRef.current?.scrollToIndex({ animated: false, index: 0 });
  }, [type]);

  const { data: dataOfAll } = useSuspenseQuery(GET_ALL_EPISODES, {
    variables: {
      type,
    },
    fetchPolicy: 'cache-first',
  });
  const listData = useMemo(() => {
    const data = dataOfAll.allEpisodes.edges.map((v) => v.node);
    if (__DEV__) {
      // dev環境は、データが少ないので5倍にする
      return [
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
      ];
    }
    return data;
  }, [dataOfAll.allEpisodes.edges]);

  const { playTrackIfNotCurrentlyPlaying, currentTrack, isPlaying } = useTrackPlayer();
  const { playType, setPlayType } = usePlayerContext();

  const renderItem = useCallback(
    ({ item }: { item: AllEpisodeNode }) => {
      const _handleSetTrack = async () => {
        const track: TrackPlayerTrack = {
          id: item.episodeId,
          channelId: item.channel.channelId,
          title: item.title,
          artist: item.channel.title,
          artwork: item.imageUrl || item.channel.imageUrl,
          url: item.url,
          duration: item.duration,
          // TODO: add Date from pubDate
        };
        await playTrackIfNotCurrentlyPlaying(track);
      };
      const onPressPlay = async () => {
        _handleSetTrack();
        router.push('/modalPlayer');
        setPlayType('default');
      };
      const onPressDictationPlay = async () => {
        _handleSetTrack();
        router.push('/modalDictationPlayer');
        setPlayType('dictation');
      };
      const onPressDetail = () => {
        router.push({
          pathname: 'mainTab/search/episode',
          params: { channelId: item.channel.channelId, episodeId: item.episodeId },
        });
      };
      const isCurrentSelected = currentTrack?.id === item.episodeId;
      const isCurrentDefaultPlaying = isCurrentSelected && isPlaying && playType === 'default';
      const isCurrentDictationPlaying = isCurrentSelected && isPlaying && playType === 'dictation';
      return (
        <EpisodePlayCard
          title={item.title}
          channelTitle={item.channel.title}
          duration={item.duration}
          imageUrl={item.imageUrl || item.channel.imageUrl}
          dateUnixTime={item.pubDate}
          isCurrentSelected={isCurrentSelected}
          isCurrentDictationPlaying={isCurrentDictationPlaying}
          isCurrentDefaultPlaying={isCurrentDefaultPlaying}
          onPressDetail={onPressDetail}
          onPressPlay={onPressPlay}
          onPressDictationPlay={onPressDictationPlay}
          hasTranslatedTranscript={item.translatedTranscripts.length > 0}
          hasTranscript={!!item.transcriptUrl}
          canAutoScroll={!item.channel.hasChangeableAd && item.transcriptUrl !== null}
          canDictation={item.canDictation}
        />
      );
    },
    [currentTrack?.id, isPlaying, playTrackIfNotCurrentlyPlaying, playType, router, setPlayType],
  );

  return (
    <FlatList
      ref={listRef}
      style={styles.listContainer}
      data={listData}
      renderItem={renderItem}
      ItemSeparatorComponent={SeparatorComponent}
      ListFooterComponent={ListFooterComponent}
    />
  );
});

const WithSuspense = (props: Props) => {
  return (
    <WithSuspenseAndBoundary fallback={<FallBack />}>
      <EpisodeQueriedList {...props} />
    </WithSuspenseAndBoundary>
  );
};

export { WithSuspense as EpisodeQueriedList };

function FallBack() {
  const data = useMemo(() => {
    return [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }];
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listContainer}
        data={data}
        renderItem={() => {
          return <SquareShimmer width="100%" height={130} />;
        }}
        ItemSeparatorComponent={SeparatorComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
}

const SeparatorComponent = memo(() => <View style={{ height: 8 }} />);

const ListFooterComponent = memo(() => {
  return (
    <>
      <View style={styles.footerContainer}>
        <BannerAdMob size={BannerAdSize.BANNER} />
      </View>
      <MiniPlayerSpacer />
    </>
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
  filterContainer: {
    marginHorizontal: 12,
  },
  footerContainer: {
    marginTop: 24,
    width: '100%',
  },
});
