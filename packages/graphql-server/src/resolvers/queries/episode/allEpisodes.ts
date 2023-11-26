import gql from 'graphql-tag';
import type { Episode, QueryResolvers } from '../../../../generated/resolvers-types';
import { firestore } from '../../../firebase/index.js';
import { ALL_EPISODES_DOCUMENT_NAME } from '../../../constants.js';
import type { AEEpisode } from '../../../firebase/converters/allEpisodesEpisodeConverter.js';
import { allEpisodesEpisodeConverter } from '../../../firebase/converters/allEpisodesEpisodeConverter.js';
import { chanelDataLoader } from '../../../dataloader/channel.js';
import { GraphQLError } from 'graphql';

const typeDefs = gql`
  enum EpisodeAvailableType {
    PERFECT
    TRANSCRIPT
  }
  input AllEpisodeFilter {
    availableType: EpisodeAvailableType
  }
  extend type Query {
    allEpisodes(
      first: Int = 30
      after: String
      before: String
      last: Int
      filter: AllEpisodeFilter
    ): EpisodeConnection!
  }
`;

const resolver: QueryResolvers['allEpisodes'] = async (_parent, args, _context, _info) => {
  const { first, filter } = args;
  console.log(`allEpisodes called. first: ${first}, filter: ${JSON.stringify(filter)}`);

  // TODO: redis
  // TODO: ページング
  const episodesData = await (async () => {
    if (filter?.availableType === 'PERFECT') {
      try {
        const episodeDocs = await firestore
          .collection(ALL_EPISODES_DOCUMENT_NAME)
          .where('canDictation', '==', true)
          .withConverter(allEpisodesEpisodeConverter)
          .orderBy('pubDate', 'desc')
          .limit(first)
          .get();
        if (episodeDocs.empty) {
          return [];
        }
        const episodesData = episodeDocs.docs.map((doc) => doc.data());
        // transcriptUrlがnullのものを除外
        episodesData.filter((episode) => episode.transcriptUrl !== null);
        return episodesData;
      } catch (e) {
        console.log(e);
        return [];
      }
    }
    if (filter?.availableType === 'TRANSCRIPT') {
      try {
        const episodesData = (
          await firestore
            .collection(ALL_EPISODES_DOCUMENT_NAME)
            .withConverter(allEpisodesEpisodeConverter)
            .where('transcriptUrl', '!=', null)
            .orderBy('transcriptUrl', 'desc')
            .orderBy('pubDate', 'desc')
            .limit(first)
            .get()
        ).docs.map((doc) => doc.data());
        // pubDateでdescソート
        episodesData.sort((a, b) => {
          if (a.pubDate > b.pubDate) {
            return -1;
          }
          if (a.pubDate < b.pubDate) {
            return 1;
          }
          return 0;
        });
        return episodesData;
      } catch (error) {
        console.log(error);
        return [];
      }
    }
    const episodesData = (
      await firestore
        .collection(ALL_EPISODES_DOCUMENT_NAME)
        .withConverter(allEpisodesEpisodeConverter)
        .orderBy('pubDate', 'desc')
        .limit(first)
        .get()
    ).docs.map((doc) => doc.data());
    return episodesData;
  })();

  const edges = await Promise.all(
    episodesData.map(async (data) => {
      const channel = await chanelDataLoader.load(data.channelId);
      if (channel instanceof Error) {
        throw new GraphQLError('The requested channel does not exist.', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }

      const hasChangeableAd = channel.hasChangeableAd;
      const episode = _aeEpisodeToEpisode(data, hasChangeableAd);
      return {
        cursor: data.id,
        node: {
          ...episode,
        },
      };
    }),
  );

  if (edges.length === 0) {
    return {
      edges,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }

  return {
    edges,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: edges[0].cursor,
      endCursor: edges[edges.length - 1].cursor,
    },
  };
};

const resolvers: QueryResolvers = {
  allEpisodes: resolver,
};

export default {
  typeDefs,
  resolvers,
};

const _aeEpisodeToEpisode = (aeEpisode: AEEpisode, hasChangeableAd: boolean): Partial<Episode> => {
  return {
    __typename: 'Episode',
    canDictation: aeEpisode.canDictation,
    content: aeEpisode.content,
    description: aeEpisode.description,
    duration: aeEpisode.duration,
    episodeId: aeEpisode.episodeId,
    hasChangeableAd,
    id: aeEpisode.id,
    imageUrl: aeEpisode.imageUrl,
    pubDate: aeEpisode.pubDate,
    title: aeEpisode.title,
    transcriptUrl: aeEpisode.transcriptUrl,
    translatedTranscripts: aeEpisode.translatedTranscripts,
    url: aeEpisode.url,
  };
};
