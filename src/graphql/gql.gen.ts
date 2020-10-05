import { DocumentNode } from 'graphql';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  me?: Maybe<User>;
  user?: Maybe<User>;
  meAuth?: Maybe<UserAuthWrapper>;
  room?: Maybe<Room>;
  roomState?: Maybe<RoomState>;
  rooms?: Maybe<Array<Room>>;
  exploreRooms: Array<Room>;
  searchRooms: Array<Room>;
  track?: Maybe<Track>;
  crossTracks?: Maybe<CrossTracks>;
  searchTrack: Array<Track>;
  queue?: Maybe<Queue>;
  nowPlaying?: Maybe<NowPlaying>;
  nowPlayingReactions?: Maybe<NowPlayingReaction>;
};


export type QueryUserArgs = {
  username?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
};


export type QueryRoomArgs = {
  id: Scalars['ID'];
};


export type QueryRoomStateArgs = {
  id: Scalars['ID'];
};


export type QueryRoomsArgs = {
  creatorId?: Maybe<Scalars['String']>;
};


export type QueryExploreRoomsArgs = {
  by: Scalars['String'];
};


export type QuerySearchRoomsArgs = {
  query: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
};


export type QueryTrackArgs = {
  id?: Maybe<Scalars['ID']>;
  uri?: Maybe<Scalars['String']>;
};


export type QueryCrossTracksArgs = {
  id: Scalars['ID'];
};


export type QuerySearchTrackArgs = {
  platform: PlatformName;
  query: Scalars['String'];
};


export type QueryQueueArgs = {
  id: Scalars['ID'];
};


export type QueryNowPlayingArgs = {
  id: Scalars['ID'];
};


export type QueryNowPlayingReactionsArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  me?: Maybe<User>;
  deleteMe: Scalars['Boolean'];
  deleteMeOauth: Scalars['Boolean'];
  createRoom: Room;
  updateRoom: Room;
  updateRoomMembership: Scalars['Boolean'];
  deleteRoom: Scalars['ID'];
  addMessage: Scalars['Boolean'];
  updateQueue: Scalars['Boolean'];
  reactNowPlaying?: Maybe<Scalars['Boolean']>;
};


export type MutationMeArgs = {
  name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  profilePicture?: Maybe<Scalars['Upload']>;
};


export type MutationDeleteMeOauthArgs = {
  provider: OAuthProviderName;
};


export type MutationCreateRoomArgs = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};


export type MutationUpdateRoomArgs = {
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['Upload']>;
  anyoneCanAdd?: Maybe<Scalars['Boolean']>;
  queueMax?: Maybe<Scalars['Int']>;
};


export type MutationUpdateRoomMembershipArgs = {
  id: Scalars['ID'];
  username?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  role?: Maybe<RoomMembership>;
};


export type MutationDeleteRoomArgs = {
  id: Scalars['ID'];
};


export type MutationAddMessageArgs = {
  roomId: Scalars['ID'];
  message: Scalars['String'];
};


export type MutationUpdateQueueArgs = {
  id: Scalars['ID'];
  action: QueueAction;
  tracks?: Maybe<Array<Scalars['ID']>>;
  position?: Maybe<Scalars['Int']>;
  insertPosition?: Maybe<Scalars['Int']>;
};


export type MutationReactNowPlayingArgs = {
  id: Scalars['ID'];
  reaction: NowPlayingReactionType;
};

export type Subscription = {
  __typename?: 'Subscription';
  _empty?: Maybe<Scalars['String']>;
  roomStateUpdated?: Maybe<RoomState>;
  messageAdded: Message;
  queueUpdated: Queue;
  nowPlayingUpdated?: Maybe<NowPlaying>;
  nowPlayingReactionsUpdated?: Maybe<NowPlayingReaction>;
};


export type SubscriptionRoomStateUpdatedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionMessageAddedArgs = {
  roomId: Scalars['ID'];
};


export type SubscriptionQueueUpdatedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionNowPlayingUpdatedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionNowPlayingReactionsUpdatedArgs = {
  id: Scalars['ID'];
};



export enum OAuthProviderName {
  Youtube = 'youtube',
  Twitter = 'twitter',
  Facebook = 'facebook',
  Spotify = 'spotify'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  profilePicture: Scalars['String'];
};

export type UserAuthWrapper = {
  __typename?: 'UserAuthWrapper';
  youtube?: Maybe<UserOauthProvider>;
  twitter?: Maybe<UserOauthProvider>;
  facebook?: Maybe<UserOauthProvider>;
  spotify?: Maybe<UserOauthProvider>;
};

export type UserOauthProvider = {
  __typename?: 'UserOauthProvider';
  provider: OAuthProviderName;
  id: Scalars['ID'];
};

export enum RoomMembership {
  Host = 'host',
  Collab = 'collab'
}

export type Room = {
  __typename?: 'Room';
  id: Scalars['ID'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  creator: User;
  createdAt: Scalars['DateTime'];
};

export type RoomState = {
  __typename?: 'RoomState';
  id: Scalars['ID'];
  userIds: Array<Scalars['String']>;
  /** Settings */
  anyoneCanAdd: Scalars['Boolean'];
  collabs: Array<Scalars['String']>;
  queueMax: Scalars['Int'];
};

export enum PlatformName {
  Youtube = 'youtube',
  Spotify = 'spotify'
}

export type Track = {
  __typename?: 'Track';
  id: Scalars['ID'];
  platform: PlatformName;
  externalId: Scalars['ID'];
  artists: Array<Artist>;
  duration: Scalars['Int'];
  title: Scalars['String'];
  image: Scalars['String'];
  url: Scalars['String'];
};

export type CrossTracks = {
  __typename?: 'CrossTracks';
  originalId: Scalars['ID'];
  youtube?: Maybe<Track>;
  spotify?: Maybe<Track>;
};

export type Artist = {
  __typename?: 'Artist';
  id: Scalars['ID'];
  platform: PlatformName;
  externalId: Scalars['ID'];
  name: Scalars['String'];
  image: Scalars['String'];
  url: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  message: Scalars['String'];
  from: MessageParticipant;
};

export type MessageParticipant = {
  __typename?: 'MessageParticipant';
  type: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  photo: Scalars['String'];
  uri: Scalars['String'];
};

export enum QueueAction {
  Remove = 'remove',
  Reorder = 'reorder',
  Add = 'add',
  Clear = 'clear'
}

export type QueueItem = {
  __typename?: 'QueueItem';
  id: Scalars['ID'];
  trackId: Scalars['String'];
  creatorId: Scalars['String'];
};

export type Queue = {
  __typename?: 'Queue';
  id: Scalars['ID'];
  items: Array<QueueItem>;
};

export enum NowPlayingReactionType {
  Heart = 'heart',
  TearJoy = 'tear_joy',
  Fire = 'fire',
  Crying = 'crying'
}

export type NowPlayingQueueItem = {
  __typename?: 'NowPlayingQueueItem';
  id: Scalars['ID'];
  trackId: Scalars['ID'];
  playedAt: Scalars['DateTime'];
  endedAt: Scalars['DateTime'];
};

export type NowPlaying = {
  __typename?: 'NowPlaying';
  id: Scalars['ID'];
  currentTrack?: Maybe<NowPlayingQueueItem>;
};

export type NowPlayingReaction = {
  __typename?: 'NowPlayingReaction';
  id: Scalars['ID'];
  mine: Array<NowPlayingReactionType>;
  heart: Scalars['Int'];
  crying: Scalars['Int'];
  tear_joy: Scalars['Int'];
  fire: Scalars['Int'];
};

export type MessagePartsFragment = (
  { __typename?: 'Message' }
  & Pick<Message, 'id' | 'createdAt' | 'message'>
  & { from: (
    { __typename?: 'MessageParticipant' }
    & Pick<MessageParticipant, 'type' | 'id' | 'name' | 'photo' | 'uri'>
  ) }
);

export type SendMessageMutationVariables = Exact<{
  roomId: Scalars['ID'];
  message: Scalars['String'];
}>;


export type SendMessageMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addMessage'>
);

export type OnMessageAddedSubscriptionVariables = Exact<{
  roomId: Scalars['ID'];
}>;


export type OnMessageAddedSubscription = (
  { __typename?: 'Subscription' }
  & { messageAdded: (
    { __typename?: 'Message' }
    & MessagePartsFragment
  ) }
);

export type NowPlayingQueuePartsFragment = (
  { __typename?: 'NowPlayingQueueItem' }
  & Pick<NowPlayingQueueItem, 'id' | 'trackId' | 'playedAt'>
);

export type NowPlayingQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingQuery = (
  { __typename?: 'Query' }
  & { nowPlaying?: Maybe<(
    { __typename?: 'NowPlaying' }
    & Pick<NowPlaying, 'id'>
    & { currentTrack?: Maybe<(
      { __typename?: 'NowPlayingQueueItem' }
      & NowPlayingQueuePartsFragment
    )> }
  )> }
);

export type OnNowPlayingUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnNowPlayingUpdatedSubscription = (
  { __typename?: 'Subscription' }
  & { nowPlayingUpdated?: Maybe<(
    { __typename?: 'NowPlaying' }
    & Pick<NowPlaying, 'id'>
    & { currentTrack?: Maybe<(
      { __typename?: 'NowPlayingQueueItem' }
      & NowPlayingQueuePartsFragment
    )> }
  )> }
);

export type NowPlayingReactionPartsFragment = (
  { __typename?: 'NowPlayingReaction' }
  & Pick<NowPlayingReaction, 'id' | 'heart' | 'crying' | 'tear_joy' | 'fire' | 'mine'>
);

export type NowPlayingReactionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingReactionsQuery = (
  { __typename?: 'Query' }
  & { nowPlayingReactions?: Maybe<(
    { __typename?: 'NowPlayingReaction' }
    & NowPlayingReactionPartsFragment
  )> }
);

export type OnNowPlayingReactionsUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnNowPlayingReactionsUpdatedSubscription = (
  { __typename?: 'Subscription' }
  & { nowPlayingReactionsUpdated?: Maybe<(
    { __typename?: 'NowPlayingReaction' }
    & NowPlayingReactionPartsFragment
  )> }
);

export type ReactNowPlayingMutationVariables = Exact<{
  id: Scalars['ID'];
  reaction: NowPlayingReactionType;
}>;


export type ReactNowPlayingMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'reactNowPlaying'>
);

export type QueueItemPartsFragment = (
  { __typename?: 'QueueItem' }
  & Pick<QueueItem, 'id' | 'trackId' | 'creatorId'>
);

export type UpdateQueueMutationVariables = Exact<{
  id: Scalars['ID'];
  action: QueueAction;
  tracks?: Maybe<Array<Scalars['ID']>>;
  position?: Maybe<Scalars['Int']>;
  insertPosition?: Maybe<Scalars['Int']>;
}>;


export type UpdateQueueMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateQueue'>
);

export type QueueQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type QueueQuery = (
  { __typename?: 'Query' }
  & { queue?: Maybe<(
    { __typename?: 'Queue' }
    & Pick<Queue, 'id'>
    & { items: Array<(
      { __typename?: 'QueueItem' }
      & QueueItemPartsFragment
    )> }
  )> }
);

export type OnQueueUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnQueueUpdatedSubscription = (
  { __typename?: 'Subscription' }
  & { queueUpdated: (
    { __typename?: 'Queue' }
    & Pick<Queue, 'id'>
    & { items: Array<(
      { __typename?: 'QueueItem' }
      & QueueItemPartsFragment
    )> }
  ) }
);

export type RoomDetailPartsFragment = (
  { __typename?: 'Room' }
  & Pick<Room, 'title' | 'description' | 'image' | 'createdAt'>
);

export type RoomCreatorPartFragment = (
  { __typename?: 'Room' }
  & { creator: (
    { __typename?: 'User' }
    & UserPublicPartsFragment
  ) }
);

export type RoomRulesPartsFragment = (
  { __typename?: 'RoomState' }
  & Pick<RoomState, 'anyoneCanAdd' | 'collabs' | 'queueMax'>
);

export type RoomQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RoomQuery = (
  { __typename?: 'Query' }
  & { room?: Maybe<(
    { __typename?: 'Room' }
    & Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  )> }
);

export type RoomsQueryVariables = Exact<{
  creatorId?: Maybe<Scalars['String']>;
}>;


export type RoomsQuery = (
  { __typename?: 'Query' }
  & { rooms?: Maybe<Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  )>> }
);

export type ExploreRoomsQueryVariables = Exact<{
  by: Scalars['String'];
}>;


export type ExploreRoomsQuery = (
  { __typename?: 'Query' }
  & { exploreRooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  )> }
);

export type SearchRoomsQueryVariables = Exact<{
  query: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
}>;


export type SearchRoomsQuery = (
  { __typename?: 'Query' }
  & { searchRooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  )> }
);

export type CreateRoomMutationVariables = Exact<{
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
}>;


export type CreateRoomMutation = (
  { __typename?: 'Mutation' }
  & { createRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  ) }
);

export type UpdateRoomMutationVariables = Exact<{
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['Upload']>;
  anyoneCanAdd?: Maybe<Scalars['Boolean']>;
  queueMax?: Maybe<Scalars['Int']>;
}>;


export type UpdateRoomMutation = (
  { __typename?: 'Mutation' }
  & { updateRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  ) }
);

export type UpdateRoomMembershipMutationVariables = Exact<{
  id: Scalars['ID'];
  username?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  role?: Maybe<RoomMembership>;
}>;


export type UpdateRoomMembershipMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateRoomMembership'>
);

export type DeleteRoomMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteRoomMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteRoom'>
);

export type RoomStateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RoomStateQuery = (
  { __typename?: 'Query' }
  & { roomState?: Maybe<(
    { __typename?: 'RoomState' }
    & Pick<RoomState, 'id' | 'userIds'>
    & RoomRulesPartsFragment
  )> }
);

export type OnRoomStateUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnRoomStateUpdatedSubscription = (
  { __typename?: 'Subscription' }
  & { roomStateUpdated?: Maybe<(
    { __typename?: 'RoomState' }
    & Pick<RoomState, 'id' | 'userIds'>
    & RoomRulesPartsFragment
  )> }
);

export type ArtistPartsFragment = (
  { __typename?: 'Artist' }
  & Pick<Artist, 'id' | 'platform' | 'externalId' | 'name' | 'image' | 'url'>
);

export type TrackPartsFragment = (
  { __typename?: 'Track' }
  & Pick<Track, 'id' | 'platform' | 'externalId' | 'title' | 'duration' | 'image' | 'url'>
  & { artists: Array<(
    { __typename?: 'Artist' }
    & ArtistPartsFragment
  )> }
);

export type TrackQueryVariables = Exact<{
  uri?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
}>;


export type TrackQuery = (
  { __typename?: 'Query' }
  & { track?: Maybe<(
    { __typename?: 'Track' }
    & TrackPartsFragment
  )> }
);

export type CrossTracksQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CrossTracksQuery = (
  { __typename?: 'Query' }
  & { crossTracks?: Maybe<(
    { __typename?: 'CrossTracks' }
    & Pick<CrossTracks, 'originalId'>
    & { youtube?: Maybe<(
      { __typename?: 'Track' }
      & TrackPartsFragment
    )>, spotify?: Maybe<(
      { __typename?: 'Track' }
      & TrackPartsFragment
    )> }
  )> }
);

export type SearchTrackQueryVariables = Exact<{
  platform: PlatformName;
  query: Scalars['String'];
}>;


export type SearchTrackQuery = (
  { __typename?: 'Query' }
  & { searchTrack: Array<(
    { __typename?: 'Track' }
    & TrackPartsFragment
  )> }
);

export type UserPublicPartsFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'bio' | 'profilePicture'>
);

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserPublicPartsFragment
  )> }
);

export type UserQueryVariables = Exact<{
  username?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserPublicPartsFragment
  )> }
);

export type UpdateCurrentUserMutationVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  profilePicture?: Maybe<Scalars['Upload']>;
}>;


export type UpdateCurrentUserMutation = (
  { __typename?: 'Mutation' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserPublicPartsFragment
  )> }
);

export type DisconnectOAuthProviderMutationVariables = Exact<{
  provider: OAuthProviderName;
}>;


export type DisconnectOAuthProviderMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteMeOauth'>
);

export type DeleteCurrentUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteCurrentUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteMe'>
);

export type MeAuthQueryVariables = Exact<{ [key: string]: never; }>;


export type MeAuthQuery = (
  { __typename?: 'Query' }
  & { meAuth?: Maybe<(
    { __typename?: 'UserAuthWrapper' }
    & { youtube?: Maybe<(
      { __typename?: 'UserOauthProvider' }
      & Pick<UserOauthProvider, 'id'>
    )>, spotify?: Maybe<(
      { __typename?: 'UserOauthProvider' }
      & Pick<UserOauthProvider, 'id'>
    )>, twitter?: Maybe<(
      { __typename?: 'UserOauthProvider' }
      & Pick<UserOauthProvider, 'id'>
    )>, facebook?: Maybe<(
      { __typename?: 'UserOauthProvider' }
      & Pick<UserOauthProvider, 'id'>
    )> }
  )> }
);

export const MessagePartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"message"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"from"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"photo"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"uri"},"arguments":[],"directives":[]}]}}]}}]};
export const NowPlayingQueuePartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"trackId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"playedAt"},"arguments":[],"directives":[]}]}}]};
export const NowPlayingReactionPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingReactionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingReaction"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"heart"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"crying"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tear_joy"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"fire"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"mine"},"arguments":[],"directives":[]}]}}]};
export const QueueItemPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"trackId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"creatorId"},"arguments":[],"directives":[]}]}}]};
export const RoomDetailPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"description"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]}]}}]};
export const UserPublicPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};
export const RoomCreatorPartFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomCreatorPart"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creator"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};
export const RoomRulesPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomRulesParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomState"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anyoneCanAdd"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"collabs"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"queueMax"},"arguments":[],"directives":[]}]}}]};
export const ArtistPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}}]};
export const TrackPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"duration"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"artists"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}}]};
export const SendMessageDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"message"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}}],"directives":[]}]}}]};

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument);
};
export const OnMessageAddedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onMessageAdded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageAdded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"message"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"from"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"photo"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"uri"},"arguments":[],"directives":[]}]}}]}}]};

export function useOnMessageAddedSubscription<TData = OnMessageAddedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnMessageAddedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnMessageAddedSubscription, TData>) {
  return Urql.useSubscription<OnMessageAddedSubscription, TData, OnMessageAddedSubscriptionVariables>({ query: OnMessageAddedDocument, ...options }, handler);
};
export const NowPlayingDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nowPlaying"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlaying"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"currentTrack"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingQueueParts"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"trackId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"playedAt"},"arguments":[],"directives":[]}]}}]};

export function useNowPlayingQuery(options: Omit<Urql.UseQueryArgs<NowPlayingQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NowPlayingQuery>({ query: NowPlayingDocument, ...options });
};
export const OnNowPlayingUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onNowPlayingUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"currentTrack"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingQueueParts"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"trackId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"playedAt"},"arguments":[],"directives":[]}]}}]};

export function useOnNowPlayingUpdatedSubscription<TData = OnNowPlayingUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnNowPlayingUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnNowPlayingUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnNowPlayingUpdatedSubscription, TData, OnNowPlayingUpdatedSubscriptionVariables>({ query: OnNowPlayingUpdatedDocument, ...options }, handler);
};
export const NowPlayingReactionsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nowPlayingReactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingReactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingReactionParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingReactionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingReaction"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"heart"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"crying"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tear_joy"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"fire"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"mine"},"arguments":[],"directives":[]}]}}]};

export function useNowPlayingReactionsQuery(options: Omit<Urql.UseQueryArgs<NowPlayingReactionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NowPlayingReactionsQuery>({ query: NowPlayingReactionsDocument, ...options });
};
export const OnNowPlayingReactionsUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onNowPlayingReactionsUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingReactionsUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingReactionParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingReactionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingReaction"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"heart"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"crying"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tear_joy"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"fire"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"mine"},"arguments":[],"directives":[]}]}}]};

export function useOnNowPlayingReactionsUpdatedSubscription<TData = OnNowPlayingReactionsUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnNowPlayingReactionsUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnNowPlayingReactionsUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnNowPlayingReactionsUpdatedSubscription, TData, OnNowPlayingReactionsUpdatedSubscriptionVariables>({ query: OnNowPlayingReactionsUpdatedDocument, ...options }, handler);
};
export const ReactNowPlayingDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"reactNowPlaying"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingReactionType"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reactNowPlaying"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"reaction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}}}],"directives":[]}]}}]};

export function useReactNowPlayingMutation() {
  return Urql.useMutation<ReactNowPlayingMutation, ReactNowPlayingMutationVariables>(ReactNowPlayingDocument);
};
export const UpdateQueueDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateQueue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"action"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QueueAction"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"insertPosition"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateQueue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"action"},"value":{"kind":"Variable","name":{"kind":"Name","value":"action"}}},{"kind":"Argument","name":{"kind":"Name","value":"tracks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}}},{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}},{"kind":"Argument","name":{"kind":"Name","value":"insertPosition"},"value":{"kind":"Variable","name":{"kind":"Name","value":"insertPosition"}}}],"directives":[]}]}}]};

export function useUpdateQueueMutation() {
  return Urql.useMutation<UpdateQueueMutation, UpdateQueueMutationVariables>(UpdateQueueDocument);
};
export const QueueDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"queue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QueueItemParts"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"trackId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"creatorId"},"arguments":[],"directives":[]}]}}]};

export function useQueueQuery(options: Omit<Urql.UseQueryArgs<QueueQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<QueueQuery>({ query: QueueDocument, ...options });
};
export const OnQueueUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onQueueUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QueueItemParts"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"trackId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"creatorId"},"arguments":[],"directives":[]}]}}]};

export function useOnQueueUpdatedSubscription<TData = OnQueueUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnQueueUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnQueueUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnQueueUpdatedSubscription, TData, OnQueueUpdatedSubscriptionVariables>({ query: OnQueueUpdatedDocument, ...options }, handler);
};
export const RoomDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"room"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomDetailParts"},"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomCreatorPart"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"description"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomCreatorPart"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creator"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};

export function useRoomQuery(options: Omit<Urql.UseQueryArgs<RoomQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RoomQuery>({ query: RoomDocument, ...options });
};
export const RoomsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"rooms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rooms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"creatorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomDetailParts"},"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomCreatorPart"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"description"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomCreatorPart"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creator"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};

export function useRoomsQuery(options: Omit<Urql.UseQueryArgs<RoomsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RoomsQuery>({ query: RoomsDocument, ...options });
};
export const ExploreRoomsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"exploreRooms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"by"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exploreRooms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"by"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomDetailParts"},"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomCreatorPart"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"description"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomCreatorPart"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creator"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};

export function useExploreRoomsQuery(options: Omit<Urql.UseQueryArgs<ExploreRoomsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ExploreRoomsQuery>({ query: ExploreRoomsDocument, ...options });
};
export const SearchRoomsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchRooms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchRooms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomDetailParts"},"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomCreatorPart"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"description"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomCreatorPart"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creator"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};

export function useSearchRoomsQuery(options: Omit<Urql.UseQueryArgs<SearchRoomsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchRoomsQuery>({ query: SearchRoomsDocument, ...options });
};
export const CreateRoomDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRoom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomDetailParts"},"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomCreatorPart"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"description"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomCreatorPart"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creator"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};

export function useCreateRoomMutation() {
  return Urql.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument);
};
export const UpdateRoomDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"anyoneCanAdd"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueMax"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRoom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"image"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image"}}},{"kind":"Argument","name":{"kind":"Name","value":"anyoneCanAdd"},"value":{"kind":"Variable","name":{"kind":"Name","value":"anyoneCanAdd"}}},{"kind":"Argument","name":{"kind":"Name","value":"queueMax"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueMax"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomDetailParts"},"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomCreatorPart"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"description"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomCreatorPart"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creator"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};

export function useUpdateRoomMutation() {
  return Urql.useMutation<UpdateRoomMutation, UpdateRoomMutationVariables>(UpdateRoomDocument);
};
export const UpdateRoomMembershipDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateRoomMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RoomMembership"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRoomMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}],"directives":[]}]}}]};

export function useUpdateRoomMembershipMutation() {
  return Urql.useMutation<UpdateRoomMembershipMutation, UpdateRoomMembershipMutationVariables>(UpdateRoomMembershipDocument);
};
export const DeleteRoomDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRoom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[]}]}}]};

export function useDeleteRoomMutation() {
  return Urql.useMutation<DeleteRoomMutation, DeleteRoomMutationVariables>(DeleteRoomDocument);
};
export const RoomStateDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"roomState"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"userIds"},"arguments":[],"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomRulesParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomRulesParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomState"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anyoneCanAdd"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"collabs"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"queueMax"},"arguments":[],"directives":[]}]}}]};

export function useRoomStateQuery(options: Omit<Urql.UseQueryArgs<RoomStateQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RoomStateQuery>({ query: RoomStateDocument, ...options });
};
export const OnRoomStateUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onRoomStateUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomStateUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"userIds"},"arguments":[],"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomRulesParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomRulesParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomState"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anyoneCanAdd"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"collabs"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"queueMax"},"arguments":[],"directives":[]}]}}]};

export function useOnRoomStateUpdatedSubscription<TData = OnRoomStateUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnRoomStateUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnRoomStateUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnRoomStateUpdatedSubscription, TData, OnRoomStateUpdatedSubscriptionVariables>({ query: OnRoomStateUpdatedDocument, ...options }, handler);
};
export const TrackDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"track"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uri"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"track"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uri"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uri"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"duration"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"artists"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"},"directives":[]}]}}]}}]};

export function useTrackQuery(options: Omit<Urql.UseQueryArgs<TrackQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TrackQuery>({ query: TrackDocument, ...options });
};
export const CrossTracksDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"crossTracks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"crossTracks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"originalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"youtube"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"spotify"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"duration"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"artists"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"},"directives":[]}]}}]}}]};

export function useCrossTracksQuery(options: Omit<Urql.UseQueryArgs<CrossTracksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CrossTracksQuery>({ query: CrossTracksDocument, ...options });
};
export const SearchTrackDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchTrack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlatformName"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchTrack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"duration"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"artists"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"},"directives":[]}]}}]}}]};

export function useSearchTrackQuery(options: Omit<Urql.UseQueryArgs<SearchTrackQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchTrackQuery>({ query: SearchTrackDocument, ...options });
};
export const CurrentUserDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"currentUser"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};

export function useCurrentUserQuery(options: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CurrentUserQuery>({ query: CurrentUserDocument, ...options });
};
export const UserDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"user"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
};
export const UpdateCurrentUserDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCurrentUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};

export function useUpdateCurrentUserMutation() {
  return Urql.useMutation<UpdateCurrentUserMutation, UpdateCurrentUserMutationVariables>(UpdateCurrentUserDocument);
};
export const DisconnectOAuthProviderDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"disconnectOAuthProvider"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OAuthProviderName"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMeOauth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"provider"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider"}}}],"directives":[]}]}}]};

export function useDisconnectOAuthProviderMutation() {
  return Urql.useMutation<DisconnectOAuthProviderMutation, DisconnectOAuthProviderMutationVariables>(DisconnectOAuthProviderDocument);
};
export const DeleteCurrentUserDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteCurrentUser"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMe"},"arguments":[],"directives":[]}]}}]};

export function useDeleteCurrentUserMutation() {
  return Urql.useMutation<DeleteCurrentUserMutation, DeleteCurrentUserMutationVariables>(DeleteCurrentUserDocument);
};
export const MeAuthDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"meAuth"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meAuth"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"youtube"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"spotify"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"twitter"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"facebook"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]}]}}]}}]}}]};

export function useMeAuthQuery(options: Omit<Urql.UseQueryArgs<MeAuthQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeAuthQuery>({ query: MeAuthDocument, ...options });
};