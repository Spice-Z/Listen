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



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<PartialDeep<Scalars['Boolean']['output'],{recurseIntoArrays: true}>>;
  Channel: ResolverTypeWrapper<PartialDeep<Channel,{recurseIntoArrays: true}>>;
  Episode: ResolverTypeWrapper<PartialDeep<Episode,{recurseIntoArrays: true}>>;
  ID: ResolverTypeWrapper<PartialDeep<Scalars['ID']['output'],{recurseIntoArrays: true}>>;
  Int: ResolverTypeWrapper<PartialDeep<Scalars['Int']['output'],{recurseIntoArrays: true}>>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<PartialDeep<Scalars['String']['output'],{recurseIntoArrays: true}>>;
  TranslatedTranscript: ResolverTypeWrapper<PartialDeep<TranslatedTranscript,{recurseIntoArrays: true}>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: PartialDeep<Scalars['Boolean']['output'],{recurseIntoArrays: true}>;
  Channel: PartialDeep<Channel,{recurseIntoArrays: true}>;
  Episode: PartialDeep<Episode,{recurseIntoArrays: true}>;
  ID: PartialDeep<Scalars['ID']['output'],{recurseIntoArrays: true}>;
  Int: PartialDeep<Scalars['Int']['output'],{recurseIntoArrays: true}>;
  Query: {};
  String: PartialDeep<Scalars['String']['output'],{recurseIntoArrays: true}>;
  TranslatedTranscript: PartialDeep<TranslatedTranscript,{recurseIntoArrays: true}>;
}>;

export type ChannelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Channel'] = ResolversParentTypes['Channel']> = ResolversObject<{
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  categoriesWithSubs?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  channelId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  copyRight?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EpisodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Episode'] = ResolversParentTypes['Episode']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  episodeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pubDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transcriptUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  translatedTranscripts?: Resolver<Array<ResolversTypes['TranslatedTranscript']>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  channel?: Resolver<ResolversTypes['Channel'], ParentType, ContextType, RequireFields<QueryChannelArgs, 'channelId'>>;
  episode?: Resolver<ResolversTypes['Episode'], ParentType, ContextType, RequireFields<QueryEpisodeArgs, 'channelId' | 'episodeId'>>;
}>;

export type TranslatedTranscriptResolvers<ContextType = any, ParentType extends ResolversParentTypes['TranslatedTranscript'] = ResolversParentTypes['TranslatedTranscript']> = ResolversObject<{
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transcriptUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Channel?: ChannelResolvers<ContextType>;
  Episode?: EpisodeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  TranslatedTranscript?: TranslatedTranscriptResolvers<ContextType>;
}>;

