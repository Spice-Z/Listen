/* eslint-disable */
import { PartialDeep } from 'type-fest'
import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Node: ( PartialDeep<Episode,{recurseIntoArrays: true}> );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AllEpisodeFilter: ResolverTypeWrapper<PartialDeep<AllEpisodeFilter,{recurseIntoArrays: true}>>;
  Boolean: ResolverTypeWrapper<PartialDeep<Scalars['Boolean']['output'],{recurseIntoArrays: true}>>;
  Channel: ResolverTypeWrapper<PartialDeep<Channel,{recurseIntoArrays: true}>>;
  ChannelConnection: ResolverTypeWrapper<PartialDeep<ChannelConnection,{recurseIntoArrays: true}>>;
  ChannelEdge: ResolverTypeWrapper<PartialDeep<ChannelEdge,{recurseIntoArrays: true}>>;
  Episode: ResolverTypeWrapper<PartialDeep<Episode,{recurseIntoArrays: true}>>;
  EpisodeAvailableType: ResolverTypeWrapper<PartialDeep<EpisodeAvailableType,{recurseIntoArrays: true}>>;
  EpisodeConnection: ResolverTypeWrapper<PartialDeep<EpisodeConnection,{recurseIntoArrays: true}>>;
  EpisodeEdge: ResolverTypeWrapper<PartialDeep<EpisodeEdge,{recurseIntoArrays: true}>>;
  Float: ResolverTypeWrapper<PartialDeep<Scalars['Float']['output'],{recurseIntoArrays: true}>>;
  ID: ResolverTypeWrapper<PartialDeep<Scalars['ID']['output'],{recurseIntoArrays: true}>>;
  Int: ResolverTypeWrapper<PartialDeep<Scalars['Int']['output'],{recurseIntoArrays: true}>>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  PageInfo: ResolverTypeWrapper<PartialDeep<PageInfo,{recurseIntoArrays: true}>>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<PartialDeep<Scalars['String']['output'],{recurseIntoArrays: true}>>;
  TranslatedTranscript: ResolverTypeWrapper<PartialDeep<TranslatedTranscript,{recurseIntoArrays: true}>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AllEpisodeFilter: PartialDeep<AllEpisodeFilter,{recurseIntoArrays: true}>;
  Boolean: PartialDeep<Scalars['Boolean']['output'],{recurseIntoArrays: true}>;
  Channel: PartialDeep<Channel,{recurseIntoArrays: true}>;
  ChannelConnection: PartialDeep<ChannelConnection,{recurseIntoArrays: true}>;
  ChannelEdge: PartialDeep<ChannelEdge,{recurseIntoArrays: true}>;
  Episode: PartialDeep<Episode,{recurseIntoArrays: true}>;
  EpisodeConnection: PartialDeep<EpisodeConnection,{recurseIntoArrays: true}>;
  EpisodeEdge: PartialDeep<EpisodeEdge,{recurseIntoArrays: true}>;
  Float: PartialDeep<Scalars['Float']['output'],{recurseIntoArrays: true}>;
  ID: PartialDeep<Scalars['ID']['output'],{recurseIntoArrays: true}>;
  Int: PartialDeep<Scalars['Int']['output'],{recurseIntoArrays: true}>;
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  PageInfo: PartialDeep<PageInfo,{recurseIntoArrays: true}>;
  Query: {};
  String: PartialDeep<Scalars['String']['output'],{recurseIntoArrays: true}>;
  TranslatedTranscript: PartialDeep<TranslatedTranscript,{recurseIntoArrays: true}>;
}>;

export type ChannelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Channel'] = ResolversParentTypes['Channel']> = ResolversObject<{
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  channelId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  copyRight?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  episodes?: Resolver<ResolversTypes['EpisodeConnection'], ParentType, ContextType, RequireFields<ChannelEpisodesArgs, 'first'>>;
  hasChangeableAd?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChannelConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChannelConnection'] = ResolversParentTypes['ChannelConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['ChannelEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChannelEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChannelEdge'] = ResolversParentTypes['ChannelEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Channel'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EpisodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Episode'] = ResolversParentTypes['Episode']> = ResolversObject<{
  canDictation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  channel?: Resolver<ResolversTypes['Channel'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  episodeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasChangeableAd?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pubDate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transcriptUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  translatedTranscripts?: Resolver<Array<ResolversTypes['TranslatedTranscript']>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EpisodeConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['EpisodeConnection'] = ResolversParentTypes['EpisodeConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['EpisodeEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EpisodeEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['EpisodeEdge'] = ResolversParentTypes['EpisodeEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Episode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Episode', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  allEpisodes?: Resolver<ResolversTypes['EpisodeConnection'], ParentType, ContextType, RequireFields<QueryAllEpisodesArgs, 'first'>>;
  channel?: Resolver<ResolversTypes['Channel'], ParentType, ContextType, RequireFields<QueryChannelArgs, 'channelId'>>;
  channels?: Resolver<ResolversTypes['ChannelConnection'], ParentType, ContextType, RequireFields<QueryChannelsArgs, 'first'>>;
  episode?: Resolver<ResolversTypes['Episode'], ParentType, ContextType, RequireFields<QueryEpisodeArgs, 'channelId' | 'episodeId'>>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
}>;

export type TranslatedTranscriptResolvers<ContextType = any, ParentType extends ResolversParentTypes['TranslatedTranscript'] = ResolversParentTypes['TranslatedTranscript']> = ResolversObject<{
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transcriptUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Channel?: ChannelResolvers<ContextType>;
  ChannelConnection?: ChannelConnectionResolvers<ContextType>;
  ChannelEdge?: ChannelEdgeResolvers<ContextType>;
  Episode?: EpisodeResolvers<ContextType>;
  EpisodeConnection?: EpisodeConnectionResolvers<ContextType>;
  EpisodeEdge?: EpisodeEdgeResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  TranslatedTranscript?: TranslatedTranscriptResolvers<ContextType>;
}>;

