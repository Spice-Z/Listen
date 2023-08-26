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
    "\n  query GetChannel($channelId: String!) {\n    channel(channelId: $channelId) {\n      id\n      title\n      description\n      imageUrl\n      author\n      episodes {\n        edges {\n          node {\n            id\n            episodeId\n            title\n            content\n            url\n            imageUrl\n            duration\n            pubDate\n          }\n        }\n      }\n    }\n  }\n": types.GetChannelDocument,
    "\n  query GetEpisode($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      episodeId\n      title\n      content\n      url\n      imageUrl\n      duration\n      pubDate\n    }\n  }\n": types.GetEpisodeDocument,
    "\n  query GetChannelInEpisode($channelId: String!) {\n    channel(channelId: $channelId) {\n      id\n      title\n      imageUrl\n      author\n    }\n  }\n": types.GetChannelInEpisodeDocument,
    "\n  query GetChannels($cursor: String) {\n    channels(after: $cursor) {\n      edges {\n        node {\n          id\n          channelId\n          title\n          description\n          imageUrl\n          author\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": types.GetChannelsDocument,
    "\n  query GetEpisodeInModalTranscript($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      title\n      content\n      url\n      imageUrl\n      duration\n      pubDate\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n    }\n  }\n": types.GetEpisodeInModalTranscriptDocument,
    "\n  query GetEpisodeInModalPlayer($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      transcriptUrl\n    }\n  }\n": types.GetEpisodeInModalPlayerDocument,
    "\n  query GetEpisodeTranslatedScripts($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n    }\n  }\n": types.GetEpisodeTranslatedScriptsDocument,
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
export function gql(source: "\n  query GetChannel($channelId: String!) {\n    channel(channelId: $channelId) {\n      id\n      title\n      description\n      imageUrl\n      author\n      episodes {\n        edges {\n          node {\n            id\n            episodeId\n            title\n            content\n            url\n            imageUrl\n            duration\n            pubDate\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetChannel($channelId: String!) {\n    channel(channelId: $channelId) {\n      id\n      title\n      description\n      imageUrl\n      author\n      episodes {\n        edges {\n          node {\n            id\n            episodeId\n            title\n            content\n            url\n            imageUrl\n            duration\n            pubDate\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEpisode($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      episodeId\n      title\n      content\n      url\n      imageUrl\n      duration\n      pubDate\n    }\n  }\n"): (typeof documents)["\n  query GetEpisode($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      episodeId\n      title\n      content\n      url\n      imageUrl\n      duration\n      pubDate\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetChannelInEpisode($channelId: String!) {\n    channel(channelId: $channelId) {\n      id\n      title\n      imageUrl\n      author\n    }\n  }\n"): (typeof documents)["\n  query GetChannelInEpisode($channelId: String!) {\n    channel(channelId: $channelId) {\n      id\n      title\n      imageUrl\n      author\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetChannels($cursor: String) {\n    channels(after: $cursor) {\n      edges {\n        node {\n          id\n          channelId\n          title\n          description\n          imageUrl\n          author\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetChannels($cursor: String) {\n    channels(after: $cursor) {\n      edges {\n        node {\n          id\n          channelId\n          title\n          description\n          imageUrl\n          author\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEpisodeInModalTranscript($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      title\n      content\n      url\n      imageUrl\n      duration\n      pubDate\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEpisodeInModalTranscript($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      title\n      content\n      url\n      imageUrl\n      duration\n      pubDate\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEpisodeInModalPlayer($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      transcriptUrl\n    }\n  }\n"): (typeof documents)["\n  query GetEpisodeInModalPlayer($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      transcriptUrl\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEpisodeTranslatedScripts($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEpisodeTranslatedScripts($channelId: String!, $episodeId: String!) {\n    episode(channelId: $channelId, episodeId: $episodeId) {\n      id\n      transcriptUrl\n      translatedTranscripts {\n        language\n        transcriptUrl\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;