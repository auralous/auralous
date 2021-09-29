import { Resolver as GraphCacheResolver, UpdateResolver as GraphCacheUpdateResolver, OptimisticMutationResolver as GraphCacheOptimisticMutationResolver, StorageAdapter as GraphCacheStorageAdapter } from '@urql/exchange-graphcache';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';
import { DocumentNode } from 'graphql';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Artist = {
  __typename: 'Artist';
  id: Scalars['ID'];
  platform: PlatformName;
  externalId: Scalars['ID'];
  name: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type CrossTracks = {
  __typename: 'CrossTracks';
  id: Scalars['ID'];
  youtube?: Maybe<Scalars['ID']>;
  spotify?: Maybe<Scalars['ID']>;
};


export type LocationInput = {
  lng: Scalars['Float'];
  lat: Scalars['Float'];
};

export type Me = {
  __typename: 'Me';
  user: User;
  oauthId: Scalars['String'];
  platform: PlatformName;
  accessToken?: Maybe<Scalars['String']>;
};

export type Message = {
  __typename: 'Message';
  id: Scalars['ID'];
  creatorId: Scalars['String'];
  creator: User;
  createdAt: Scalars['DateTime'];
  text?: Maybe<Scalars['String']>;
  type: MessageType;
};

export enum MessageType {
  Message = 'message',
  Join = 'join'
}

export type Mutation = {
  __typename: 'Mutation';
  me?: Maybe<User>;
  meDelete: Scalars['Boolean'];
  messageAdd: Scalars['Boolean'];
  notificationsMarkRead: Scalars['Int'];
  nowPlayingPlayUid?: Maybe<Scalars['Boolean']>;
  nowPlayingReact?: Maybe<Scalars['Boolean']>;
  nowPlayingSkip?: Maybe<Scalars['Boolean']>;
  playlistAddTracks: Scalars['Boolean'];
  playlistCreate: Playlist;
  queueAdd: Scalars['Boolean'];
  queueRemove: Scalars['Boolean'];
  queueReorder: Scalars['Boolean'];
  queueToTop: Scalars['Boolean'];
  sessionCollabAddFromToken: Scalars['Boolean'];
  sessionCreate: Session;
  sessionDelete: Scalars['ID'];
  sessionEnd: Session;
  sessionPing: Scalars['Boolean'];
  sessionUpdate: Session;
  userFollow: Scalars['Boolean'];
  userUnfollow: Scalars['Boolean'];
};


export type MutationMeArgs = {
  username?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
};


export type MutationMessageAddArgs = {
  id: Scalars['ID'];
  text: Scalars['String'];
};


export type MutationNotificationsMarkReadArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationNowPlayingPlayUidArgs = {
  id: Scalars['ID'];
  uid: Scalars['String'];
};


export type MutationNowPlayingReactArgs = {
  id: Scalars['ID'];
  reaction: NowPlayingReactionType;
};


export type MutationNowPlayingSkipArgs = {
  id: Scalars['ID'];
  isBackward: Scalars['Boolean'];
};


export type MutationPlaylistAddTracksArgs = {
  id: Scalars['ID'];
  trackIds: Array<Scalars['String']>;
};


export type MutationPlaylistCreateArgs = {
  name: Scalars['String'];
  trackIds: Array<Scalars['String']>;
};


export type MutationQueueAddArgs = {
  id: Scalars['ID'];
  tracks: Array<Scalars['ID']>;
};


export type MutationQueueRemoveArgs = {
  id: Scalars['ID'];
  uids: Array<Scalars['ID']>;
};


export type MutationQueueReorderArgs = {
  id: Scalars['ID'];
  position: Scalars['Int'];
  insertPosition: Scalars['Int'];
};


export type MutationQueueToTopArgs = {
  id: Scalars['ID'];
  uids: Array<Scalars['ID']>;
};


export type MutationSessionCollabAddFromTokenArgs = {
  id: Scalars['ID'];
  token: Scalars['String'];
};


export type MutationSessionCreateArgs = {
  text: Scalars['String'];
  location?: Maybe<LocationInput>;
  tracks: Array<Scalars['ID']>;
};


export type MutationSessionDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationSessionEndArgs = {
  id: Scalars['ID'];
};


export type MutationSessionPingArgs = {
  id: Scalars['ID'];
};


export type MutationSessionUpdateArgs = {
  id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
  location?: Maybe<LocationInput>;
};


export type MutationUserFollowArgs = {
  id: Scalars['ID'];
};


export type MutationUserUnfollowArgs = {
  id: Scalars['ID'];
};

export type Notification = {
  id: Scalars['ID'];
  hasRead: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
};

export type NotificationFollow = Notification & {
  __typename: 'NotificationFollow';
  id: Scalars['ID'];
  hasRead: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  follower?: Maybe<User>;
};

export type NotificationNewSession = Notification & {
  __typename: 'NotificationNewSession';
  id: Scalars['ID'];
  hasRead: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  session?: Maybe<Session>;
};

export type NowPlaying = {
  __typename: 'NowPlaying';
  id: Scalars['ID'];
  current: NowPlayingQueueItem;
  next: Array<QueueItem>;
};

export type NowPlayingQueueItem = {
  __typename: 'NowPlayingQueueItem';
  uid: Scalars['ID'];
  trackId: Scalars['String'];
  creatorId: Scalars['String'];
  index: Scalars['Int'];
  playedAt: Scalars['DateTime'];
  endedAt: Scalars['DateTime'];
};

export type NowPlayingReactionItem = {
  __typename: 'NowPlayingReactionItem';
  userId: Scalars['String'];
  reaction: NowPlayingReactionType;
};

export enum NowPlayingReactionType {
  Heart = 'heart',
  Joy = 'joy',
  Fire = 'fire',
  Cry = 'cry'
}

export enum PlatformName {
  Youtube = 'youtube',
  Spotify = 'spotify'
}

export type Playlist = {
  __typename: 'Playlist';
  id: Scalars['ID'];
  platform: PlatformName;
  externalId: Scalars['ID'];
  name: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  url: Scalars['String'];
  total: Scalars['Int'];
  creatorName: Scalars['String'];
  creatorImage?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename: 'Query';
  crossTracks?: Maybe<CrossTracks>;
  me?: Maybe<Me>;
  messages?: Maybe<Array<Message>>;
  myPlaylists?: Maybe<Array<Playlist>>;
  notifications: Array<Notification>;
  nowPlaying?: Maybe<NowPlaying>;
  nowPlayingReactions: Array<NowPlayingReactionItem>;
  playlist?: Maybe<Playlist>;
  playlistTracks: Array<Track>;
  playlistsFeatured: Array<Playlist>;
  playlistsFriends: Array<Playlist>;
  playlistsSearch: Array<Playlist>;
  searchTrack: Array<Track>;
  session?: Maybe<Session>;
  sessionCurrentLive?: Maybe<SessionCurrentLive>;
  sessionInviteLink: Scalars['String'];
  sessionListeners?: Maybe<Array<Scalars['String']>>;
  sessionTracks: Array<Track>;
  sessions: Array<Session>;
  sessionsOnMap: Array<Session>;
  track?: Maybe<Track>;
  tracks: Array<Maybe<Track>>;
  user?: Maybe<User>;
  userFollowers: Array<Scalars['String']>;
  userFollowings: Array<Scalars['String']>;
  userStat?: Maybe<UserStat>;
};


export type QueryCrossTracksArgs = {
  id: Scalars['ID'];
};


export type QueryMessagesArgs = {
  id: Scalars['ID'];
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryNotificationsArgs = {
  next?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryNowPlayingArgs = {
  id: Scalars['ID'];
};


export type QueryNowPlayingReactionsArgs = {
  id: Scalars['ID'];
};


export type QueryPlaylistArgs = {
  id: Scalars['ID'];
};


export type QueryPlaylistTracksArgs = {
  id: Scalars['ID'];
};


export type QueryPlaylistsFeaturedArgs = {
  limit?: Maybe<Scalars['Int']>;
};


export type QueryPlaylistsSearchArgs = {
  query: Scalars['String'];
};


export type QuerySearchTrackArgs = {
  query: Scalars['String'];
};


export type QuerySessionArgs = {
  id: Scalars['ID'];
};


export type QuerySessionCurrentLiveArgs = {
  creatorId?: Maybe<Scalars['ID']>;
  mine?: Maybe<Scalars['Boolean']>;
};


export type QuerySessionInviteLinkArgs = {
  id: Scalars['ID'];
};


export type QuerySessionListenersArgs = {
  id: Scalars['ID'];
};


export type QuerySessionTracksArgs = {
  id: Scalars['ID'];
  from?: Maybe<Scalars['Int']>;
  to?: Maybe<Scalars['Int']>;
};


export type QuerySessionsArgs = {
  creatorId?: Maybe<Scalars['String']>;
  next?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QuerySessionsOnMapArgs = {
  lng: Scalars['Float'];
  lat: Scalars['Float'];
  radius: Scalars['Float'];
};


export type QueryTrackArgs = {
  id: Scalars['ID'];
};


export type QueryTracksArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryUserArgs = {
  username?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
};


export type QueryUserFollowersArgs = {
  id: Scalars['ID'];
};


export type QueryUserFollowingsArgs = {
  id: Scalars['ID'];
};


export type QueryUserStatArgs = {
  id: Scalars['ID'];
};

export type QueueItem = {
  __typename: 'QueueItem';
  uid: Scalars['ID'];
  trackId: Scalars['String'];
  creatorId: Scalars['String'];
};

export type Session = {
  __typename: 'Session';
  id: Scalars['ID'];
  text: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  creatorId: Scalars['ID'];
  creator: User;
  createdAt: Scalars['DateTime'];
  isLive: Scalars['Boolean'];
  collaboratorIds: Array<Scalars['String']>;
  onMap?: Maybe<Scalars['Boolean']>;
  trackTotal: Scalars['Int'];
};

export type SessionCurrentLive = {
  __typename: 'SessionCurrentLive';
  creatorId: Scalars['ID'];
  sessionId: Scalars['ID'];
};

export type Subscription = {
  __typename: 'Subscription';
  messageAdded: Message;
  notificationAdded: Notification;
  nowPlayingReactionsUpdated: Array<NowPlayingReactionItem>;
  nowPlayingUpdated?: Maybe<NowPlaying>;
  sessionListenersUpdated: Array<Scalars['String']>;
  sessionUpdated: Session;
};


export type SubscriptionMessageAddedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionNowPlayingReactionsUpdatedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionNowPlayingUpdatedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionSessionListenersUpdatedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionSessionUpdatedArgs = {
  id: Scalars['ID'];
};

export type Track = {
  __typename: 'Track';
  id: Scalars['ID'];
  platform: PlatformName;
  externalId: Scalars['ID'];
  artists: Array<Artist>;
  duration: Scalars['Int'];
  title: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type User = {
  __typename: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  profilePicture?: Maybe<Scalars['String']>;
};

export type UserStat = {
  __typename: 'UserStat';
  id: Scalars['ID'];
  followerCount: Scalars['Int'];
  followingCount: Scalars['Int'];
};

export type MessagePartsFragment = { __typename: 'Message', id: string, creatorId: string, createdAt: any, text?: Maybe<string>, type: MessageType, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } };

export type MessagesQueryVariables = Exact<{
  id: Scalars['ID'];
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type MessagesQuery = { messages?: Maybe<Array<{ __typename: 'Message', id: string, creatorId: string, createdAt: any, text?: Maybe<string>, type: MessageType, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } }>> };

export type MessageAddMutationVariables = Exact<{
  id: Scalars['ID'];
  text: Scalars['String'];
}>;


export type MessageAddMutation = { messageAdd: boolean };

export type MessageAddedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type MessageAddedSubscription = { messageAdded: { __typename: 'Message', id: string, creatorId: string, createdAt: any, text?: Maybe<string>, type: MessageType, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } } };

export type NotificationsQueryVariables = Exact<{
  next?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
}>;


export type NotificationsQuery = { notifications: Array<{ __typename: 'NotificationFollow', id: string, createdAt: any, hasRead: boolean, follower?: Maybe<{ __typename: 'User', id: string, username: string, bio?: Maybe<string>, profilePicture?: Maybe<string> }> } | { __typename: 'NotificationNewSession', id: string, createdAt: any, hasRead: boolean, session?: Maybe<{ __typename: 'Session', id: string, text: string, image?: Maybe<string>, createdAt: any, isLive: boolean, creatorId: string, collaboratorIds: Array<string>, onMap?: Maybe<boolean>, trackTotal: number, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } }> }> };

export type NotificationsMarkReadMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type NotificationsMarkReadMutation = { notificationsMarkRead: number };

export type NotificationAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NotificationAddedSubscription = { notificationAdded: { __typename: 'NotificationFollow', id: string, createdAt: any, hasRead: boolean, follower?: Maybe<{ __typename: 'User', id: string, username: string, bio?: Maybe<string>, profilePicture?: Maybe<string> }> } | { __typename: 'NotificationNewSession', id: string, createdAt: any, hasRead: boolean, session?: Maybe<{ __typename: 'Session', id: string, text: string, image?: Maybe<string>, createdAt: any, isLive: boolean, creatorId: string, collaboratorIds: Array<string>, onMap?: Maybe<boolean>, trackTotal: number, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } }> } };

export type NowPlayingQueuePartsFragment = { __typename: 'NowPlayingQueueItem', uid: string, trackId: string, playedAt: any, endedAt: any, creatorId: string, index: number };

export type NowPlayingQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingQuery = { nowPlaying?: Maybe<{ __typename: 'NowPlaying', id: string, current: { __typename: 'NowPlayingQueueItem', uid: string, trackId: string, playedAt: any, endedAt: any, creatorId: string, index: number }, next: Array<{ __typename: 'QueueItem', uid: string, trackId: string, creatorId: string }> }> };

export type NowPlayingSkipMutationVariables = Exact<{
  id: Scalars['ID'];
  isBackward: Scalars['Boolean'];
}>;


export type NowPlayingSkipMutation = { nowPlayingSkip?: Maybe<boolean> };

export type NowPlayingPlayUidMutationVariables = Exact<{
  id: Scalars['ID'];
  uid: Scalars['String'];
}>;


export type NowPlayingPlayUidMutation = { nowPlayingPlayUid?: Maybe<boolean> };

export type OnNowPlayingUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnNowPlayingUpdatedSubscription = { nowPlayingUpdated?: Maybe<{ __typename: 'NowPlaying', id: string, current: { __typename: 'NowPlayingQueueItem', uid: string, trackId: string, playedAt: any, endedAt: any, creatorId: string, index: number }, next: Array<{ __typename: 'QueueItem', uid: string, trackId: string, creatorId: string }> }> };

export type NowPlayingReactionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingReactionsQuery = { nowPlayingReactions: Array<{ __typename: 'NowPlayingReactionItem', reaction: NowPlayingReactionType, userId: string }> };

export type NowPlayingReactionsUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingReactionsUpdatedSubscription = { nowPlayingReactionsUpdated: Array<{ __typename: 'NowPlayingReactionItem', reaction: NowPlayingReactionType, userId: string }> };

export type NowPlayingReactMutationVariables = Exact<{
  id: Scalars['ID'];
  reaction: NowPlayingReactionType;
}>;


export type NowPlayingReactMutation = { nowPlayingReact?: Maybe<boolean> };

export type PlaylistPartsFragment = { __typename: 'Playlist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string, total: number, creatorName: string, creatorImage?: Maybe<string> };

export type PlaylistQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PlaylistQuery = { playlist?: Maybe<{ __typename: 'Playlist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string, total: number, creatorName: string, creatorImage?: Maybe<string> }> };

export type MyPlaylistsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPlaylistsQuery = { myPlaylists?: Maybe<Array<{ __typename: 'Playlist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string, total: number, creatorName: string, creatorImage?: Maybe<string> }>> };

export type PlaylistTracksQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PlaylistTracksQuery = { playlistTracks: Array<{ __typename: 'Track', id: string, platform: PlatformName, externalId: string, title: string, duration: number, image?: Maybe<string>, url: string, artists: Array<{ __typename: 'Artist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string }> }> };

export type PlaylistsFeaturedQueryVariables = Exact<{ [key: string]: never; }>;


export type PlaylistsFeaturedQuery = { playlistsFeatured: Array<{ __typename: 'Playlist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string, total: number, creatorName: string, creatorImage?: Maybe<string> }> };

export type PlaylistsFriendsQueryVariables = Exact<{ [key: string]: never; }>;


export type PlaylistsFriendsQuery = { playlistsFriends: Array<{ __typename: 'Playlist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string, total: number, creatorName: string, creatorImage?: Maybe<string> }> };

export type PlaylistsSearchQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type PlaylistsSearchQuery = { playlistsSearch: Array<{ __typename: 'Playlist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string, total: number, creatorName: string, creatorImage?: Maybe<string> }> };

export type PlaylistAddTracksMutationVariables = Exact<{
  id: Scalars['ID'];
  trackIds: Array<Scalars['String']> | Scalars['String'];
}>;


export type PlaylistAddTracksMutation = { playlistAddTracks: boolean };

export type PlaylistCreateMutationVariables = Exact<{
  name: Scalars['String'];
  trackIds: Array<Scalars['String']> | Scalars['String'];
}>;


export type PlaylistCreateMutation = { playlistCreate: { __typename: 'Playlist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string, total: number, creatorName: string, creatorImage?: Maybe<string> } };

export type QueueItemPartsFragment = { __typename: 'QueueItem', uid: string, trackId: string, creatorId: string };

export type QueueAddMutationVariables = Exact<{
  id: Scalars['ID'];
  tracks: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type QueueAddMutation = { queueAdd: boolean };

export type QueueRemoveMutationVariables = Exact<{
  id: Scalars['ID'];
  uids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type QueueRemoveMutation = { queueRemove: boolean };

export type QueueReorderMutationVariables = Exact<{
  id: Scalars['ID'];
  position: Scalars['Int'];
  insertPosition: Scalars['Int'];
}>;


export type QueueReorderMutation = { queueReorder: boolean };

export type QueueToTopMutationVariables = Exact<{
  id: Scalars['ID'];
  uids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type QueueToTopMutation = { queueToTop: boolean };

export type SessionPartsFragment = { __typename: 'Session', id: string, text: string, image?: Maybe<string>, createdAt: any, isLive: boolean, creatorId: string, collaboratorIds: Array<string>, onMap?: Maybe<boolean>, trackTotal: number, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } };

export type SessionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SessionQuery = { session?: Maybe<{ __typename: 'Session', id: string, text: string, image?: Maybe<string>, createdAt: any, isLive: boolean, creatorId: string, collaboratorIds: Array<string>, onMap?: Maybe<boolean>, trackTotal: number, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } }> };

export type SessionsQueryVariables = Exact<{
  creatorId?: Maybe<Scalars['String']>;
  next?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
}>;


export type SessionsQuery = { sessions: Array<{ __typename: 'Session', id: string, text: string, image?: Maybe<string>, createdAt: any, isLive: boolean, creatorId: string, collaboratorIds: Array<string>, onMap?: Maybe<boolean>, trackTotal: number, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } }> };

export type SessionsOnMapQueryVariables = Exact<{
  lng: Scalars['Float'];
  lat: Scalars['Float'];
  radius: Scalars['Float'];
}>;


export type SessionsOnMapQuery = { sessionsOnMap: Array<{ __typename: 'Session', id: string, text: string, image?: Maybe<string>, createdAt: any, isLive: boolean, creatorId: string, collaboratorIds: Array<string>, onMap?: Maybe<boolean>, trackTotal: number, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } }> };

export type SessionCurrentLiveQueryVariables = Exact<{
  creatorId?: Maybe<Scalars['ID']>;
  mine?: Maybe<Scalars['Boolean']>;
}>;


export type SessionCurrentLiveQuery = { sessionCurrentLive?: Maybe<{ __typename: 'SessionCurrentLive', creatorId: string, sessionId: string }> };

export type SessionTracksQueryVariables = Exact<{
  id: Scalars['ID'];
  from?: Maybe<Scalars['Int']>;
  to?: Maybe<Scalars['Int']>;
}>;


export type SessionTracksQuery = { sessionTracks: Array<{ __typename: 'Track', id: string, platform: PlatformName, externalId: string, title: string, duration: number, image?: Maybe<string>, url: string, artists: Array<{ __typename: 'Artist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string }> }> };

export type SessionCreateMutationVariables = Exact<{
  text: Scalars['String'];
  location?: Maybe<LocationInput>;
  tracks: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type SessionCreateMutation = { sessionCreate: { __typename: 'Session', id: string, text: string, image?: Maybe<string>, createdAt: any, isLive: boolean, creatorId: string, collaboratorIds: Array<string>, onMap?: Maybe<boolean>, trackTotal: number, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } } };

export type SessionUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
  location?: Maybe<LocationInput>;
}>;


export type SessionUpdateMutation = { sessionUpdate: { __typename: 'Session', id: string, text: string, image?: Maybe<string>, createdAt: any, isLive: boolean, creatorId: string, collaboratorIds: Array<string>, onMap?: Maybe<boolean>, trackTotal: number, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } } };

export type SessionDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SessionDeleteMutation = { sessionDelete: string };

export type SessionEndMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SessionEndMutation = { sessionEnd: { __typename: 'Session', id: string, text: string, image?: Maybe<string>, createdAt: any, isLive: boolean, creatorId: string, collaboratorIds: Array<string>, onMap?: Maybe<boolean>, trackTotal: number, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } } };

export type SessionListenersQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SessionListenersQuery = { sessionListeners?: Maybe<Array<string>> };

export type SessionPingMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SessionPingMutation = { sessionPing: boolean };

export type SessionUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SessionUpdatedSubscription = { sessionUpdated: { __typename: 'Session', id: string, text: string, image?: Maybe<string>, createdAt: any, isLive: boolean, creatorId: string, collaboratorIds: Array<string>, onMap?: Maybe<boolean>, trackTotal: number, creator: { __typename: 'User', id: string, username: string, profilePicture?: Maybe<string> } } };

export type SessionListenersUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SessionListenersUpdatedSubscription = { sessionListenersUpdated: Array<string> };

export type SessionInviteLinkQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SessionInviteLinkQuery = { sessionInviteLink: string };

export type SessionCollabAddFromTokenMutationVariables = Exact<{
  id: Scalars['ID'];
  token: Scalars['String'];
}>;


export type SessionCollabAddFromTokenMutation = { sessionCollabAddFromToken: boolean };

export type ArtistPartsFragment = { __typename: 'Artist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string };

export type TrackPartsFragment = { __typename: 'Track', id: string, platform: PlatformName, externalId: string, title: string, duration: number, image?: Maybe<string>, url: string, artists: Array<{ __typename: 'Artist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string }> };

export type TrackQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type TrackQuery = { track?: Maybe<{ __typename: 'Track', id: string, platform: PlatformName, externalId: string, title: string, duration: number, image?: Maybe<string>, url: string, artists: Array<{ __typename: 'Artist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string }> }> };

export type TracksQueryVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type TracksQuery = { tracks: Array<Maybe<{ __typename: 'Track', id: string, platform: PlatformName, externalId: string, title: string, duration: number, image?: Maybe<string>, url: string, artists: Array<{ __typename: 'Artist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string }> }>> };

export type CrossTracksQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CrossTracksQuery = { crossTracks?: Maybe<{ __typename: 'CrossTracks', id: string, youtube?: Maybe<string>, spotify?: Maybe<string> }> };

export type SearchTrackQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchTrackQuery = { searchTrack: Array<{ __typename: 'Track', id: string, platform: PlatformName, externalId: string, title: string, duration: number, image?: Maybe<string>, url: string, artists: Array<{ __typename: 'Artist', id: string, platform: PlatformName, externalId: string, name: string, image?: Maybe<string>, url: string }> }> };

export type UserPublicPartsFragment = { __typename: 'User', id: string, username: string, bio?: Maybe<string>, profilePicture?: Maybe<string> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me?: Maybe<{ __typename: 'Me', oauthId: string, platform: PlatformName, accessToken?: Maybe<string>, user: { __typename: 'User', id: string, username: string, bio?: Maybe<string>, profilePicture?: Maybe<string> } }> };

export type UserQueryVariables = Exact<{
  username?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
}>;


export type UserQuery = { user?: Maybe<{ __typename: 'User', id: string, username: string, bio?: Maybe<string>, profilePicture?: Maybe<string> }> };

export type UserStatQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserStatQuery = { userStat?: Maybe<{ __typename: 'UserStat', id: string, followerCount: number, followingCount: number }> };

export type UserFollowersQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserFollowersQuery = { userFollowers: Array<string> };

export type UserFollowingsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserFollowingsQuery = { userFollowings: Array<string> };

export type UserFollowMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserFollowMutation = { userFollow: boolean };

export type UserUnfollowMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserUnfollowMutation = { userUnfollow: boolean };

export type MeUpdateMutationVariables = Exact<{
  username?: Maybe<Scalars['String']>;
}>;


export type MeUpdateMutation = { me?: Maybe<{ __typename: 'User', id: string, username: string, bio?: Maybe<string>, profilePicture?: Maybe<string> }> };

export type MeDeleteMutationVariables = Exact<{ [key: string]: never; }>;


export type MeDeleteMutation = { meDelete: boolean };

export const MessagePartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode;
export const NowPlayingQueuePartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]} as unknown as DocumentNode;
export const PlaylistPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"creatorImage"}}]}}]} as unknown as DocumentNode;
export const QueueItemPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]} as unknown as DocumentNode;
export const SessionPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Session"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"collaboratorIds"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onMap"}},{"kind":"Field","name":{"kind":"Name","value":"trackTotal"}}]}}]} as unknown as DocumentNode;
export const ArtistPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode;
export const TrackPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode;
export const UserPublicPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]} as unknown as DocumentNode;
export const MessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"messages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode;

export function useMessagesQuery(options: Omit<Urql.UseQueryArgs<MessagesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MessagesQuery>({ query: MessagesDocument, ...options });
};
export const MessageAddDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"messageAdd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageAdd"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}]}]}}]} as unknown as DocumentNode;

export function useMessageAddMutation() {
  return Urql.useMutation<MessageAddMutation, MessageAddMutationVariables>(MessageAddDocument);
};
export const MessageAddedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"messageAdded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageAdded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode;

export function useMessageAddedSubscription<TData = MessageAddedSubscription>(options: Omit<Urql.UseSubscriptionArgs<MessageAddedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<MessageAddedSubscription, TData>) {
  return Urql.useSubscription<MessageAddedSubscription, TData, MessageAddedSubscriptionVariables>({ query: MessageAddedDocument, ...options }, handler);
};
export const NotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"next"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"next"},"value":{"kind":"Variable","name":{"kind":"Name","value":"next"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasRead"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationFollow"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"follower"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNewSession"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionParts"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Session"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"collaboratorIds"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onMap"}},{"kind":"Field","name":{"kind":"Name","value":"trackTotal"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]} as unknown as DocumentNode;

export function useNotificationsQuery(options: Omit<Urql.UseQueryArgs<NotificationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NotificationsQuery>({ query: NotificationsDocument, ...options });
};
export const NotificationsMarkReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"notificationsMarkRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationsMarkRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode;

export function useNotificationsMarkReadMutation() {
  return Urql.useMutation<NotificationsMarkReadMutation, NotificationsMarkReadMutationVariables>(NotificationsMarkReadDocument);
};
export const NotificationAddedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"notificationAdded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationAdded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasRead"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationFollow"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"follower"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNewSession"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionParts"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Session"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"collaboratorIds"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onMap"}},{"kind":"Field","name":{"kind":"Name","value":"trackTotal"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]} as unknown as DocumentNode;

export function useNotificationAddedSubscription<TData = NotificationAddedSubscription>(options: Omit<Urql.UseSubscriptionArgs<NotificationAddedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NotificationAddedSubscription, TData>) {
  return Urql.useSubscription<NotificationAddedSubscription, TData, NotificationAddedSubscriptionVariables>({ query: NotificationAddedDocument, ...options }, handler);
};
export const NowPlayingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nowPlaying"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlaying"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingQueueParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"next"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QueueItemParts"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"index"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]} as unknown as DocumentNode;

export function useNowPlayingQuery(options: Omit<Urql.UseQueryArgs<NowPlayingQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NowPlayingQuery>({ query: NowPlayingDocument, ...options });
};
export const NowPlayingSkipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"nowPlayingSkip"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isBackward"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingSkip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"isBackward"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isBackward"}}}]}]}}]} as unknown as DocumentNode;

export function useNowPlayingSkipMutation() {
  return Urql.useMutation<NowPlayingSkipMutation, NowPlayingSkipMutationVariables>(NowPlayingSkipDocument);
};
export const NowPlayingPlayUidDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"nowPlayingPlayUid"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingPlayUid"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode;

export function useNowPlayingPlayUidMutation() {
  return Urql.useMutation<NowPlayingPlayUidMutation, NowPlayingPlayUidMutationVariables>(NowPlayingPlayUidDocument);
};
export const OnNowPlayingUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onNowPlayingUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingQueueParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"next"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QueueItemParts"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"index"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]} as unknown as DocumentNode;

export function useOnNowPlayingUpdatedSubscription<TData = OnNowPlayingUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnNowPlayingUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnNowPlayingUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnNowPlayingUpdatedSubscription, TData, OnNowPlayingUpdatedSubscriptionVariables>({ query: OnNowPlayingUpdatedDocument, ...options }, handler);
};
export const NowPlayingReactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nowPlayingReactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingReactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reaction"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode;

export function useNowPlayingReactionsQuery(options: Omit<Urql.UseQueryArgs<NowPlayingReactionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NowPlayingReactionsQuery>({ query: NowPlayingReactionsDocument, ...options });
};
export const NowPlayingReactionsUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"nowPlayingReactionsUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingReactionsUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reaction"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode;

export function useNowPlayingReactionsUpdatedSubscription<TData = NowPlayingReactionsUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<NowPlayingReactionsUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NowPlayingReactionsUpdatedSubscription, TData>) {
  return Urql.useSubscription<NowPlayingReactionsUpdatedSubscription, TData, NowPlayingReactionsUpdatedSubscriptionVariables>({ query: NowPlayingReactionsUpdatedDocument, ...options }, handler);
};
export const NowPlayingReactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"nowPlayingReact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingReactionType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingReact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"reaction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}}}]}]}}]} as unknown as DocumentNode;

export function useNowPlayingReactMutation() {
  return Urql.useMutation<NowPlayingReactMutation, NowPlayingReactMutationVariables>(NowPlayingReactDocument);
};
export const PlaylistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"playlist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"creatorImage"}}]}}]} as unknown as DocumentNode;

export function usePlaylistQuery(options: Omit<Urql.UseQueryArgs<PlaylistQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PlaylistQuery>({ query: PlaylistDocument, ...options });
};
export const MyPlaylistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myPlaylists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPlaylists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"creatorImage"}}]}}]} as unknown as DocumentNode;

export function useMyPlaylistsQuery(options: Omit<Urql.UseQueryArgs<MyPlaylistsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyPlaylistsQuery>({ query: MyPlaylistsDocument, ...options });
};
export const PlaylistTracksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"playlistTracks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlistTracks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}}]} as unknown as DocumentNode;

export function usePlaylistTracksQuery(options: Omit<Urql.UseQueryArgs<PlaylistTracksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PlaylistTracksQuery>({ query: PlaylistTracksDocument, ...options });
};
export const PlaylistsFeaturedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"playlistsFeatured"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlistsFeatured"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"creatorImage"}}]}}]} as unknown as DocumentNode;

export function usePlaylistsFeaturedQuery(options: Omit<Urql.UseQueryArgs<PlaylistsFeaturedQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PlaylistsFeaturedQuery>({ query: PlaylistsFeaturedDocument, ...options });
};
export const PlaylistsFriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"playlistsFriends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlistsFriends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"creatorImage"}}]}}]} as unknown as DocumentNode;

export function usePlaylistsFriendsQuery(options: Omit<Urql.UseQueryArgs<PlaylistsFriendsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PlaylistsFriendsQuery>({ query: PlaylistsFriendsDocument, ...options });
};
export const PlaylistsSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"playlistsSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlistsSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"creatorImage"}}]}}]} as unknown as DocumentNode;

export function usePlaylistsSearchQuery(options: Omit<Urql.UseQueryArgs<PlaylistsSearchQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PlaylistsSearchQuery>({ query: PlaylistsSearchDocument, ...options });
};
export const PlaylistAddTracksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"playlistAddTracks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trackIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlistAddTracks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"trackIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trackIds"}}}]}]}}]} as unknown as DocumentNode;

export function usePlaylistAddTracksMutation() {
  return Urql.useMutation<PlaylistAddTracksMutation, PlaylistAddTracksMutationVariables>(PlaylistAddTracksDocument);
};
export const PlaylistCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"playlistCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trackIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlistCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"trackIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trackIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"creatorName"}},{"kind":"Field","name":{"kind":"Name","value":"creatorImage"}}]}}]} as unknown as DocumentNode;

export function usePlaylistCreateMutation() {
  return Urql.useMutation<PlaylistCreateMutation, PlaylistCreateMutationVariables>(PlaylistCreateDocument);
};
export const QueueAddDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"queueAdd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueAdd"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"tracks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}}}]}]}}]} as unknown as DocumentNode;

export function useQueueAddMutation() {
  return Urql.useMutation<QueueAddMutation, QueueAddMutationVariables>(QueueAddDocument);
};
export const QueueRemoveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"queueRemove"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueRemove"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"uids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uids"}}}]}]}}]} as unknown as DocumentNode;

export function useQueueRemoveMutation() {
  return Urql.useMutation<QueueRemoveMutation, QueueRemoveMutationVariables>(QueueRemoveDocument);
};
export const QueueReorderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"queueReorder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"insertPosition"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueReorder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}},{"kind":"Argument","name":{"kind":"Name","value":"insertPosition"},"value":{"kind":"Variable","name":{"kind":"Name","value":"insertPosition"}}}]}]}}]} as unknown as DocumentNode;

export function useQueueReorderMutation() {
  return Urql.useMutation<QueueReorderMutation, QueueReorderMutationVariables>(QueueReorderDocument);
};
export const QueueToTopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"queueToTop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueToTop"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"uids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uids"}}}]}]}}]} as unknown as DocumentNode;

export function useQueueToTopMutation() {
  return Urql.useMutation<QueueToTopMutation, QueueToTopMutationVariables>(QueueToTopDocument);
};
export const SessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"session"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Session"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"collaboratorIds"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onMap"}},{"kind":"Field","name":{"kind":"Name","value":"trackTotal"}}]}}]} as unknown as DocumentNode;

export function useSessionQuery(options: Omit<Urql.UseQueryArgs<SessionQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SessionQuery>({ query: SessionDocument, ...options });
};
export const SessionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"sessions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"next"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"creatorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"next"},"value":{"kind":"Variable","name":{"kind":"Name","value":"next"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Session"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"collaboratorIds"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onMap"}},{"kind":"Field","name":{"kind":"Name","value":"trackTotal"}}]}}]} as unknown as DocumentNode;

export function useSessionsQuery(options: Omit<Urql.UseQueryArgs<SessionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SessionsQuery>({ query: SessionsDocument, ...options });
};
export const SessionsOnMapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"sessionsOnMap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lng"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"radius"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionsOnMap"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lng"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lng"}}},{"kind":"Argument","name":{"kind":"Name","value":"lat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"radius"},"value":{"kind":"Variable","name":{"kind":"Name","value":"radius"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Session"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"collaboratorIds"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onMap"}},{"kind":"Field","name":{"kind":"Name","value":"trackTotal"}}]}}]} as unknown as DocumentNode;

export function useSessionsOnMapQuery(options: Omit<Urql.UseQueryArgs<SessionsOnMapQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SessionsOnMapQuery>({ query: SessionsOnMapDocument, ...options });
};
export const SessionCurrentLiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"sessionCurrentLive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mine"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionCurrentLive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"creatorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"mine"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mine"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}}]}}]}}]} as unknown as DocumentNode;

export function useSessionCurrentLiveQuery(options: Omit<Urql.UseQueryArgs<SessionCurrentLiveQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SessionCurrentLiveQuery>({ query: SessionCurrentLiveDocument, ...options });
};
export const SessionTracksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"sessionTracks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionTracks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}}]} as unknown as DocumentNode;

export function useSessionTracksQuery(options: Omit<Urql.UseQueryArgs<SessionTracksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SessionTracksQuery>({ query: SessionTracksDocument, ...options });
};
export const SessionCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sessionCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LocationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}},{"kind":"Argument","name":{"kind":"Name","value":"tracks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Session"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"collaboratorIds"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onMap"}},{"kind":"Field","name":{"kind":"Name","value":"trackTotal"}}]}}]} as unknown as DocumentNode;

export function useSessionCreateMutation() {
  return Urql.useMutation<SessionCreateMutation, SessionCreateMutationVariables>(SessionCreateDocument);
};
export const SessionUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sessionUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LocationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Session"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"collaboratorIds"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onMap"}},{"kind":"Field","name":{"kind":"Name","value":"trackTotal"}}]}}]} as unknown as DocumentNode;

export function useSessionUpdateMutation() {
  return Urql.useMutation<SessionUpdateMutation, SessionUpdateMutationVariables>(SessionUpdateDocument);
};
export const SessionDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sessionDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode;

export function useSessionDeleteMutation() {
  return Urql.useMutation<SessionDeleteMutation, SessionDeleteMutationVariables>(SessionDeleteDocument);
};
export const SessionEndDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sessionEnd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionEnd"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Session"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"collaboratorIds"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onMap"}},{"kind":"Field","name":{"kind":"Name","value":"trackTotal"}}]}}]} as unknown as DocumentNode;

export function useSessionEndMutation() {
  return Urql.useMutation<SessionEndMutation, SessionEndMutationVariables>(SessionEndDocument);
};
export const SessionListenersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"sessionListeners"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionListeners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode;

export function useSessionListenersQuery(options: Omit<Urql.UseQueryArgs<SessionListenersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SessionListenersQuery>({ query: SessionListenersDocument, ...options });
};
export const SessionPingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sessionPing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionPing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode;

export function useSessionPingMutation() {
  return Urql.useMutation<SessionPingMutation, SessionPingMutationVariables>(SessionPingDocument);
};
export const SessionUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"sessionUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Session"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"collaboratorIds"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"Field","name":{"kind":"Name","value":"onMap"}},{"kind":"Field","name":{"kind":"Name","value":"trackTotal"}}]}}]} as unknown as DocumentNode;

export function useSessionUpdatedSubscription<TData = SessionUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<SessionUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<SessionUpdatedSubscription, TData>) {
  return Urql.useSubscription<SessionUpdatedSubscription, TData, SessionUpdatedSubscriptionVariables>({ query: SessionUpdatedDocument, ...options }, handler);
};
export const SessionListenersUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"sessionListenersUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionListenersUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode;

export function useSessionListenersUpdatedSubscription<TData = SessionListenersUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<SessionListenersUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<SessionListenersUpdatedSubscription, TData>) {
  return Urql.useSubscription<SessionListenersUpdatedSubscription, TData, SessionListenersUpdatedSubscriptionVariables>({ query: SessionListenersUpdatedDocument, ...options }, handler);
};
export const SessionInviteLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"sessionInviteLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionInviteLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode;

export function useSessionInviteLinkQuery(options: Omit<Urql.UseQueryArgs<SessionInviteLinkQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SessionInviteLinkQuery>({ query: SessionInviteLinkDocument, ...options });
};
export const SessionCollabAddFromTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sessionCollabAddFromToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionCollabAddFromToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode;

export function useSessionCollabAddFromTokenMutation() {
  return Urql.useMutation<SessionCollabAddFromTokenMutation, SessionCollabAddFromTokenMutationVariables>(SessionCollabAddFromTokenDocument);
};
export const TrackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"track"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"track"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}}]} as unknown as DocumentNode;

export function useTrackQuery(options: Omit<Urql.UseQueryArgs<TrackQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TrackQuery>({ query: TrackDocument, ...options });
};
export const TracksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tracks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tracks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}}]} as unknown as DocumentNode;

export function useTracksQuery(options: Omit<Urql.UseQueryArgs<TracksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TracksQuery>({ query: TracksDocument, ...options });
};
export const CrossTracksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"crossTracks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"crossTracks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"youtube"}},{"kind":"Field","name":{"kind":"Name","value":"spotify"}}]}}]}}]} as unknown as DocumentNode;

export function useCrossTracksQuery(options: Omit<Urql.UseQueryArgs<CrossTracksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CrossTracksQuery>({ query: CrossTracksDocument, ...options });
};
export const SearchTrackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchTrack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchTrack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}}]} as unknown as DocumentNode;

export function useSearchTrackQuery(options: Omit<Urql.UseQueryArgs<SearchTrackQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchTrackQuery>({ query: SearchTrackDocument, ...options });
};
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oauthId"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]} as unknown as DocumentNode;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"user"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]} as unknown as DocumentNode;

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
};
export const UserStatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userStat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userStat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}}]}}]} as unknown as DocumentNode;

export function useUserStatQuery(options: Omit<Urql.UseQueryArgs<UserStatQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserStatQuery>({ query: UserStatDocument, ...options });
};
export const UserFollowersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userFollowers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userFollowers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode;

export function useUserFollowersQuery(options: Omit<Urql.UseQueryArgs<UserFollowersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserFollowersQuery>({ query: UserFollowersDocument, ...options });
};
export const UserFollowingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userFollowings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userFollowings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode;

export function useUserFollowingsQuery(options: Omit<Urql.UseQueryArgs<UserFollowingsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserFollowingsQuery>({ query: UserFollowingsDocument, ...options });
};
export const UserFollowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"userFollow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userFollow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode;

export function useUserFollowMutation() {
  return Urql.useMutation<UserFollowMutation, UserFollowMutationVariables>(UserFollowDocument);
};
export const UserUnfollowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"userUnfollow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userUnfollow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode;

export function useUserUnfollowMutation() {
  return Urql.useMutation<UserUnfollowMutation, UserUnfollowMutationVariables>(UserUnfollowDocument);
};
export const MeUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"meUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]} as unknown as DocumentNode;

export function useMeUpdateMutation() {
  return Urql.useMutation<MeUpdateMutation, MeUpdateMutationVariables>(MeUpdateDocument);
};
export const MeDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"meDelete"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meDelete"}}]}}]} as unknown as DocumentNode;

export function useMeDeleteMutation() {
  return Urql.useMutation<MeDeleteMutation, MeDeleteMutationVariables>(MeDeleteDocument);
};
export type WithTypename<T extends { __typename?: any }> = { [K in Exclude<keyof T, '__typename'>]?: T[K] } & { __typename: NonNullable<T['__typename']> };

export type GraphCacheKeysConfig = {
  Artist?: (data: WithTypename<Artist>) => null | string,
  CrossTracks?: (data: WithTypename<CrossTracks>) => null | string,
  Me?: (data: WithTypename<Me>) => null | string,
  Message?: (data: WithTypename<Message>) => null | string,
  NotificationFollow?: (data: WithTypename<NotificationFollow>) => null | string,
  NotificationNewSession?: (data: WithTypename<NotificationNewSession>) => null | string,
  NowPlaying?: (data: WithTypename<NowPlaying>) => null | string,
  NowPlayingQueueItem?: (data: WithTypename<NowPlayingQueueItem>) => null | string,
  NowPlayingReactionItem?: (data: WithTypename<NowPlayingReactionItem>) => null | string,
  Playlist?: (data: WithTypename<Playlist>) => null | string,
  QueueItem?: (data: WithTypename<QueueItem>) => null | string,
  Session?: (data: WithTypename<Session>) => null | string,
  SessionCurrentLive?: (data: WithTypename<SessionCurrentLive>) => null | string,
  Track?: (data: WithTypename<Track>) => null | string,
  User?: (data: WithTypename<User>) => null | string,
  UserStat?: (data: WithTypename<UserStat>) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    crossTracks?: GraphCacheResolver<WithTypename<Query>, QueryCrossTracksArgs, WithTypename<CrossTracks> | string>,
    me?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<Me> | string>,
    messages?: GraphCacheResolver<WithTypename<Query>, QueryMessagesArgs, Array<WithTypename<Message> | string>>,
    myPlaylists?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<Playlist> | string>>,
    notifications?: GraphCacheResolver<WithTypename<Query>, QueryNotificationsArgs, Array<WithTypename<NotificationFollow> | WithTypename<NotificationNewSession> | string>>,
    nowPlaying?: GraphCacheResolver<WithTypename<Query>, QueryNowPlayingArgs, WithTypename<NowPlaying> | string>,
    nowPlayingReactions?: GraphCacheResolver<WithTypename<Query>, QueryNowPlayingReactionsArgs, Array<WithTypename<NowPlayingReactionItem> | string>>,
    playlist?: GraphCacheResolver<WithTypename<Query>, QueryPlaylistArgs, WithTypename<Playlist> | string>,
    playlistTracks?: GraphCacheResolver<WithTypename<Query>, QueryPlaylistTracksArgs, Array<WithTypename<Track> | string>>,
    playlistsFeatured?: GraphCacheResolver<WithTypename<Query>, QueryPlaylistsFeaturedArgs, Array<WithTypename<Playlist> | string>>,
    playlistsFriends?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<Playlist> | string>>,
    playlistsSearch?: GraphCacheResolver<WithTypename<Query>, QueryPlaylistsSearchArgs, Array<WithTypename<Playlist> | string>>,
    searchTrack?: GraphCacheResolver<WithTypename<Query>, QuerySearchTrackArgs, Array<WithTypename<Track> | string>>,
    session?: GraphCacheResolver<WithTypename<Query>, QuerySessionArgs, WithTypename<Session> | string>,
    sessionCurrentLive?: GraphCacheResolver<WithTypename<Query>, QuerySessionCurrentLiveArgs, WithTypename<SessionCurrentLive> | string>,
    sessionInviteLink?: GraphCacheResolver<WithTypename<Query>, QuerySessionInviteLinkArgs, Scalars['String'] | string>,
    sessionListeners?: GraphCacheResolver<WithTypename<Query>, QuerySessionListenersArgs, Array<Scalars['String'] | string>>,
    sessionTracks?: GraphCacheResolver<WithTypename<Query>, QuerySessionTracksArgs, Array<WithTypename<Track> | string>>,
    sessions?: GraphCacheResolver<WithTypename<Query>, QuerySessionsArgs, Array<WithTypename<Session> | string>>,
    sessionsOnMap?: GraphCacheResolver<WithTypename<Query>, QuerySessionsOnMapArgs, Array<WithTypename<Session> | string>>,
    track?: GraphCacheResolver<WithTypename<Query>, QueryTrackArgs, WithTypename<Track> | string>,
    tracks?: GraphCacheResolver<WithTypename<Query>, QueryTracksArgs, Array<WithTypename<Track> | string>>,
    user?: GraphCacheResolver<WithTypename<Query>, QueryUserArgs, WithTypename<User> | string>,
    userFollowers?: GraphCacheResolver<WithTypename<Query>, QueryUserFollowersArgs, Array<Scalars['String'] | string>>,
    userFollowings?: GraphCacheResolver<WithTypename<Query>, QueryUserFollowingsArgs, Array<Scalars['String'] | string>>,
    userStat?: GraphCacheResolver<WithTypename<Query>, QueryUserStatArgs, WithTypename<UserStat> | string>
  },
  Artist?: {
    id?: GraphCacheResolver<WithTypename<Artist>, Record<string, never>, Scalars['ID'] | string>,
    platform?: GraphCacheResolver<WithTypename<Artist>, Record<string, never>, PlatformName | string>,
    externalId?: GraphCacheResolver<WithTypename<Artist>, Record<string, never>, Scalars['ID'] | string>,
    name?: GraphCacheResolver<WithTypename<Artist>, Record<string, never>, Scalars['String'] | string>,
    image?: GraphCacheResolver<WithTypename<Artist>, Record<string, never>, Scalars['String'] | string>,
    url?: GraphCacheResolver<WithTypename<Artist>, Record<string, never>, Scalars['String'] | string>
  },
  CrossTracks?: {
    id?: GraphCacheResolver<WithTypename<CrossTracks>, Record<string, never>, Scalars['ID'] | string>,
    youtube?: GraphCacheResolver<WithTypename<CrossTracks>, Record<string, never>, Scalars['ID'] | string>,
    spotify?: GraphCacheResolver<WithTypename<CrossTracks>, Record<string, never>, Scalars['ID'] | string>
  },
  Me?: {
    user?: GraphCacheResolver<WithTypename<Me>, Record<string, never>, WithTypename<User> | string>,
    oauthId?: GraphCacheResolver<WithTypename<Me>, Record<string, never>, Scalars['String'] | string>,
    platform?: GraphCacheResolver<WithTypename<Me>, Record<string, never>, PlatformName | string>,
    accessToken?: GraphCacheResolver<WithTypename<Me>, Record<string, never>, Scalars['String'] | string>
  },
  Message?: {
    id?: GraphCacheResolver<WithTypename<Message>, Record<string, never>, Scalars['ID'] | string>,
    creatorId?: GraphCacheResolver<WithTypename<Message>, Record<string, never>, Scalars['String'] | string>,
    creator?: GraphCacheResolver<WithTypename<Message>, Record<string, never>, WithTypename<User> | string>,
    createdAt?: GraphCacheResolver<WithTypename<Message>, Record<string, never>, Scalars['DateTime'] | string>,
    text?: GraphCacheResolver<WithTypename<Message>, Record<string, never>, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<Message>, Record<string, never>, MessageType | string>
  },
  NotificationFollow?: {
    id?: GraphCacheResolver<WithTypename<NotificationFollow>, Record<string, never>, Scalars['ID'] | string>,
    hasRead?: GraphCacheResolver<WithTypename<NotificationFollow>, Record<string, never>, Scalars['Boolean'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<NotificationFollow>, Record<string, never>, Scalars['DateTime'] | string>,
    follower?: GraphCacheResolver<WithTypename<NotificationFollow>, Record<string, never>, WithTypename<User> | string>
  },
  NotificationNewSession?: {
    id?: GraphCacheResolver<WithTypename<NotificationNewSession>, Record<string, never>, Scalars['ID'] | string>,
    hasRead?: GraphCacheResolver<WithTypename<NotificationNewSession>, Record<string, never>, Scalars['Boolean'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<NotificationNewSession>, Record<string, never>, Scalars['DateTime'] | string>,
    session?: GraphCacheResolver<WithTypename<NotificationNewSession>, Record<string, never>, WithTypename<Session> | string>
  },
  NowPlaying?: {
    id?: GraphCacheResolver<WithTypename<NowPlaying>, Record<string, never>, Scalars['ID'] | string>,
    current?: GraphCacheResolver<WithTypename<NowPlaying>, Record<string, never>, WithTypename<NowPlayingQueueItem> | string>,
    next?: GraphCacheResolver<WithTypename<NowPlaying>, Record<string, never>, Array<WithTypename<QueueItem> | string>>
  },
  NowPlayingQueueItem?: {
    uid?: GraphCacheResolver<WithTypename<NowPlayingQueueItem>, Record<string, never>, Scalars['ID'] | string>,
    trackId?: GraphCacheResolver<WithTypename<NowPlayingQueueItem>, Record<string, never>, Scalars['String'] | string>,
    creatorId?: GraphCacheResolver<WithTypename<NowPlayingQueueItem>, Record<string, never>, Scalars['String'] | string>,
    index?: GraphCacheResolver<WithTypename<NowPlayingQueueItem>, Record<string, never>, Scalars['Int'] | string>,
    playedAt?: GraphCacheResolver<WithTypename<NowPlayingQueueItem>, Record<string, never>, Scalars['DateTime'] | string>,
    endedAt?: GraphCacheResolver<WithTypename<NowPlayingQueueItem>, Record<string, never>, Scalars['DateTime'] | string>
  },
  NowPlayingReactionItem?: {
    userId?: GraphCacheResolver<WithTypename<NowPlayingReactionItem>, Record<string, never>, Scalars['String'] | string>,
    reaction?: GraphCacheResolver<WithTypename<NowPlayingReactionItem>, Record<string, never>, NowPlayingReactionType | string>
  },
  Playlist?: {
    id?: GraphCacheResolver<WithTypename<Playlist>, Record<string, never>, Scalars['ID'] | string>,
    platform?: GraphCacheResolver<WithTypename<Playlist>, Record<string, never>, PlatformName | string>,
    externalId?: GraphCacheResolver<WithTypename<Playlist>, Record<string, never>, Scalars['ID'] | string>,
    name?: GraphCacheResolver<WithTypename<Playlist>, Record<string, never>, Scalars['String'] | string>,
    image?: GraphCacheResolver<WithTypename<Playlist>, Record<string, never>, Scalars['String'] | string>,
    url?: GraphCacheResolver<WithTypename<Playlist>, Record<string, never>, Scalars['String'] | string>,
    total?: GraphCacheResolver<WithTypename<Playlist>, Record<string, never>, Scalars['Int'] | string>,
    creatorName?: GraphCacheResolver<WithTypename<Playlist>, Record<string, never>, Scalars['String'] | string>,
    creatorImage?: GraphCacheResolver<WithTypename<Playlist>, Record<string, never>, Scalars['String'] | string>
  },
  QueueItem?: {
    uid?: GraphCacheResolver<WithTypename<QueueItem>, Record<string, never>, Scalars['ID'] | string>,
    trackId?: GraphCacheResolver<WithTypename<QueueItem>, Record<string, never>, Scalars['String'] | string>,
    creatorId?: GraphCacheResolver<WithTypename<QueueItem>, Record<string, never>, Scalars['String'] | string>
  },
  Session?: {
    id?: GraphCacheResolver<WithTypename<Session>, Record<string, never>, Scalars['ID'] | string>,
    text?: GraphCacheResolver<WithTypename<Session>, Record<string, never>, Scalars['String'] | string>,
    image?: GraphCacheResolver<WithTypename<Session>, Record<string, never>, Scalars['String'] | string>,
    creatorId?: GraphCacheResolver<WithTypename<Session>, Record<string, never>, Scalars['ID'] | string>,
    creator?: GraphCacheResolver<WithTypename<Session>, Record<string, never>, WithTypename<User> | string>,
    createdAt?: GraphCacheResolver<WithTypename<Session>, Record<string, never>, Scalars['DateTime'] | string>,
    isLive?: GraphCacheResolver<WithTypename<Session>, Record<string, never>, Scalars['Boolean'] | string>,
    collaboratorIds?: GraphCacheResolver<WithTypename<Session>, Record<string, never>, Array<Scalars['String'] | string>>,
    onMap?: GraphCacheResolver<WithTypename<Session>, Record<string, never>, Scalars['Boolean'] | string>,
    trackTotal?: GraphCacheResolver<WithTypename<Session>, Record<string, never>, Scalars['Int'] | string>
  },
  SessionCurrentLive?: {
    creatorId?: GraphCacheResolver<WithTypename<SessionCurrentLive>, Record<string, never>, Scalars['ID'] | string>,
    sessionId?: GraphCacheResolver<WithTypename<SessionCurrentLive>, Record<string, never>, Scalars['ID'] | string>
  },
  Track?: {
    id?: GraphCacheResolver<WithTypename<Track>, Record<string, never>, Scalars['ID'] | string>,
    platform?: GraphCacheResolver<WithTypename<Track>, Record<string, never>, PlatformName | string>,
    externalId?: GraphCacheResolver<WithTypename<Track>, Record<string, never>, Scalars['ID'] | string>,
    artists?: GraphCacheResolver<WithTypename<Track>, Record<string, never>, Array<WithTypename<Artist> | string>>,
    duration?: GraphCacheResolver<WithTypename<Track>, Record<string, never>, Scalars['Int'] | string>,
    title?: GraphCacheResolver<WithTypename<Track>, Record<string, never>, Scalars['String'] | string>,
    image?: GraphCacheResolver<WithTypename<Track>, Record<string, never>, Scalars['String'] | string>,
    url?: GraphCacheResolver<WithTypename<Track>, Record<string, never>, Scalars['String'] | string>
  },
  User?: {
    id?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['ID'] | string>,
    username?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    bio?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    profilePicture?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>
  },
  UserStat?: {
    id?: GraphCacheResolver<WithTypename<UserStat>, Record<string, never>, Scalars['ID'] | string>,
    followerCount?: GraphCacheResolver<WithTypename<UserStat>, Record<string, never>, Scalars['Int'] | string>,
    followingCount?: GraphCacheResolver<WithTypename<UserStat>, Record<string, never>, Scalars['Int'] | string>
  }
};

export type GraphCacheOptimisticUpdaters = {
  me?: GraphCacheOptimisticMutationResolver<MutationMeArgs, Maybe<WithTypename<User>>>,
  meDelete?: GraphCacheOptimisticMutationResolver<Record<string, never>, Scalars['Boolean']>,
  messageAdd?: GraphCacheOptimisticMutationResolver<MutationMessageAddArgs, Scalars['Boolean']>,
  notificationsMarkRead?: GraphCacheOptimisticMutationResolver<MutationNotificationsMarkReadArgs, Scalars['Int']>,
  nowPlayingPlayUid?: GraphCacheOptimisticMutationResolver<MutationNowPlayingPlayUidArgs, Maybe<Scalars['Boolean']>>,
  nowPlayingReact?: GraphCacheOptimisticMutationResolver<MutationNowPlayingReactArgs, Maybe<Scalars['Boolean']>>,
  nowPlayingSkip?: GraphCacheOptimisticMutationResolver<MutationNowPlayingSkipArgs, Maybe<Scalars['Boolean']>>,
  playlistAddTracks?: GraphCacheOptimisticMutationResolver<MutationPlaylistAddTracksArgs, Scalars['Boolean']>,
  playlistCreate?: GraphCacheOptimisticMutationResolver<MutationPlaylistCreateArgs, WithTypename<Playlist>>,
  queueAdd?: GraphCacheOptimisticMutationResolver<MutationQueueAddArgs, Scalars['Boolean']>,
  queueRemove?: GraphCacheOptimisticMutationResolver<MutationQueueRemoveArgs, Scalars['Boolean']>,
  queueReorder?: GraphCacheOptimisticMutationResolver<MutationQueueReorderArgs, Scalars['Boolean']>,
  queueToTop?: GraphCacheOptimisticMutationResolver<MutationQueueToTopArgs, Scalars['Boolean']>,
  sessionCollabAddFromToken?: GraphCacheOptimisticMutationResolver<MutationSessionCollabAddFromTokenArgs, Scalars['Boolean']>,
  sessionCreate?: GraphCacheOptimisticMutationResolver<MutationSessionCreateArgs, WithTypename<Session>>,
  sessionDelete?: GraphCacheOptimisticMutationResolver<MutationSessionDeleteArgs, Scalars['ID']>,
  sessionEnd?: GraphCacheOptimisticMutationResolver<MutationSessionEndArgs, WithTypename<Session>>,
  sessionPing?: GraphCacheOptimisticMutationResolver<MutationSessionPingArgs, Scalars['Boolean']>,
  sessionUpdate?: GraphCacheOptimisticMutationResolver<MutationSessionUpdateArgs, WithTypename<Session>>,
  userFollow?: GraphCacheOptimisticMutationResolver<MutationUserFollowArgs, Scalars['Boolean']>,
  userUnfollow?: GraphCacheOptimisticMutationResolver<MutationUserUnfollowArgs, Scalars['Boolean']>
};

export type GraphCacheUpdaters = {
  Mutation?: {
    me?: GraphCacheUpdateResolver<{ me: Maybe<WithTypename<User>> }, MutationMeArgs>,
    meDelete?: GraphCacheUpdateResolver<{ meDelete: Scalars['Boolean'] }, Record<string, never>>,
    messageAdd?: GraphCacheUpdateResolver<{ messageAdd: Scalars['Boolean'] }, MutationMessageAddArgs>,
    notificationsMarkRead?: GraphCacheUpdateResolver<{ notificationsMarkRead: Scalars['Int'] }, MutationNotificationsMarkReadArgs>,
    nowPlayingPlayUid?: GraphCacheUpdateResolver<{ nowPlayingPlayUid: Maybe<Scalars['Boolean']> }, MutationNowPlayingPlayUidArgs>,
    nowPlayingReact?: GraphCacheUpdateResolver<{ nowPlayingReact: Maybe<Scalars['Boolean']> }, MutationNowPlayingReactArgs>,
    nowPlayingSkip?: GraphCacheUpdateResolver<{ nowPlayingSkip: Maybe<Scalars['Boolean']> }, MutationNowPlayingSkipArgs>,
    playlistAddTracks?: GraphCacheUpdateResolver<{ playlistAddTracks: Scalars['Boolean'] }, MutationPlaylistAddTracksArgs>,
    playlistCreate?: GraphCacheUpdateResolver<{ playlistCreate: WithTypename<Playlist> }, MutationPlaylistCreateArgs>,
    queueAdd?: GraphCacheUpdateResolver<{ queueAdd: Scalars['Boolean'] }, MutationQueueAddArgs>,
    queueRemove?: GraphCacheUpdateResolver<{ queueRemove: Scalars['Boolean'] }, MutationQueueRemoveArgs>,
    queueReorder?: GraphCacheUpdateResolver<{ queueReorder: Scalars['Boolean'] }, MutationQueueReorderArgs>,
    queueToTop?: GraphCacheUpdateResolver<{ queueToTop: Scalars['Boolean'] }, MutationQueueToTopArgs>,
    sessionCollabAddFromToken?: GraphCacheUpdateResolver<{ sessionCollabAddFromToken: Scalars['Boolean'] }, MutationSessionCollabAddFromTokenArgs>,
    sessionCreate?: GraphCacheUpdateResolver<{ sessionCreate: WithTypename<Session> }, MutationSessionCreateArgs>,
    sessionDelete?: GraphCacheUpdateResolver<{ sessionDelete: Scalars['ID'] }, MutationSessionDeleteArgs>,
    sessionEnd?: GraphCacheUpdateResolver<{ sessionEnd: WithTypename<Session> }, MutationSessionEndArgs>,
    sessionPing?: GraphCacheUpdateResolver<{ sessionPing: Scalars['Boolean'] }, MutationSessionPingArgs>,
    sessionUpdate?: GraphCacheUpdateResolver<{ sessionUpdate: WithTypename<Session> }, MutationSessionUpdateArgs>,
    userFollow?: GraphCacheUpdateResolver<{ userFollow: Scalars['Boolean'] }, MutationUserFollowArgs>,
    userUnfollow?: GraphCacheUpdateResolver<{ userUnfollow: Scalars['Boolean'] }, MutationUserUnfollowArgs>
  },
  Subscription?: {
    messageAdded?: GraphCacheUpdateResolver<{ messageAdded: WithTypename<Message> }, SubscriptionMessageAddedArgs>,
    notificationAdded?: GraphCacheUpdateResolver<{ notificationAdded: WithTypename<NotificationFollow> | WithTypename<NotificationNewSession> }, Record<string, never>>,
    nowPlayingReactionsUpdated?: GraphCacheUpdateResolver<{ nowPlayingReactionsUpdated: Array<WithTypename<NowPlayingReactionItem>> }, SubscriptionNowPlayingReactionsUpdatedArgs>,
    nowPlayingUpdated?: GraphCacheUpdateResolver<{ nowPlayingUpdated: Maybe<WithTypename<NowPlaying>> }, SubscriptionNowPlayingUpdatedArgs>,
    sessionListenersUpdated?: GraphCacheUpdateResolver<{ sessionListenersUpdated: Array<Scalars['String']> }, SubscriptionSessionListenersUpdatedArgs>,
    sessionUpdated?: GraphCacheUpdateResolver<{ sessionUpdated: WithTypename<Session> }, SubscriptionSessionUpdatedArgs>
  },
};

export type GraphCacheConfig = {
  schema?: IntrospectionData,
  updates?: GraphCacheUpdaters,
  keys?: GraphCacheKeysConfig,
  optimistic?: GraphCacheOptimisticUpdaters,
  resolvers?: GraphCacheResolvers,
  storage?: GraphCacheStorageAdapter
};