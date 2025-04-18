/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetChannel($channelId: String!) {\n    channel(channelId: $channelId) {\n      id\n      title\n      description\n      imageUrl\n      author\n      episodes {\n        edges {\n          node {\n            id\n            episodeId\n            title\n            content\n            url\n            imageUrl\n            duration\n            pubDate\n            hasChangeableAd\n            transcriptUrl\n            translatedTranscripts {\n              language\n              transcriptUrl\n            }\n            canDictation\n          }\n        }\n      }\n    }\n  }\n": types.GetChannelDocument,
    "\n  query GetChannels($cursor: String) {\n    channels(after: $cursor) {\n      edges {\n        node {\n          id\n          channelId\n          title\n          description\n          imageUrl\n          author\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": types.GetChannelsDocument,
    "\n  query GetEpisode($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      episodeId\n      title\n      content\n      url\n      imageUrl\n      duration\n      pubDate\n      hasChangeableAd\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n      canDictation\n      channel {\n        id\n        channelId\n        title\n        imageUrl\n        author\n      }\n    }\n  }\n": types.GetEpisodeDocument,
    "\n  query GetAllEpisodes($cursor: String, $type: EpisodeAvailableType) {\n    allEpisodes(after: $cursor, filter: { availableType: $type }) {\n      edges {\n        node {\n          id\n          episodeId\n          title\n          url\n          imageUrl\n          duration\n          pubDate\n          transcriptUrl\n          translatedTranscripts {\n            language\n            transcriptUrl\n          }\n          channel {\n            id\n            channelId\n            title\n            hasChangeableAd\n            imageUrl\n          }\n          canDictation\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": types.GetAllEpisodesDocument,
    "\n  query GetEpisodeTranslatedScripts($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n      hasChangeableAd\n    }\n  }\n": types.GetEpisodeTranslatedScriptsDocument,
    "\n  query GetEpisodeInCurrentEpisodeData($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n      hasChangeableAd\n      canDictation\n    }\n  }\n": types.GetEpisodeInCurrentEpisodeDataDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetChannel($channelId: String!) {\n    channel(channelId: $channelId) {\n      id\n      title\n      description\n      imageUrl\n      author\n      episodes {\n        edges {\n          node {\n            id\n            episodeId\n            title\n            content\n            url\n            imageUrl\n            duration\n            pubDate\n            hasChangeableAd\n            transcriptUrl\n            translatedTranscripts {\n              language\n              transcriptUrl\n            }\n            canDictation\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetChannel($channelId: String!) {\n    channel(channelId: $channelId) {\n      id\n      title\n      description\n      imageUrl\n      author\n      episodes {\n        edges {\n          node {\n            id\n            episodeId\n            title\n            content\n            url\n            imageUrl\n            duration\n            pubDate\n            hasChangeableAd\n            transcriptUrl\n            translatedTranscripts {\n              language\n              transcriptUrl\n            }\n            canDictation\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetChannels($cursor: String) {\n    channels(after: $cursor) {\n      edges {\n        node {\n          id\n          channelId\n          title\n          description\n          imageUrl\n          author\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetChannels($cursor: String) {\n    channels(after: $cursor) {\n      edges {\n        node {\n          id\n          channelId\n          title\n          description\n          imageUrl\n          author\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEpisode($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      episodeId\n      title\n      content\n      url\n      imageUrl\n      duration\n      pubDate\n      hasChangeableAd\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n      canDictation\n      channel {\n        id\n        channelId\n        title\n        imageUrl\n        author\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEpisode($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      episodeId\n      title\n      content\n      url\n      imageUrl\n      duration\n      pubDate\n      hasChangeableAd\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n      canDictation\n      channel {\n        id\n        channelId\n        title\n        imageUrl\n        author\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAllEpisodes($cursor: String, $type: EpisodeAvailableType) {\n    allEpisodes(after: $cursor, filter: { availableType: $type }) {\n      edges {\n        node {\n          id\n          episodeId\n          title\n          url\n          imageUrl\n          duration\n          pubDate\n          transcriptUrl\n          translatedTranscripts {\n            language\n            transcriptUrl\n          }\n          channel {\n            id\n            channelId\n            title\n            hasChangeableAd\n            imageUrl\n          }\n          canDictation\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllEpisodes($cursor: String, $type: EpisodeAvailableType) {\n    allEpisodes(after: $cursor, filter: { availableType: $type }) {\n      edges {\n        node {\n          id\n          episodeId\n          title\n          url\n          imageUrl\n          duration\n          pubDate\n          transcriptUrl\n          translatedTranscripts {\n            language\n            transcriptUrl\n          }\n          channel {\n            id\n            channelId\n            title\n            hasChangeableAd\n            imageUrl\n          }\n          canDictation\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEpisodeTranslatedScripts($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n      hasChangeableAd\n    }\n  }\n"): (typeof documents)["\n  query GetEpisodeTranslatedScripts($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n      hasChangeableAd\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEpisodeInCurrentEpisodeData($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n      hasChangeableAd\n      canDictation\n    }\n  }\n"): (typeof documents)["\n  query GetEpisodeInCurrentEpisodeData($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n      hasChangeableAd\n      canDictation\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;