import { Stack, useRouter, useGlobalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../feature/styles/theme';
import { useCallback, useMemo } from 'react';
import ChannelInfo from '../../../feature/Channel/components/ChannelInfo';
import EpisodeCard from '../../../feature/Episode/components/EpisodeCard';
import SquareShimmer from '../../../feature/Shimmer/SquareShimmer';
import { gql } from '../../../feature/graphql/__generated__';
import { useSuspenseQuery } from '@apollo/client';
import WithSuspense from '../../../feature/Suspense/WithSuspense';

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
        <Text style={styles.episodeHead}>All Episodes</Text>
      </>
    );
  }, [channelInfo]);

  const onPressEpisode = useCallback(
    (episodeId: string) => {
      router.push({ pathname: '/mainTab/home/episode', params: { channelId, episodeId } });
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
          ListHeaderComponent={ChanelInfoComponent}
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
                // TODO: fix pubDate
                date={new Date()}
                onPress={onPressEpisode}
              />
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </View>
    </>
  );
}

function FallBack() {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <SquareShimmer width={122} height={122} />
        <View style={{ width: 16 }} />
        <SquareShimmer width="100%" height={60} />
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
}

export default function withSuspense() {
  return (
    <WithSuspense fallback={<FallBack />}>
      <Channel />
    </WithSuspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgMain,
    paddingHorizontal: 16,
  },
  episodeHead: {
    marginVertical: 16,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    color: theme.color.textMain,
  },
});
