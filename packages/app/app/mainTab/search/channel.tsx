import { Stack, useRouter, useGlobalSearchParams } from 'expo-router';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../feature/styles/theme';
import { memo, useCallback, useMemo } from 'react';
import ChannelInfo from '../../../feature/Channel/components/ChannelInfo';
import EpisodeCard from '../../../feature/Episode/components/EpisodeCard';
import SquareShimmer from '../../../feature/Shimmer/SquareShimmer';
import { gql } from '../../../feature/graphql/__generated__';
import { useSuspenseQuery } from '@apollo/client';
import WithSuspenseAndBoundary from '../../../feature/Suspense/WithSuspenseAndBoundary';
import MiniPlayerSpacer from '../../../feature/Spacer/MiniPlayerSpacer';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import BannerAdMob from '../../../feature/Ad/BannerAdMob';

const GET_CHANNEL = gql(/* GraphQL */ `
  query GetChannel($channelId: String!) {
    channel(channelId: $channelId) {
      id
      title
      description
      imageUrl
      author
      episodes {
        edges {
          node {
            id
            episodeId
            title
            content
            url
            imageUrl
            duration
            pubDate
            hasChangeableAd
            transcriptUrl
            translatedTranscripts {
              language
              transcriptUrl
            }
          }
        }
      }
    }
  }
`);

function Channel() {
  const { channelId } = useGlobalSearchParams();
  const { data } = useSuspenseQuery(GET_CHANNEL, {
    variables: {
      channelId: channelId as string,
    },
  });
  const episodeList = useMemo(() => {
    return data.channel.episodes.edges.map((edge) => edge.node);
  }, [data]);
  const router = useRouter();
  const channelInfo = useMemo(() => {
    if (data.channel) {
      return {
        title: data.channel.title,
        imageUrl: data.channel.imageUrl,
        description: data.channel.description,
        author: data.channel.author,
      };
    }
    return {
      title: '',
      imageUrl: '',
      description: '',
      author: '',
    };
  }, [data]);

  const ChanelInfoComponent = useMemo(() => {
    return (
      <>
        <ChannelInfo channelInfo={channelInfo} />
        <View style={styles.adContainer}>
          <BannerAdMob
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
        <Text style={styles.episodeHead}>All Episodes</Text>
      </>
    );
  }, [channelInfo]);

  const onPressEpisode = useCallback(
    (episodeId: string) => {
      router.push({ pathname: 'mainTab/search/episode', params: { channelId, episodeId } });
    },
    [channelId, router],
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: channelInfo.title,
        }}
      />
      <View style={styles.container}>
        <FlatList
          style={styles.listContainer}
          ListHeaderComponent={ChanelInfoComponent}
          ListFooterComponent={MiniPlayerSpacer}
          data={episodeList}
          renderItem={({ item }) => {
            return (
              <EpisodeCard
                key={item.id}
                id={item.episodeId}
                title={item.title}
                description={item.content}
                duration={item.duration}
                imageUrl={item.imageUrl || channelInfo.imageUrl}
                dateUnixTime={item.pubDate}
                onPress={onPressEpisode}
                hasTranslatedTranscript={item.translatedTranscripts.length > 0}
                hasTranscript={item.transcriptUrl !== null}
                canAutoScroll={!item.hasChangeableAd && item.transcriptUrl !== null}
              />
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </View>
    </>
  );
}

const FallBack = memo(() => {
  const windoWidth = useMemo(() => {
    return Dimensions.get('window').width;
  }, []);
  return (
    <View style={[styles.container, styles.listContainer]}>
      <View style={{ flexDirection: 'row' }}>
        <SquareShimmer width={122} height={122} />
        <View style={{ width: 16 }} />
        <SquareShimmer width={windoWidth - 122 - 32 - 16} height={60} />
      </View>
      <View style={{ marginTop: 16 }}>
        <SquareShimmer width="100%" height={122} />
      </View>
      <View style={{ marginTop: 16 }}>
        <SquareShimmer width="100%" height={18} />
      </View>
      <View style={{ marginTop: 16 }}>
        <SquareShimmer width="100%" height={80} />
        <View style={{ height: 16 }} />
        <SquareShimmer width="100%" height={80} />
        <View style={{ height: 16 }} />
        <SquareShimmer width="100%" height={80} />
        <View style={{ height: 16 }} />
        <SquareShimmer width="100%" height={80} />
      </View>
    </View>
  );
});

export default function withSuspense() {
  return (
    <>
      <Stack.Screen
        options={{
          title: '',
        }}
      />
      <WithSuspenseAndBoundary fallback={<FallBack />}>
        <Channel />
      </WithSuspenseAndBoundary>
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
  episodeHead: {
    marginVertical: 16,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    color: theme.color.textMain,
  },
  adContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
});
