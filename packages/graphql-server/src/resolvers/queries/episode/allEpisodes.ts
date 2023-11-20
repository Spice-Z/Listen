import gql from 'graphql-tag';
import type { Episode, QueryResolvers } from '../../../../generated/resolvers-types';
import { firestore } from '../../../firebase/index.js';
import { ALL_EPISODES_DOCUMENT_NAME } from '../../../constants.js';
import type { AEEpisode } from '../../../firebase/converters/allEpisodesEpisodeConverter.js';
import { allEpisodesEpisodeConverter } from '../../../firebase/converters/allEpisodesEpisodeConverter.js';
import { channelConverter } from '../../../firebase/converters/channelConverter.js';

const typeDefs = gql`
  enum EpisodeAvailableType {
    TRANSCRIPT
    TRANSLATED_TRANSCRIPT
    DICTATION
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
  console.log('allEpisodes');

  // TODO: dataloader,redis
  // TODO: ページング
  const episodesData = await (async () => {
    if (filter?.availableType === 'TRANSCRIPT') {
      const episodesData = (
        await firestore
          .collection(ALL_EPISODES_DOCUMENT_NAME)
          .withConverter(allEpisodesEpisodeConverter)
          .where('transcriptUrl', '!=', null)
          .orderBy('pubDate', 'desc')
          .limit(first)
          .get()
      ).docs.map((doc) => doc.data());
      return episodesData;
    }
    if (filter?.availableType === 'TRANSLATED_TRANSCRIPT') {
      const episodesData = (
        await firestore
          .collection(ALL_EPISODES_DOCUMENT_NAME)
          .withConverter(allEpisodesEpisodeConverter)
          .where('translatedTranscripts', '!=', null)
          .orderBy('pubDate', 'desc')
          .limit(first)
          .get()
      ).docs.map((doc) => doc.data());
      return episodesData;
    }
    if (filter?.availableType === 'DICTATION') {
      const episodesData = (
        await firestore
          .collection(ALL_EPISODES_DOCUMENT_NAME)
          .withConverter(allEpisodesEpisodeConverter)
          .where('canDictation', '==', true)
          .orderBy('pubDate', 'desc')
          .limit(first)
          .get()
      ).docs.map((doc) => doc.data());
      return episodesData;
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

  console.log('fetch all');
  // TODO: dataloader,redis
  const edges = await Promise.all(
    episodesData.map(async (data) => {
      const channelDoc = await firestore
        .collection('channels')
        .withConverter(channelConverter)
        .doc(data.channelId)
        .get();
      const hasChangeableAd = channelDoc.data()?.hasChangeableAd ?? true;

      const episode = _aeEpisodeToEpisode(data, hasChangeableAd);
      return {
        cursor: data.id,
        node: {
          ...episode,
        },
      };
    }),
  );
  console.log('length', edges.length);

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
