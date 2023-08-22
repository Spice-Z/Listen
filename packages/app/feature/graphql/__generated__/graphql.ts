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

export type Channel = {
  __typename?: 'Channel';
  author: Scalars['String']['output'];
  categories: Array<Scalars['String']['output']>;
  categoriesWithSubs: Array<Scalars['String']['output']>;
  channelId: Scalars['String']['output'];
  copyRight: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  language: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Episode = {
  __typename?: 'Episode';
  content: Scalars['String']['output'];
  description: Scalars['String']['output'];
  duration: Scalars['Int']['output'];
  episodeId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  pubDate: Scalars['String']['output'];
  title: Scalars['String']['output'];
  transcriptUrl?: Maybe<Scalars['String']['output']>;
  translatedTranscripts: Array<TranslatedTranscript>;
  url: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  channel: Channel;
  episode: Episode;
};


export type QueryChannelArgs = {
  channelId: Scalars['String']['input'];
};


export type QueryEpisodeArgs = {
  channelId: Scalars['String']['input'];
  episodeId: Scalars['String']['input'];
};

export type TranslatedTranscript = {
  __typename?: 'TranslatedTranscript';
  language: Scalars['String']['output'];
  transcriptUrl: Scalars['String']['output'];
};

export type GetChannelQueryVariables = Exact<{
  channelId: Scalars['String']['input'];
}>;


export type GetChannelQuery = { __typename?: 'Query', channel: { __typename?: 'Channel', id: string, title: string, description: string, imageUrl: string, author: string } };

export type GetEpisodeQueryVariables = Exact<{
  channelId: Scalars['String']['input'];
  episodeId: Scalars['String']['input'];
}>;


export type GetEpisodeQuery = { __typename?: 'Query', episode: { __typename?: 'Episode', id: string, title: string, content: string, url: string, imageUrl: string, duration: number, pubDate: string } };

export type GetChannelInEpisodeQueryVariables = Exact<{
  channelId: Scalars['String']['input'];
}>;


export type GetChannelInEpisodeQuery = { __typename?: 'Query', channel: { __typename?: 'Channel', id: string, title: string, imageUrl: string, author: string } };

export type GetEpisodeInModalTranscriptQueryVariables = Exact<{
  channelId: Scalars['String']['input'];
  episodeId: Scalars['String']['input'];
}>;


export type GetEpisodeInModalTranscriptQuery = { __typename?: 'Query', episode: { __typename?: 'Episode', id: string, title: string, content: string, url: string, imageUrl: string, duration: number, pubDate: string, translatedTranscripts: Array<{ __typename?: 'TranslatedTranscript', language: string, transcriptUrl: string }> } };

export type GetEpisodeInModalPlayerQueryVariables = Exact<{
  channelId: Scalars['String']['input'];
  episodeId: Scalars['String']['input'];
}>;


export type GetEpisodeInModalPlayerQuery = { __typename?: 'Query', episode: { __typename?: 'Episode', transcriptUrl?: string | null } };

export type GetEpisodeTranslatedScriptsQueryVariables = Exact<{
  channelId: Scalars['String']['input'];
  episodeId: Scalars['String']['input'];
}>;


export type GetEpisodeTranslatedScriptsQuery = { __typename?: 'Query', episode: { __typename?: 'Episode', id: string, transcriptUrl?: string | null, translatedTranscripts: Array<{ __typename?: 'TranslatedTranscript', language: string, transcriptUrl: string }> } };


export const GetChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"author"}}]}}]}}]} as unknown as DocumentNode<GetChannelQuery, GetChannelQueryVariables>;
export const GetEpisodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEpisode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"episode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"episodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}}]}}]}}]} as unknown as DocumentNode<GetEpisodeQuery, GetEpisodeQueryVariables>;
export const GetChannelInEpisodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChannelInEpisode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"author"}}]}}]}}]} as unknown as DocumentNode<GetChannelInEpisodeQuery, GetChannelInEpisodeQueryVariables>;
export const GetEpisodeInModalTranscriptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEpisodeInModalTranscript"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"episode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"episodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"pubDate"}},{"kind":"Field","name":{"kind":"Name","value":"translatedTranscripts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetEpisodeInModalTranscriptQuery, GetEpisodeInModalTranscriptQueryVariables>;
export const GetEpisodeInModalPlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEpisodeInModalPlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"episode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"episodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}}]}}]}}]} as unknown as DocumentNode<GetEpisodeInModalPlayerQuery, GetEpisodeInModalPlayerQueryVariables>;
export const GetEpisodeTranslatedScriptsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEpisodeTranslatedScripts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"episode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"episodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"episodeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}},{"kind":"Field","name":{"kind":"Name","value":"translatedTranscripts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetEpisodeTranslatedScriptsQuery, GetEpisodeTranslatedScriptsQueryVariables>;