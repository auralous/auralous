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
  _empty?: Maybe<Scalars['String']>;
  me?: Maybe<User>;
  user?: Maybe<User>;
  meAuth?: Maybe<UserAuthWrapper>;
  room?: Maybe<Room>;
  roomState?: Maybe<RoomState>;
  rooms?: Maybe<Array<Room>>;
  exploreRooms: Array<Room>;
  searchRooms: Array<Room>;
  myPlaylists?: Maybe<Array<Playlist>>;
  track?: Maybe<Track>;
  searchTrack: Array<Track>;
  queue?: Maybe<Queue>;
  nowPlaying?: Maybe<NowPlaying>;
  nowPlayingReaction?: Maybe<NowPlayingReaction>;
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


export type QueryNowPlayingReactionArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  _empty?: Maybe<Scalars['String']>;
  me?: Maybe<User>;
  deleteMe: Scalars['Boolean'];
  deleteMeOauth: Scalars['Boolean'];
  createRoom: Room;
  updateRoom: Room;
  updateRoomMembership: Scalars['Boolean'];
  deleteRoom: Scalars['ID'];
  createPlaylist: Playlist;
  insertPlaylistTracks: Playlist;
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


export type MutationCreatePlaylistArgs = {
  title: Scalars['String'];
  platform: PlatformName;
  tracks?: Maybe<Array<Scalars['String']>>;
};


export type MutationInsertPlaylistTracksArgs = {
  id: Scalars['ID'];
  tracks: Array<Scalars['String']>;
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
  _empty?: Maybe<Scalars['String']>;
  roomStateUpdated?: Maybe<RoomState>;
  messageAdded: Message;
  queueUpdated: Queue;
  nowPlayingUpdated?: Maybe<NowPlaying>;
  nowPlayingReactionUpdated?: Maybe<NowPlayingReaction>;
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


export type SubscriptionNowPlayingReactionUpdatedArgs = {
  id: Scalars['ID'];
};



export enum OAuthProviderName {
  Youtube = 'youtube',
  Twitter = 'twitter',
  Facebook = 'facebook',
  Spotify = 'spotify'
}

export type User = {
  id: Scalars['ID'];
  username: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  profilePicture: Scalars['String'];
};

export type UserAuthWrapper = {
  playingPlatform: PlatformName;
  youtube: UserAuthInfo;
  twitter: UserAuthInfo;
  facebook: UserAuthInfo;
  spotify: UserAuthInfo;
};

export type UserAuthInfo = {
  auth: Scalars['Boolean'];
  token?: Maybe<Scalars['String']>;
};

export enum RoomMembership {
  Host = 'host',
  Collab = 'collab'
}

export type Room = {
  id: Scalars['ID'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  creator: User;
  createdAt: Scalars['DateTime'];
};

export type RoomState = {
  id: Scalars['ID'];
  userIds: Array<Scalars['String']>;
  /** Settings */
  anyoneCanAdd: Scalars['Boolean'];
  collabs: Array<Scalars['String']>;
  queueMax: Scalars['Int'];
};

export type Playlist = {
  id: Scalars['ID'];
  title: Scalars['String'];
  image: Scalars['String'];
  tracks: Array<Scalars['String']>;
  platform: PlatformName;
  externalId: Scalars['String'];
};

export enum PlatformName {
  Youtube = 'youtube',
  Spotify = 'spotify'
}

export type Track = {
  id: Scalars['ID'];
  platform: PlatformName;
  externalId: Scalars['ID'];
  artists: Array<Artist>;
  duration: Scalars['Int'];
  title: Scalars['String'];
  image: Scalars['String'];
  url: Scalars['String'];
};

export type CrossTracksWrapper = {
  originalId: Scalars['ID'];
  youtube?: Maybe<Track>;
  spotify?: Maybe<Track>;
};

export type Artist = {
  id: Scalars['ID'];
  platform: PlatformName;
  externalId: Scalars['ID'];
  name: Scalars['String'];
  image: Scalars['String'];
  url: Scalars['String'];
};

export type Message = {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  message: Scalars['String'];
  from: MessageParticipant;
};

export type MessageParticipant = {
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
  id: Scalars['ID'];
  trackId: Scalars['String'];
  creatorId: Scalars['String'];
};

export type Queue = {
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
  id: Scalars['ID'];
  trackId: Scalars['ID'];
  tracks: CrossTracksWrapper;
  playedAt: Scalars['DateTime'];
};

export type NowPlaying = {
  id: Scalars['ID'];
  currentTrack?: Maybe<NowPlayingQueueItem>;
};

export type NowPlayingReaction = {
  id: Scalars['ID'];
  reactions: NowPlayingReactionCount;
  mine?: Maybe<NowPlayingReactionType>;
};

export type NowPlayingReactionCount = {
  heart: Scalars['Int'];
  crying: Scalars['Int'];
  tear_joy: Scalars['Int'];
  fire: Scalars['Int'];
};

export type MessagePartsFragment = (
  Pick<Message, 'id' | 'createdAt' | 'message'>
  & { from: Pick<MessageParticipant, 'type' | 'id' | 'name' | 'photo' | 'uri'> }
);

export type SendMessageMutationVariables = Exact<{
  roomId: Scalars['ID'];
  message: Scalars['String'];
}>;


export type SendMessageMutation = Pick<Mutation, 'addMessage'>;

export type OnMessageAddedSubscriptionVariables = Exact<{
  roomId: Scalars['ID'];
}>;


export type OnMessageAddedSubscription = { messageAdded: MessagePartsFragment };

export type NowPlayingQueuePartsFragment = (
  Pick<NowPlayingQueueItem, 'id' | 'trackId' | 'playedAt'>
  & { tracks: CrossTracksPartsFragment }
);

export type NowPlayingQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingQuery = { nowPlaying?: Maybe<(
    Pick<NowPlaying, 'id'>
    & { currentTrack?: Maybe<NowPlayingQueuePartsFragment> }
  )> };

export type OnNowPlayingUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnNowPlayingUpdatedSubscription = { nowPlayingUpdated?: Maybe<(
    Pick<NowPlaying, 'id'>
    & { currentTrack?: Maybe<NowPlayingQueuePartsFragment> }
  )> };

export type NowPlayingReactionPartsFragment = (
  Pick<NowPlayingReaction, 'id' | 'mine'>
  & { reactions: Pick<NowPlayingReactionCount, 'heart' | 'crying' | 'tear_joy' | 'fire'> }
);

export type NowPlayingReactionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingReactionQuery = { nowPlayingReaction?: Maybe<NowPlayingReactionPartsFragment> };

export type OnNowPlayingReactionUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnNowPlayingReactionUpdatedSubscription = { nowPlayingReactionUpdated?: Maybe<NowPlayingReactionPartsFragment> };

export type ReactNowPlayingMutationVariables = Exact<{
  id: Scalars['ID'];
  reaction: NowPlayingReactionType;
}>;


export type ReactNowPlayingMutation = Pick<Mutation, 'reactNowPlaying'>;

export type PlaylistDetailPartsFragment = Pick<Playlist, 'title' | 'image' | 'platform' | 'externalId'>;

export type MyPlaylistsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPlaylistsQuery = { myPlaylists?: Maybe<Array<(
    Pick<Playlist, 'id' | 'tracks'>
    & PlaylistDetailPartsFragment
  )>> };

export type CreatePlaylistMutationVariables = Exact<{
  title: Scalars['String'];
  platform: PlatformName;
  tracks?: Maybe<Array<Scalars['String']>>;
}>;


export type CreatePlaylistMutation = { createPlaylist: (
    Pick<Playlist, 'id' | 'tracks'>
    & PlaylistDetailPartsFragment
  ) };

export type InsertPlaylistTracksMutationVariables = Exact<{
  id: Scalars['ID'];
  tracks: Array<Scalars['String']>;
}>;


export type InsertPlaylistTracksMutation = { insertPlaylistTracks: (
    Pick<Playlist, 'id' | 'tracks'>
    & PlaylistDetailPartsFragment
  ) };

export type QueueItemPartsFragment = Pick<QueueItem, 'id' | 'trackId' | 'creatorId'>;

export type UpdateQueueMutationVariables = Exact<{
  id: Scalars['ID'];
  action: QueueAction;
  tracks?: Maybe<Array<Scalars['ID']>>;
  position?: Maybe<Scalars['Int']>;
  insertPosition?: Maybe<Scalars['Int']>;
}>;


export type UpdateQueueMutation = Pick<Mutation, 'updateQueue'>;

export type QueueQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type QueueQuery = { queue?: Maybe<(
    Pick<Queue, 'id'>
    & { items: Array<QueueItemPartsFragment> }
  )> };

export type OnQueueUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnQueueUpdatedSubscription = { queueUpdated: (
    Pick<Queue, 'id'>
    & { items: Array<QueueItemPartsFragment> }
  ) };

export type RoomDetailPartsFragment = Pick<Room, 'title' | 'description' | 'image' | 'createdAt'>;

export type RoomCreatorPartFragment = { creator: UserPublicPartsFragment };

export type RoomRulesPartsFragment = Pick<RoomState, 'anyoneCanAdd' | 'collabs' | 'queueMax'>;

export type RoomQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RoomQuery = { room?: Maybe<(
    Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  )> };

export type RoomsQueryVariables = Exact<{
  creatorId?: Maybe<Scalars['String']>;
}>;


export type RoomsQuery = { rooms?: Maybe<Array<(
    Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  )>> };

export type ExploreRoomsQueryVariables = Exact<{
  by: Scalars['String'];
}>;


export type ExploreRoomsQuery = { exploreRooms: Array<(
    Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  )> };

export type SearchRoomsQueryVariables = Exact<{
  query: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
}>;


export type SearchRoomsQuery = { searchRooms: Array<(
    Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  )> };

export type CreateRoomMutationVariables = Exact<{
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
}>;


export type CreateRoomMutation = { createRoom: (
    Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  ) };

export type UpdateRoomMutationVariables = Exact<{
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['Upload']>;
  anyoneCanAdd?: Maybe<Scalars['Boolean']>;
  queueMax?: Maybe<Scalars['Int']>;
}>;


export type UpdateRoomMutation = { updateRoom: (
    Pick<Room, 'id'>
    & RoomDetailPartsFragment
    & RoomCreatorPartFragment
  ) };

export type UpdateRoomMembershipMutationVariables = Exact<{
  id: Scalars['ID'];
  username?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  role?: Maybe<RoomMembership>;
}>;


export type UpdateRoomMembershipMutation = Pick<Mutation, 'updateRoomMembership'>;

export type DeleteRoomMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteRoomMutation = Pick<Mutation, 'deleteRoom'>;

export type RoomStateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RoomStateQuery = { roomState?: Maybe<(
    Pick<RoomState, 'id' | 'userIds'>
    & RoomRulesPartsFragment
  )> };

export type OnRoomStateUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnRoomStateUpdatedSubscription = { roomStateUpdated?: Maybe<(
    Pick<RoomState, 'id' | 'userIds'>
    & RoomRulesPartsFragment
  )> };

export type ArtistPartsFragment = Pick<Artist, 'id' | 'platform' | 'externalId' | 'name' | 'image' | 'url'>;

export type TrackPartsFragment = (
  Pick<Track, 'id' | 'platform' | 'externalId' | 'title' | 'duration' | 'image' | 'url'>
  & { artists: Array<ArtistPartsFragment> }
);

export type CrossTracksPartsFragment = (
  Pick<CrossTracksWrapper, 'originalId'>
  & { youtube?: Maybe<TrackPartsFragment>, spotify?: Maybe<TrackPartsFragment> }
);

export type TrackQueryVariables = Exact<{
  uri?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
}>;


export type TrackQuery = { track?: Maybe<TrackPartsFragment> };

export type SearchTrackQueryVariables = Exact<{
  platform: PlatformName;
  query: Scalars['String'];
}>;


export type SearchTrackQuery = { searchTrack: Array<TrackPartsFragment> };

export type UserPublicPartsFragment = Pick<User, 'id' | 'username' | 'bio' | 'profilePicture'>;

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { me?: Maybe<UserPublicPartsFragment> };

export type UserQueryVariables = Exact<{
  username?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
}>;


export type UserQuery = { user?: Maybe<UserPublicPartsFragment> };

export type UpdateCurrentUserMutationVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  profilePicture?: Maybe<Scalars['Upload']>;
}>;


export type UpdateCurrentUserMutation = { me?: Maybe<UserPublicPartsFragment> };

export type DisconnectOAuthProviderMutationVariables = Exact<{
  provider: OAuthProviderName;
}>;


export type DisconnectOAuthProviderMutation = Pick<Mutation, 'deleteMeOauth'>;

export type DeleteCurrentUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteCurrentUserMutation = Pick<Mutation, 'deleteMe'>;

export type MeAuthQueryVariables = Exact<{ [key: string]: never; }>;


export type MeAuthQuery = { meAuth?: Maybe<(
    Pick<UserAuthWrapper, 'playingPlatform'>
    & { youtube: Pick<UserAuthInfo, 'auth' | 'token'>, twitter: Pick<UserAuthInfo, 'auth'>, facebook: Pick<UserAuthInfo, 'auth'>, spotify: Pick<UserAuthInfo, 'auth' | 'token'> }
  )> };

export const MessagePartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"message"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"from"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"photo"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"uri"},"arguments":[],"directives":[]}]}}]}}]};
export const ArtistPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}}]};
export const TrackPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"duration"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"artists"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}}]};
export const CrossTracksPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CrossTracksParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CrossTracksWrapper"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"originalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"youtube"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"spotify"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"duration"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"artists"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"},"directives":[]}]}}]}}]};
export const NowPlayingQueuePartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"trackId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tracks"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CrossTracksParts"},"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"duration"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"artists"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CrossTracksParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CrossTracksWrapper"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"originalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"youtube"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"spotify"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}}]}}]};
export const NowPlayingReactionPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingReactionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingReaction"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"heart"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"crying"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tear_joy"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"fire"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"mine"},"arguments":[],"directives":[]}]}}]};
export const PlaylistDetailPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]}]}}]};
export const QueueItemPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"trackId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"creatorId"},"arguments":[],"directives":[]}]}}]};
export const RoomDetailPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"description"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]}]}}]};
export const UserPublicPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};
export const RoomCreatorPartFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomCreatorPart"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creator"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bio"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"arguments":[],"directives":[]}]}}]};
export const RoomRulesPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomRulesParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RoomState"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anyoneCanAdd"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"collabs"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"queueMax"},"arguments":[],"directives":[]}]}}]};
export const SendMessageDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"message"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}}],"directives":[]}]}}]};

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument);
};
export const OnMessageAddedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onMessageAdded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageAdded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"message"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"from"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"photo"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"uri"},"arguments":[],"directives":[]}]}}]}}]};

export function useOnMessageAddedSubscription<TData = OnMessageAddedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnMessageAddedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnMessageAddedSubscription, TData>) {
  return Urql.useSubscription<OnMessageAddedSubscription, TData, OnMessageAddedSubscriptionVariables>({ query: OnMessageAddedDocument, ...options }, handler);
};
export const NowPlayingDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nowPlaying"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlaying"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"currentTrack"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingQueueParts"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"trackId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tracks"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CrossTracksParts"},"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"duration"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"artists"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CrossTracksParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CrossTracksWrapper"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"originalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"youtube"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"spotify"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}}]}}]};

export function useNowPlayingQuery(options: Omit<Urql.UseQueryArgs<NowPlayingQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NowPlayingQuery>({ query: NowPlayingDocument, ...options });
};
export const OnNowPlayingUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onNowPlayingUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"currentTrack"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingQueueParts"},"directives":[]}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"trackId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tracks"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CrossTracksParts"},"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"duration"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"artists"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CrossTracksParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CrossTracksWrapper"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"originalId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"youtube"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"spotify"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"},"directives":[]}]}}]}}]};

export function useOnNowPlayingUpdatedSubscription<TData = OnNowPlayingUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnNowPlayingUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnNowPlayingUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnNowPlayingUpdatedSubscription, TData, OnNowPlayingUpdatedSubscriptionVariables>({ query: OnNowPlayingUpdatedDocument, ...options }, handler);
};
export const NowPlayingReactionDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nowPlayingReaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingReaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingReactionParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingReactionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingReaction"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"heart"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"crying"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tear_joy"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"fire"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"mine"},"arguments":[],"directives":[]}]}}]};

export function useNowPlayingReactionQuery(options: Omit<Urql.UseQueryArgs<NowPlayingReactionQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NowPlayingReactionQuery>({ query: NowPlayingReactionDocument, ...options });
};
export const OnNowPlayingReactionUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onNowPlayingReactionUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingReactionUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingReactionParts"},"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingReactionParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingReaction"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"heart"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"crying"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tear_joy"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"fire"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"mine"},"arguments":[],"directives":[]}]}}]};

export function useOnNowPlayingReactionUpdatedSubscription<TData = OnNowPlayingReactionUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnNowPlayingReactionUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnNowPlayingReactionUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnNowPlayingReactionUpdatedSubscription, TData, OnNowPlayingReactionUpdatedSubscriptionVariables>({ query: OnNowPlayingReactionUpdatedDocument, ...options }, handler);
};
export const ReactNowPlayingDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"reactNowPlaying"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingReactionType"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reactNowPlaying"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"reaction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}}}],"directives":[]}]}}]};

export function useReactNowPlayingMutation() {
  return Urql.useMutation<ReactNowPlayingMutation, ReactNowPlayingMutationVariables>(ReactNowPlayingDocument);
};
export const MyPlaylistsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myPlaylists"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPlaylists"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistDetailParts"},"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tracks"},"arguments":[],"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]}]}}]};

export function useMyPlaylistsQuery(options: Omit<Urql.UseQueryArgs<MyPlaylistsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyPlaylistsQuery>({ query: MyPlaylistsDocument, ...options });
};
export const CreatePlaylistDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createPlaylist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlatformName"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlaylist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"tracks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistDetailParts"},"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tracks"},"arguments":[],"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]}]}}]};

export function useCreatePlaylistMutation() {
  return Urql.useMutation<CreatePlaylistMutation, CreatePlaylistMutationVariables>(CreatePlaylistDocument);
};
export const InsertPlaylistTracksDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertPlaylistTracks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertPlaylistTracks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"tracks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistDetailParts"},"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tracks"},"arguments":[],"directives":[]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"platform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"externalId"},"arguments":[],"directives":[]}]}}]};

export function useInsertPlaylistTracksMutation() {
  return Urql.useMutation<InsertPlaylistTracksMutation, InsertPlaylistTracksMutationVariables>(InsertPlaylistTracksDocument);
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
export const MeAuthDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"meAuth"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meAuth"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playingPlatform"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"youtube"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auth"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"token"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"twitter"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auth"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"facebook"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auth"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"spotify"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auth"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"token"},"arguments":[],"directives":[]}]}}]}}]}}]};

export function useMeAuthQuery(options: Omit<Urql.UseQueryArgs<MeAuthQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeAuthQuery>({ query: MeAuthDocument, ...options });
};