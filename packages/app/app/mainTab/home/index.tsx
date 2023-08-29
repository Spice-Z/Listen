import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { theme } from '../../../feature/styles/theme';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useCallback } from 'react';
import SquareShimmer from '../../../feature/Shimmer/SquareShimmer';
import { gql } from '../../../feature/graphql/__generated__';
import { useSuspenseQuery } from '@apollo/client';
import PressableScale from '../../../feature/Pressable/PressableScale';
import MiniPlayerSpacer from '../../../feature/Spacer/MiniPlayerSpacer';

const SeparatorComponent = () => <View style={{ marginTop: 18 }} />;

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

function App() {
  const { data } = useSuspenseQuery(GET_CHANNELS);

  const router = useRouter();
  const onPressChannel = useCallback(
    (channelId: string) => {
      router.push({ pathname: '/mainTab/home/channel', params: { channelId } });
    },
    [router],
  );
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Shows',
        }}
      />
      <StatusBar style="inverted" />
      <View style={styles.container}>
        <FlatList
          data={data.channels.edges ?? []}
          numColumns={2}
          renderItem={({ item }) => {
            return (
              <PressableScale
                style={styles.channelCard}
                onPress={() => onPressChannel(item.node.channelId)}
              >
                {/* @ts-ignore */}
                <Image style={styles.artwork} src={item.node.imageUrl} />
                <Text numberOfLines={3} style={styles.channelTitle}>
                  {item.node.title}
                </Text>
              </PressableScale>
            );
          }}
          ItemSeparatorComponent={SeparatorComponent}
          contentContainerStyle={styles.contentContainer}
          columnWrapperStyle={styles.columnWrapperStyle}
          ListFooterComponent={MiniPlayerSpacer}
        />
      </View>
    </>
  );
}

function FallBack() {
  return (
    <View style={styles.container}>
      <View style={{ height: 16 }} />
      <SquareShimmer width="100%" height={80} />
      <View style={{ height: 16 }} />
      <SquareShimmer width="100%" height={80} />
      <View style={{ height: 16 }} />
      <SquareShimmer width="100%" height={80} />
      <View style={{ height: 16 }} />
      <SquareShimmer width="100%" height={80} />
      <View style={{ height: 16 }} />
      <SquareShimmer width="100%" height={80} />
    </View>
  );
}

export default function withSuspense() {
  return (
    <Suspense fallback={<FallBack />}>
      <App />
    </Suspense>
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
  loading: {
    color: theme.color.textMain,
  },
  channelCard: {
    borderRadius: 8,
    color: theme.color.textMain,
    width: (Dimensions.get('window').width - 16 * 2 - 8) / 2,
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
});
