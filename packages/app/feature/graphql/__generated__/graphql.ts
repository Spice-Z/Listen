/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  _FieldSet: { input: any; output: any; }
};

export type AllEpisodeFilter = {
  availableType?: InputMaybe<EpisodeAvailableType>;
};

export type Channel = {
  __typename?: 'Channel';
  author: Scalars['String']['output'];
  categories: Array<Scalars['String']['output']>;
  channelId: Scalars['String']['output'];
  copyRight: Scalars['String']['output'];
  description: Scalars['String']['output'];
  episodes: EpisodeConnection;
  hasChangeableAd: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  language: Scalars['String']['output'];
  title: Scalars['String']['output'];
};


export type ChannelEpisodesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type ChannelConnection = {
  __typename?: 'ChannelConnection';
  edges: Array<ChannelEdge>;
  pageInfo: PageInfo;
};

export type ChannelEdge = {
  __typename?: 'ChannelEdge';
  cursor: Scalars['String']['output'];
  node: Channel;
};

export type Episode = Node & {
  __typename?: 'Episode';
  canDictation: Scalars['Boolean']['output'];
  channel: Channel;
  content: Scalars['String']['output'];
  description: Scalars['String']['output'];
  duration: Scalars['Int']['output'];
  episodeId: Scalars['String']['output'];
  hasChangeableAd: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  pubDate: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  transcriptUrl?: Maybe<Scalars['String']['output']>;
  translatedTranscripts: Array<TranslatedTranscript>;
  url: Scalars['String']['output'];
};

export enum EpisodeAvailableType {
  Perfect = 'PERFECT',
  Transcript = 'TRANSCRIPT'
}

export type EpisodeConnection = {
  __typename?: 'EpisodeConnection';
  edges: Array<EpisodeEdge>;
  pageInfo: PageInfo;
};

export type EpisodeEdge = {
  __typename?: 'EpisodeEdge';
  cursor: Scalars['String']['output'];
  node: Episode;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  allEpisodes: EpisodeConnection;
  channel: Channel;
  channels: ChannelConnection;
  episode: Episode;
  node?: Maybe<Node>;
};


export type QueryAllEpisodesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<AllEpisodeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryChannelArgs = {
  channelId: Scalars['String']['input'];
};


export type QueryChannelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEpisodeArgs = {
  channelId: Scalars['String']['input'];
  episodeId: Scalars['String']['input'];
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};

export type TranslatedTranscript = {
  __typename?: 'TranslatedTranscript';
  language: Scalars['String']['output'];
  transcriptUrl: Scalars['String']['output'];
};

export type GetChannelQueryVariables = Exact<{
  channelId: Scalars['String']['input'];
}>;


export type GetChannelQuery = { __typename?: 'Query', channel: { __typename?: 'Channel', id: string, title: string, description: string, imageUrl: string, author: string, episodes: { __typename?: 'EpisodeConnection', edges: Array<{ __typename?: 'EpisodeEdge', node: { __typename?: 'Episode', id: string, episodeId: string, title: string, content: string, url: string, imageUrl: string, duration: number, pubDate: number, hasChangeableAd: boolean, transcriptUrl?: string | null, canDictation: boolean, translatedTranscripts: Array<{ __typename?: 'TranslatedTranscript', language: string, transcriptUrl: string }> } }> } } };

export type GetChannelsQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetChannelsQuery = { __typename?: 'Query', channels: { __typename?: 'ChannelConnection', edges: Array<{ __typename?: 'ChannelEdge', node: { __typename?: 'Channel', id: string, channelId: string, title: string, description: string, imageUrl: string, author: string } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type GetEpisodeQueryVariables = Exact<{
  channelId: Scalars['String']['input'];
  episodeId: Scalars['String']['input'];
}>;


export type GetEpisodeQuery = { __typename?: 'Query', episode: { __typename?: 'Episode', id: string, episodeId: string, title: string, content: string, url: string, imageUrl: string, duration: number, pubDate: number, hasChangeableAd: boolean, transcriptUrl?: string | null, canDictation: boolean, translatedTranscripts: Array<{ __typename?: 'TranslatedTranscript', language: string, transcriptUrl: string }>, channel: { __typename?: 'Channel', id: string, channelId: string, title: string, imageUrl: string, author: string } } };

export type GetAllEpisodesQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<EpisodeAvailableType>;
}>;


export type GetAllEpisodesQuery = { __typename?: 'Query', allEpisodes: { __typename?: 'EpisodeConnection', edges: Array<{ __typename?: 'EpisodeEdge', node: { __typename?: 'Episode', id: string, episodeId: string, title: string, url: string, imageUrl: string, duration: number, pubDate: number, transcriptUrl?: string | null, canDictation: boolean, translatedTranscripts: Array<{ __typename?: 'TranslatedTranscript', language: string, transcriptUrl: string }>, channel: { __typename?: 'Channel', id: string, channelId: string, title: string, hasChangeableAd: boolean, imageUrl: string } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type GetEpisodeTranslatedScriptsQueryVariables = Exact<{
  channelId: Scalars['String']['input'];
  episodeId: Scalars['String']['input'];
}>;


export type GetEpisodeTranslatedScriptsQuery = { __typename?: 'Query', episode: { __typename?: 'Episode', id: string, transcriptUrl?: string | null, hasChangeableAd: boolean, translatedTranscripts: Array<{ __typename?: 'TranslatedTranscript', language: string, transcriptUrl: string }> } };

export type GetEpisodeInCurrentEpisodeDataQueryVariables = Exact<{
  channelId: Scalars['String']['input'];
  episodeId: Scalars['String']['input'];
}>;


export type GetEpisodeInCurrentEpisodeDataQuery = { __typename?: 'Query', episode: { __typename?: 'Episode', id: string, transcriptUrl?: string | null, hasChangeableAd: boolean, canDictation: boolean, translatedTranscripts: Array<{ __typename?: 'TranslatedTranscript', language: string, transcriptUrl: string }> } };


export const GetChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"episodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"episodeId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"hasChangeableAd"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}},{"kind":"Field","name":{"kind":"Name","value":"translatedTranscripts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canDictation"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetChannelQuery, GetChannelQueryVariables>;
export const GetChannelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChannels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"author"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetChannelsQuery, GetChannelsQueryVariables>;
export const GetEpisodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEpisode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"episode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"episodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"episodeId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"hasChangeableAd"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}},{"kind":"Field","name":{"kind":"Name","value":"translatedTranscripts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canDictation"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"author"}}]}}]}}]}}]} as unknown as DocumentNode<GetEpisodeQuery, GetEpisodeQueryVariables>;
export const GetAllEpisodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllEpisodes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EpisodeAvailableType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allEpisodes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"availableType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"episodeId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}},{"kind":"Field","name":{"kind":"Name","value":"translatedTranscripts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasChangeableAd"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canDictation"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllEpisodesQuery, GetAllEpisodesQueryVariables>;
export const GetEpisodeTranslatedScriptsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEpisodeTranslatedScripts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"episode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"episodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}},{"kind":"Field","name":{"kind":"Name","value":"translatedTranscripts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasChangeableAd"}}]}}]}}]} as unknown as DocumentNode<GetEpisodeTranslatedScriptsQuery, GetEpisodeTranslatedScriptsQueryVariables>;
export const GetEpisodeInCurrentEpisodeDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEpisodeInCurrentEpisodeData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"episode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"episodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}},{"kind":"Field","name":{"kind":"Name","value":"translatedTranscripts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasChangeableAd"}},{"kind":"Field","name":{"kind":"Name","value":"canDictation"}}]}}]}}]} as unknown as DocumentNode<GetEpisodeInCurrentEpisodeDataQuery, GetEpisodeInCurrentEpisodeDataQueryVariables>;