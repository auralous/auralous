import gql from 'graphql-tag';
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
  skipNowPlaying?: Maybe<Scalars['Boolean']>;
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


export type MutationSkipNowPlayingArgs = {
  id: Scalars['ID'];
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
  creatorId: Scalars['ID'];
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
  & Pick<NowPlayingQueueItem, 'id' | 'trackId' | 'playedAt' | 'creatorId'>
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

export type SkipNowPlayingMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SkipNowPlayingMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'skipNowPlaying'>
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
  & Pick<RoomState, 'anyoneCanAdd' | 'collabs'>
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

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
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

export type UpdateMeMutationVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  profilePicture?: Maybe<Scalars['Upload']>;
}>;


export type UpdateMeMutation = (
  { __typename?: 'Mutation' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserPublicPartsFragment
  )> }
);

export type DeleteMeOauthMutationVariables = Exact<{
  provider: OAuthProviderName;
}>;


export type DeleteMeOauthMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteMeOauth'>
);

export type DeleteMeMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteMeMutation = (
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

export const MessagePartsFragmentDoc = gql`
    fragment MessageParts on Message {
  id
  createdAt
  message
  from {
    type
    id
    name
    photo
    uri
  }
}
    `;
export const NowPlayingQueuePartsFragmentDoc = gql`
    fragment NowPlayingQueueParts on NowPlayingQueueItem {
  id
  trackId
  playedAt
  creatorId
}
    `;
export const NowPlayingReactionPartsFragmentDoc = gql`
    fragment NowPlayingReactionParts on NowPlayingReaction {
  id
  heart
  crying
  tear_joy
  fire
  mine
}
    `;
export const QueueItemPartsFragmentDoc = gql`
    fragment QueueItemParts on QueueItem {
  id
  trackId
  creatorId
}
    `;
export const RoomDetailPartsFragmentDoc = gql`
    fragment RoomDetailParts on Room {
  title
  description
  image
  createdAt
}
    `;
export const UserPublicPartsFragmentDoc = gql`
    fragment UserPublicParts on User {
  id
  username
  bio
  profilePicture
}
    `;
export const RoomCreatorPartFragmentDoc = gql`
    fragment RoomCreatorPart on Room {
  creator {
    ...UserPublicParts
  }
}
    ${UserPublicPartsFragmentDoc}`;
export const RoomRulesPartsFragmentDoc = gql`
    fragment RoomRulesParts on RoomState {
  anyoneCanAdd
  collabs
}
    `;
export const ArtistPartsFragmentDoc = gql`
    fragment ArtistParts on Artist {
  id
  platform
  externalId
  name
  image
  url
}
    `;
export const TrackPartsFragmentDoc = gql`
    fragment TrackParts on Track {
  id
  platform
  externalId
  title
  duration
  image
  url
  artists {
    ...ArtistParts
  }
}
    ${ArtistPartsFragmentDoc}`;
export const SendMessageDocument = gql`
    mutation sendMessage($roomId: ID!, $message: String!) {
  addMessage(roomId: $roomId, message: $message)
}
    `;

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument);
};
export const OnMessageAddedDocument = gql`
    subscription onMessageAdded($roomId: ID!) {
  messageAdded(roomId: $roomId) {
    ...MessageParts
  }
}
    ${MessagePartsFragmentDoc}`;

export function useOnMessageAddedSubscription<TData = OnMessageAddedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnMessageAddedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnMessageAddedSubscription, TData>) {
  return Urql.useSubscription<OnMessageAddedSubscription, TData, OnMessageAddedSubscriptionVariables>({ query: OnMessageAddedDocument, ...options }, handler);
};
export const NowPlayingDocument = gql`
    query nowPlaying($id: ID!) {
  nowPlaying(id: $id) {
    id
    currentTrack {
      ...NowPlayingQueueParts
    }
  }
}
    ${NowPlayingQueuePartsFragmentDoc}`;

export function useNowPlayingQuery(options: Omit<Urql.UseQueryArgs<NowPlayingQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NowPlayingQuery>({ query: NowPlayingDocument, ...options });
};
export const SkipNowPlayingDocument = gql`
    mutation skipNowPlaying($id: ID!) {
  skipNowPlaying(id: $id)
}
    `;

export function useSkipNowPlayingMutation() {
  return Urql.useMutation<SkipNowPlayingMutation, SkipNowPlayingMutationVariables>(SkipNowPlayingDocument);
};
export const OnNowPlayingUpdatedDocument = gql`
    subscription onNowPlayingUpdated($id: ID!) {
  nowPlayingUpdated(id: $id) {
    id
    currentTrack {
      ...NowPlayingQueueParts
    }
  }
}
    ${NowPlayingQueuePartsFragmentDoc}`;

export function useOnNowPlayingUpdatedSubscription<TData = OnNowPlayingUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnNowPlayingUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnNowPlayingUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnNowPlayingUpdatedSubscription, TData, OnNowPlayingUpdatedSubscriptionVariables>({ query: OnNowPlayingUpdatedDocument, ...options }, handler);
};
export const NowPlayingReactionsDocument = gql`
    query nowPlayingReactions($id: ID!) {
  nowPlayingReactions(id: $id) {
    ...NowPlayingReactionParts
  }
}
    ${NowPlayingReactionPartsFragmentDoc}`;

export function useNowPlayingReactionsQuery(options: Omit<Urql.UseQueryArgs<NowPlayingReactionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NowPlayingReactionsQuery>({ query: NowPlayingReactionsDocument, ...options });
};
export const OnNowPlayingReactionsUpdatedDocument = gql`
    subscription onNowPlayingReactionsUpdated($id: ID!) {
  nowPlayingReactionsUpdated(id: $id) {
    ...NowPlayingReactionParts
  }
}
    ${NowPlayingReactionPartsFragmentDoc}`;

export function useOnNowPlayingReactionsUpdatedSubscription<TData = OnNowPlayingReactionsUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnNowPlayingReactionsUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnNowPlayingReactionsUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnNowPlayingReactionsUpdatedSubscription, TData, OnNowPlayingReactionsUpdatedSubscriptionVariables>({ query: OnNowPlayingReactionsUpdatedDocument, ...options }, handler);
};
export const ReactNowPlayingDocument = gql`
    mutation reactNowPlaying($id: ID!, $reaction: NowPlayingReactionType!) {
  reactNowPlaying(id: $id, reaction: $reaction)
}
    `;

export function useReactNowPlayingMutation() {
  return Urql.useMutation<ReactNowPlayingMutation, ReactNowPlayingMutationVariables>(ReactNowPlayingDocument);
};
export const UpdateQueueDocument = gql`
    mutation updateQueue($id: ID!, $action: QueueAction!, $tracks: [ID!], $position: Int, $insertPosition: Int) {
  updateQueue(id: $id, action: $action, tracks: $tracks, position: $position, insertPosition: $insertPosition)
}
    `;

export function useUpdateQueueMutation() {
  return Urql.useMutation<UpdateQueueMutation, UpdateQueueMutationVariables>(UpdateQueueDocument);
};
export const QueueDocument = gql`
    query queue($id: ID!) {
  queue(id: $id) {
    id
    items {
      ...QueueItemParts
    }
  }
}
    ${QueueItemPartsFragmentDoc}`;

export function useQueueQuery(options: Omit<Urql.UseQueryArgs<QueueQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<QueueQuery>({ query: QueueDocument, ...options });
};
export const OnQueueUpdatedDocument = gql`
    subscription onQueueUpdated($id: ID!) {
  queueUpdated(id: $id) {
    id
    items {
      ...QueueItemParts
    }
  }
}
    ${QueueItemPartsFragmentDoc}`;

export function useOnQueueUpdatedSubscription<TData = OnQueueUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnQueueUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnQueueUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnQueueUpdatedSubscription, TData, OnQueueUpdatedSubscriptionVariables>({ query: OnQueueUpdatedDocument, ...options }, handler);
};
export const RoomDocument = gql`
    query room($id: ID!) {
  room(id: $id) {
    id
    ...RoomDetailParts
    ...RoomCreatorPart
  }
}
    ${RoomDetailPartsFragmentDoc}
${RoomCreatorPartFragmentDoc}`;

export function useRoomQuery(options: Omit<Urql.UseQueryArgs<RoomQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RoomQuery>({ query: RoomDocument, ...options });
};
export const RoomsDocument = gql`
    query rooms($creatorId: String) {
  rooms(creatorId: $creatorId) {
    id
    ...RoomDetailParts
    ...RoomCreatorPart
  }
}
    ${RoomDetailPartsFragmentDoc}
${RoomCreatorPartFragmentDoc}`;

export function useRoomsQuery(options: Omit<Urql.UseQueryArgs<RoomsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RoomsQuery>({ query: RoomsDocument, ...options });
};
export const ExploreRoomsDocument = gql`
    query exploreRooms($by: String!) {
  exploreRooms(by: $by) {
    id
    ...RoomDetailParts
    ...RoomCreatorPart
  }
}
    ${RoomDetailPartsFragmentDoc}
${RoomCreatorPartFragmentDoc}`;

export function useExploreRoomsQuery(options: Omit<Urql.UseQueryArgs<ExploreRoomsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ExploreRoomsQuery>({ query: ExploreRoomsDocument, ...options });
};
export const SearchRoomsDocument = gql`
    query searchRooms($query: String!, $limit: Int) {
  searchRooms(query: $query, limit: $limit) {
    id
    ...RoomDetailParts
    ...RoomCreatorPart
  }
}
    ${RoomDetailPartsFragmentDoc}
${RoomCreatorPartFragmentDoc}`;

export function useSearchRoomsQuery(options: Omit<Urql.UseQueryArgs<SearchRoomsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchRoomsQuery>({ query: SearchRoomsDocument, ...options });
};
export const CreateRoomDocument = gql`
    mutation createRoom($title: String!, $description: String) {
  createRoom(title: $title, description: $description) {
    id
    ...RoomDetailParts
    ...RoomCreatorPart
  }
}
    ${RoomDetailPartsFragmentDoc}
${RoomCreatorPartFragmentDoc}`;

export function useCreateRoomMutation() {
  return Urql.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument);
};
export const UpdateRoomDocument = gql`
    mutation updateRoom($id: ID!, $title: String, $description: String, $image: Upload, $anyoneCanAdd: Boolean) {
  updateRoom(id: $id, title: $title, description: $description, image: $image, anyoneCanAdd: $anyoneCanAdd) {
    id
    ...RoomDetailParts
    ...RoomCreatorPart
  }
}
    ${RoomDetailPartsFragmentDoc}
${RoomCreatorPartFragmentDoc}`;

export function useUpdateRoomMutation() {
  return Urql.useMutation<UpdateRoomMutation, UpdateRoomMutationVariables>(UpdateRoomDocument);
};
export const UpdateRoomMembershipDocument = gql`
    mutation updateRoomMembership($id: ID!, $username: String, $userId: String, $role: RoomMembership) {
  updateRoomMembership(id: $id, username: $username, userId: $userId, role: $role)
}
    `;

export function useUpdateRoomMembershipMutation() {
  return Urql.useMutation<UpdateRoomMembershipMutation, UpdateRoomMembershipMutationVariables>(UpdateRoomMembershipDocument);
};
export const DeleteRoomDocument = gql`
    mutation deleteRoom($id: ID!) {
  deleteRoom(id: $id)
}
    `;

export function useDeleteRoomMutation() {
  return Urql.useMutation<DeleteRoomMutation, DeleteRoomMutationVariables>(DeleteRoomDocument);
};
export const RoomStateDocument = gql`
    query roomState($id: ID!) {
  roomState(id: $id) {
    id
    userIds
    ...RoomRulesParts
  }
}
    ${RoomRulesPartsFragmentDoc}`;

export function useRoomStateQuery(options: Omit<Urql.UseQueryArgs<RoomStateQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RoomStateQuery>({ query: RoomStateDocument, ...options });
};
export const OnRoomStateUpdatedDocument = gql`
    subscription onRoomStateUpdated($id: ID!) {
  roomStateUpdated(id: $id) {
    id
    userIds
    ...RoomRulesParts
  }
}
    ${RoomRulesPartsFragmentDoc}`;

export function useOnRoomStateUpdatedSubscription<TData = OnRoomStateUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnRoomStateUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnRoomStateUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnRoomStateUpdatedSubscription, TData, OnRoomStateUpdatedSubscriptionVariables>({ query: OnRoomStateUpdatedDocument, ...options }, handler);
};
export const TrackDocument = gql`
    query track($uri: String, $id: ID) {
  track(uri: $uri, id: $id) {
    ...TrackParts
  }
}
    ${TrackPartsFragmentDoc}`;

export function useTrackQuery(options: Omit<Urql.UseQueryArgs<TrackQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TrackQuery>({ query: TrackDocument, ...options });
};
export const CrossTracksDocument = gql`
    query crossTracks($id: ID!) {
  crossTracks(id: $id) {
    originalId
    youtube {
      ...TrackParts
    }
    spotify {
      ...TrackParts
    }
  }
}
    ${TrackPartsFragmentDoc}`;

export function useCrossTracksQuery(options: Omit<Urql.UseQueryArgs<CrossTracksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CrossTracksQuery>({ query: CrossTracksDocument, ...options });
};
export const SearchTrackDocument = gql`
    query searchTrack($platform: PlatformName!, $query: String!) {
  searchTrack(platform: $platform, query: $query) {
    ...TrackParts
  }
}
    ${TrackPartsFragmentDoc}`;

export function useSearchTrackQuery(options: Omit<Urql.UseQueryArgs<SearchTrackQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchTrackQuery>({ query: SearchTrackDocument, ...options });
};
export const MeDocument = gql`
    query me {
  me {
    ...UserPublicParts
  }
}
    ${UserPublicPartsFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const UserDocument = gql`
    query user($username: String, $id: ID) {
  user(username: $username, id: $id) {
    ...UserPublicParts
  }
}
    ${UserPublicPartsFragmentDoc}`;

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
};
export const UpdateMeDocument = gql`
    mutation updateMe($name: String, $username: String, $profilePicture: Upload) {
  me(name: $name, username: $username, profilePicture: $profilePicture) {
    ...UserPublicParts
  }
}
    ${UserPublicPartsFragmentDoc}`;

export function useUpdateMeMutation() {
  return Urql.useMutation<UpdateMeMutation, UpdateMeMutationVariables>(UpdateMeDocument);
};
export const DeleteMeOauthDocument = gql`
    mutation deleteMeOauth($provider: OAuthProviderName!) {
  deleteMeOauth(provider: $provider)
}
    `;

export function useDeleteMeOauthMutation() {
  return Urql.useMutation<DeleteMeOauthMutation, DeleteMeOauthMutationVariables>(DeleteMeOauthDocument);
};
export const DeleteMeDocument = gql`
    mutation deleteMe {
  deleteMe
}
    `;

export function useDeleteMeMutation() {
  return Urql.useMutation<DeleteMeMutation, DeleteMeMutationVariables>(DeleteMeDocument);
};
export const MeAuthDocument = gql`
    query meAuth {
  meAuth {
    youtube {
      id
    }
    spotify {
      id
    }
    twitter {
      id
    }
    facebook {
      id
    }
  }
}
    `;

export function useMeAuthQuery(options: Omit<Urql.UseQueryArgs<MeAuthQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeAuthQuery>({ query: MeAuthDocument, ...options });
};