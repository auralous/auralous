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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};


export enum MessageType {
  Message = 'message',
  Join = 'join',
  Play = 'play'
}

export type Query = {
  __typename: 'Query';
  messages?: Maybe<Array<Message>>;
  notifications: Array<Notification>;
  nowPlaying?: Maybe<NowPlaying>;
  nowPlayingReactions?: Maybe<Array<NowPlayingReactionItem>>;
  queue?: Maybe<Queue>;
  story?: Maybe<Story>;
  storyUsers?: Maybe<Array<Scalars['String']>>;
  stories: Array<Story>;
  storiesOnMap: Array<Story>;
  storyLive?: Maybe<Story>;
  track?: Maybe<Track>;
  crossTracks?: Maybe<CrossTracks>;
  playlist?: Maybe<Playlist>;
  myPlaylists?: Maybe<Array<Playlist>>;
  playlistTracks: Array<Track>;
  searchTrack: Array<Track>;
  me?: Maybe<Me>;
  user?: Maybe<User>;
  userStat?: Maybe<UserStat>;
  userFollowers: Array<Scalars['String']>;
  userFollowings: Array<Scalars['String']>;
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


export type QueryQueueArgs = {
  id: Scalars['ID'];
};


export type QueryStoryArgs = {
  id: Scalars['ID'];
};


export type QueryStoryUsersArgs = {
  id: Scalars['ID'];
};


export type QueryStoriesArgs = {
  id: Scalars['ID'];
  next?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryStoriesOnMapArgs = {
  lng: Scalars['Float'];
  lat: Scalars['Float'];
  radius: Scalars['Float'];
};


export type QueryStoryLiveArgs = {
  creatorId?: Maybe<Scalars['String']>;
};


export type QueryTrackArgs = {
  id: Scalars['ID'];
};


export type QueryCrossTracksArgs = {
  id: Scalars['ID'];
};


export type QueryPlaylistArgs = {
  id: Scalars['ID'];
};


export type QueryPlaylistTracksArgs = {
  id: Scalars['ID'];
};


export type QuerySearchTrackArgs = {
  query: Scalars['String'];
};


export type QueryUserArgs = {
  username?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
};


export type QueryUserStatArgs = {
  id: Scalars['ID'];
};


export type QueryUserFollowersArgs = {
  id: Scalars['ID'];
};


export type QueryUserFollowingsArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename: 'Mutation';
  messageAdd: Scalars['Boolean'];
  notificationsMarkRead: Scalars['Int'];
  nowPlayingReact?: Maybe<Scalars['Boolean']>;
  nowPlayingSkip?: Maybe<Scalars['Boolean']>;
  queueAdd: Scalars['Boolean'];
  queueRemove: Scalars['Boolean'];
  queueReorder: Scalars['Boolean'];
  storyCreate: Story;
  storyDelete: Scalars['ID'];
  storyChangeQueueable: Scalars['Boolean'];
  storyUnlive: Story;
  storyPing: Scalars['Boolean'];
  storySendInvites: Scalars['Boolean'];
  playlistAddTracks: Scalars['Boolean'];
  playlistCreate: Playlist;
  me?: Maybe<User>;
  userFollow: Scalars['Boolean'];
  userUnfollow: Scalars['Boolean'];
  meDelete: Scalars['Boolean'];
};


export type MutationMessageAddArgs = {
  id: Scalars['ID'];
  text: Scalars['String'];
};


export type MutationNotificationsMarkReadArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationNowPlayingReactArgs = {
  id: Scalars['ID'];
  reaction: NowPlayingReactionType;
};


export type MutationNowPlayingSkipArgs = {
  id: Scalars['ID'];
};


export type MutationQueueAddArgs = {
  id: Scalars['ID'];
  tracks: Array<Scalars['ID']>;
};


export type MutationQueueRemoveArgs = {
  id: Scalars['ID'];
  trackId: Scalars['ID'];
  creatorId: Scalars['ID'];
};


export type MutationQueueReorderArgs = {
  id: Scalars['ID'];
  position: Scalars['Int'];
  insertPosition: Scalars['Int'];
};


export type MutationStoryCreateArgs = {
  text: Scalars['String'];
  isPublic: Scalars['Boolean'];
  location?: Maybe<LocationInput>;
  tracks: Array<Scalars['ID']>;
};


export type MutationStoryDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationStoryChangeQueueableArgs = {
  id: Scalars['ID'];
  userId: Scalars['String'];
  isRemoving: Scalars['Boolean'];
};


export type MutationStoryUnliveArgs = {
  id: Scalars['ID'];
};


export type MutationStoryPingArgs = {
  id: Scalars['ID'];
};


export type MutationStorySendInvitesArgs = {
  id: Scalars['ID'];
  invitedIds: Array<Scalars['String']>;
};


export type MutationPlaylistAddTracksArgs = {
  id: Scalars['ID'];
  trackIds: Array<Scalars['String']>;
};


export type MutationPlaylistCreateArgs = {
  name: Scalars['String'];
  trackIds: Array<Scalars['String']>;
};


export type MutationMeArgs = {
  name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
};


export type MutationUserFollowArgs = {
  id: Scalars['ID'];
};


export type MutationUserUnfollowArgs = {
  id: Scalars['ID'];
};

export type Subscription = {
  __typename: 'Subscription';
  messageAdded: Message;
  notificationAdded: Notification;
  nowPlayingUpdated?: Maybe<NowPlaying>;
  nowPlayingReactionsUpdated?: Maybe<Array<NowPlayingReactionItem>>;
  queueUpdated: Queue;
  storyUpdated: Story;
  storyUsersUpdated: Array<Scalars['String']>;
};


export type SubscriptionMessageAddedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionNowPlayingUpdatedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionNowPlayingReactionsUpdatedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionQueueUpdatedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionStoryUpdatedArgs = {
  id: Scalars['ID'];
};


export type SubscriptionStoryUsersUpdatedArgs = {
  id: Scalars['ID'];
};

export type Message = {
  __typename: 'Message';
  id: Scalars['ID'];
  creatorId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  text?: Maybe<Scalars['String']>;
  type: MessageType;
};

export type Notification = {
  id: Scalars['ID'];
  hasRead: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
};

export type NotificationInvite = Notification & {
  __typename: 'NotificationInvite';
  id: Scalars['ID'];
  hasRead: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  inviterId: Scalars['String'];
  storyId: Scalars['String'];
};

export type NotificationFollow = Notification & {
  __typename: 'NotificationFollow';
  id: Scalars['ID'];
  hasRead: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  followerId: Scalars['String'];
};

export type NotificationNewStory = Notification & {
  __typename: 'NotificationNewStory';
  id: Scalars['ID'];
  hasRead: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  storyId: Scalars['String'];
  creatorId: Scalars['String'];
};

export enum NowPlayingReactionType {
  Heart = 'heart',
  Joy = 'joy',
  Fire = 'fire',
  Cry = 'cry'
}

export type NowPlayingQueueItem = {
  __typename: 'NowPlayingQueueItem';
  index: Scalars['Int'];
  trackId: Scalars['ID'];
  playedAt: Scalars['DateTime'];
  endedAt: Scalars['DateTime'];
  creatorId: Scalars['ID'];
};

export type NowPlaying = {
  __typename: 'NowPlaying';
  id: Scalars['ID'];
  currentTrack?: Maybe<NowPlayingQueueItem>;
};

export type NowPlayingReactionItem = {
  __typename: 'NowPlayingReactionItem';
  userId: Scalars['String'];
  reaction: NowPlayingReactionType;
};

export type QueueItem = {
  __typename: 'QueueItem';
  trackId: Scalars['String'];
  creatorId: Scalars['String'];
};

export type Queue = {
  __typename: 'Queue';
  id: Scalars['ID'];
  items: Array<QueueItem>;
};

export type LocationInput = {
  lng: Scalars['Float'];
  lat: Scalars['Float'];
};

export type Story = {
  __typename: 'Story';
  id: Scalars['ID'];
  text: Scalars['String'];
  isPublic: Scalars['Boolean'];
  image: Scalars['String'];
  creatorId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  isLive: Scalars['Boolean'];
  queueable: Array<Scalars['String']>;
};

export enum PlatformName {
  Youtube = 'youtube',
  Spotify = 'spotify'
}

export type Track = {
  __typename: 'Track';
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
  __typename: 'CrossTracks';
  id: Scalars['ID'];
  youtube?: Maybe<Scalars['ID']>;
  spotify?: Maybe<Scalars['ID']>;
};

export type Artist = {
  __typename: 'Artist';
  id: Scalars['ID'];
  platform: PlatformName;
  externalId: Scalars['ID'];
  name: Scalars['String'];
  image: Scalars['String'];
  url: Scalars['String'];
};

export type Playlist = {
  __typename: 'Playlist';
  id: Scalars['ID'];
  platform: PlatformName;
  externalId: Scalars['ID'];
  name: Scalars['String'];
  image: Scalars['String'];
  url: Scalars['String'];
};

export type User = {
  __typename: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  profilePicture: Scalars['String'];
};

export type UserStat = {
  __typename: 'UserStat';
  id: Scalars['ID'];
  followerCount: Scalars['Int'];
  followingCount: Scalars['Int'];
};

export type Me = {
  __typename: 'Me';
  user: User;
  oauthId: Scalars['String'];
  platform: PlatformName;
  accessToken?: Maybe<Scalars['String']>;
  expiredAt?: Maybe<Scalars['DateTime']>;
};

export type MessagePartsFragment = (
  { __typename: 'Message' }
  & Pick<Message, 'id' | 'creatorId' | 'createdAt' | 'text' | 'type'>
);

export type MessagesQueryVariables = Exact<{
  id: Scalars['ID'];
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type MessagesQuery = { messages?: Maybe<Array<(
    { __typename: 'Message' }
    & MessagePartsFragment
  )>> };

export type MessageAddMutationVariables = Exact<{
  id: Scalars['ID'];
  text: Scalars['String'];
}>;


export type MessageAddMutation = Pick<Mutation, 'messageAdd'>;

export type MessageAddedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type MessageAddedSubscription = { messageAdded: (
    { __typename: 'Message' }
    & MessagePartsFragment
  ) };

export type NotificationsQueryVariables = Exact<{
  next?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
}>;


export type NotificationsQuery = { notifications: Array<(
    { __typename: 'NotificationInvite' }
    & Pick<NotificationInvite, 'storyId' | 'inviterId' | 'id' | 'createdAt' | 'hasRead'>
  ) | (
    { __typename: 'NotificationFollow' }
    & Pick<NotificationFollow, 'followerId' | 'id' | 'createdAt' | 'hasRead'>
  ) | (
    { __typename: 'NotificationNewStory' }
    & Pick<NotificationNewStory, 'storyId' | 'creatorId' | 'id' | 'createdAt' | 'hasRead'>
  )> };

export type NotificationsMarkReadMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type NotificationsMarkReadMutation = Pick<Mutation, 'notificationsMarkRead'>;

export type NotificationAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NotificationAddedSubscription = { notificationAdded: (
    { __typename: 'NotificationInvite' }
    & Pick<NotificationInvite, 'storyId' | 'inviterId' | 'id' | 'createdAt' | 'hasRead'>
  ) | (
    { __typename: 'NotificationFollow' }
    & Pick<NotificationFollow, 'followerId' | 'id' | 'createdAt' | 'hasRead'>
  ) | (
    { __typename: 'NotificationNewStory' }
    & Pick<NotificationNewStory, 'storyId' | 'creatorId' | 'id' | 'createdAt' | 'hasRead'>
  ) };

export type NowPlayingQueuePartsFragment = (
  { __typename: 'NowPlayingQueueItem' }
  & Pick<NowPlayingQueueItem, 'index' | 'trackId' | 'playedAt' | 'endedAt' | 'creatorId'>
);

export type NowPlayingQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingQuery = { nowPlaying?: Maybe<(
    { __typename: 'NowPlaying' }
    & Pick<NowPlaying, 'id'>
    & { currentTrack?: Maybe<(
      { __typename: 'NowPlayingQueueItem' }
      & NowPlayingQueuePartsFragment
    )> }
  )> };

export type NowPlayingSkipMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingSkipMutation = Pick<Mutation, 'nowPlayingSkip'>;

export type OnNowPlayingUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnNowPlayingUpdatedSubscription = { nowPlayingUpdated?: Maybe<(
    { __typename: 'NowPlaying' }
    & Pick<NowPlaying, 'id'>
    & { currentTrack?: Maybe<(
      { __typename: 'NowPlayingQueueItem' }
      & NowPlayingQueuePartsFragment
    )> }
  )> };

export type NowPlayingReactionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingReactionsQuery = { nowPlayingReactions?: Maybe<Array<(
    { __typename: 'NowPlayingReactionItem' }
    & Pick<NowPlayingReactionItem, 'reaction' | 'userId'>
  )>> };

export type NowPlayingReactionsUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingReactionsUpdatedSubscription = { nowPlayingReactionsUpdated?: Maybe<Array<(
    { __typename: 'NowPlayingReactionItem' }
    & Pick<NowPlayingReactionItem, 'reaction' | 'userId'>
  )>> };

export type NowPlayingReactMutationVariables = Exact<{
  id: Scalars['ID'];
  reaction: NowPlayingReactionType;
}>;


export type NowPlayingReactMutation = Pick<Mutation, 'nowPlayingReact'>;

export type QueueItemPartsFragment = (
  { __typename: 'QueueItem' }
  & Pick<QueueItem, 'trackId' | 'creatorId'>
);

export type QueueAddMutationVariables = Exact<{
  id: Scalars['ID'];
  tracks: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type QueueAddMutation = Pick<Mutation, 'queueAdd'>;

export type QueueRemoveMutationVariables = Exact<{
  id: Scalars['ID'];
  trackId: Scalars['ID'];
  creatorId: Scalars['ID'];
}>;


export type QueueRemoveMutation = Pick<Mutation, 'queueRemove'>;

export type QueueReorderMutationVariables = Exact<{
  id: Scalars['ID'];
  position: Scalars['Int'];
  insertPosition: Scalars['Int'];
}>;


export type QueueReorderMutation = Pick<Mutation, 'queueReorder'>;

export type QueueQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type QueueQuery = { queue?: Maybe<(
    { __typename: 'Queue' }
    & Pick<Queue, 'id'>
    & { items: Array<(
      { __typename: 'QueueItem' }
      & QueueItemPartsFragment
    )> }
  )> };

export type QueueUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type QueueUpdatedSubscription = { queueUpdated: (
    { __typename: 'Queue' }
    & Pick<Queue, 'id'>
    & { items: Array<(
      { __typename: 'QueueItem' }
      & QueueItemPartsFragment
    )> }
  ) };

export type StoryDetailPartsFragment = (
  { __typename: 'Story' }
  & Pick<Story, 'text' | 'image' | 'createdAt' | 'isPublic' | 'isLive' | 'creatorId' | 'queueable'>
);

export type StoryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StoryQuery = { story?: Maybe<(
    { __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  )> };

export type StoriesQueryVariables = Exact<{
  id: Scalars['ID'];
  next?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
}>;


export type StoriesQuery = { stories: Array<(
    { __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  )> };

export type StoriesOnMapQueryVariables = Exact<{
  lng: Scalars['Float'];
  lat: Scalars['Float'];
  radius: Scalars['Float'];
}>;


export type StoriesOnMapQuery = { storiesOnMap: Array<(
    { __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  )> };

export type StoryLiveQueryVariables = Exact<{
  creatorId?: Maybe<Scalars['String']>;
}>;


export type StoryLiveQuery = { storyLive?: Maybe<(
    { __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  )> };

export type StoryCreateMutationVariables = Exact<{
  text: Scalars['String'];
  isPublic: Scalars['Boolean'];
  location?: Maybe<LocationInput>;
  tracks: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type StoryCreateMutation = { storyCreate: (
    { __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  ) };

export type StoryChangeQueueableMutationVariables = Exact<{
  id: Scalars['ID'];
  userId: Scalars['String'];
  isRemoving: Scalars['Boolean'];
}>;


export type StoryChangeQueueableMutation = Pick<Mutation, 'storyChangeQueueable'>;

export type StoryDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StoryDeleteMutation = Pick<Mutation, 'storyDelete'>;

export type StoryUnliveMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StoryUnliveMutation = { storyUnlive: (
    { __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  ) };

export type StoryUsersQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StoryUsersQuery = Pick<Query, 'storyUsers'>;

export type StoryPingMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StoryPingMutation = Pick<Mutation, 'storyPing'>;

export type StoryUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StoryUpdatedSubscription = { storyUpdated: (
    { __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  ) };

export type StoryUsersUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StoryUsersUpdatedSubscription = Pick<Subscription, 'storyUsersUpdated'>;

export type StorySendInvitesMutationVariables = Exact<{
  id: Scalars['ID'];
  invitedIds: Array<Scalars['String']> | Scalars['String'];
}>;


export type StorySendInvitesMutation = Pick<Mutation, 'storySendInvites'>;

export type ArtistPartsFragment = (
  { __typename: 'Artist' }
  & Pick<Artist, 'id' | 'platform' | 'externalId' | 'name' | 'image' | 'url'>
);

export type TrackPartsFragment = (
  { __typename: 'Track' }
  & Pick<Track, 'id' | 'platform' | 'externalId' | 'title' | 'duration' | 'image' | 'url'>
  & { artists: Array<(
    { __typename: 'Artist' }
    & ArtistPartsFragment
  )> }
);

export type PlaylistPartsFragment = (
  { __typename: 'Playlist' }
  & Pick<Playlist, 'id' | 'platform' | 'externalId' | 'name' | 'image' | 'url'>
);

export type TrackQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type TrackQuery = { track?: Maybe<(
    { __typename: 'Track' }
    & TrackPartsFragment
  )> };

export type CrossTracksQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CrossTracksQuery = { crossTracks?: Maybe<(
    { __typename: 'CrossTracks' }
    & Pick<CrossTracks, 'id' | 'youtube' | 'spotify'>
  )> };

export type SearchTrackQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchTrackQuery = { searchTrack: Array<(
    { __typename: 'Track' }
    & TrackPartsFragment
  )> };

export type PlaylistQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PlaylistQuery = { playlist?: Maybe<(
    { __typename: 'Playlist' }
    & PlaylistPartsFragment
  )> };

export type MyPlaylistsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPlaylistsQuery = { myPlaylists?: Maybe<Array<(
    { __typename: 'Playlist' }
    & PlaylistPartsFragment
  )>> };

export type PlaylistTracksQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PlaylistTracksQuery = { playlistTracks: Array<(
    { __typename: 'Track' }
    & TrackPartsFragment
  )> };

export type PlaylistAddTracksMutationVariables = Exact<{
  id: Scalars['ID'];
  trackIds: Array<Scalars['String']> | Scalars['String'];
}>;


export type PlaylistAddTracksMutation = Pick<Mutation, 'playlistAddTracks'>;

export type PlaylistCreateMutationVariables = Exact<{
  name: Scalars['String'];
  trackIds: Array<Scalars['String']> | Scalars['String'];
}>;


export type PlaylistCreateMutation = { playlistCreate: (
    { __typename: 'Playlist' }
    & PlaylistPartsFragment
  ) };

export type UserPublicPartsFragment = (
  { __typename: 'User' }
  & Pick<User, 'id' | 'username' | 'bio' | 'profilePicture'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me?: Maybe<(
    { __typename: 'Me' }
    & Pick<Me, 'oauthId' | 'platform' | 'accessToken' | 'expiredAt'>
    & { user: (
      { __typename: 'User' }
      & UserPublicPartsFragment
    ) }
  )> };

export type UserQueryVariables = Exact<{
  username?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
}>;


export type UserQuery = { user?: Maybe<(
    { __typename: 'User' }
    & UserPublicPartsFragment
  )> };

export type UserStatQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserStatQuery = { userStat?: Maybe<(
    { __typename: 'UserStat' }
    & Pick<UserStat, 'id' | 'followerCount' | 'followingCount'>
  )> };

export type UserFollowersQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserFollowersQuery = Pick<Query, 'userFollowers'>;

export type UserFollowingsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserFollowingsQuery = Pick<Query, 'userFollowings'>;

export type UserFollowMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserFollowMutation = Pick<Mutation, 'userFollow'>;

export type UserUnfollowMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserUnfollowMutation = Pick<Mutation, 'userUnfollow'>;

export type MeUpdateMutationVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
}>;


export type MeUpdateMutation = { me?: Maybe<(
    { __typename: 'User' }
    & UserPublicPartsFragment
  )> };

export type MeDeleteMutationVariables = Exact<{ [key: string]: never; }>;


export type MeDeleteMutation = Pick<Mutation, 'meDelete'>;

export const MessagePartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]};
export const NowPlayingQueuePartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};
export const QueueItemPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};
export const StoryDetailPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};
export const ArtistPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]};
export const TrackPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]};
export const PlaylistPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]};
export const UserPublicPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]};
export const MessagesDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"messages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]};

export function useMessagesQuery(options: Omit<Urql.UseQueryArgs<MessagesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MessagesQuery>({ query: MessagesDocument, ...options });
};
export const MessageAddDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"messageAdd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageAdd"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}]}]}}]};

export function useMessageAddMutation() {
  return Urql.useMutation<MessageAddMutation, MessageAddMutationVariables>(MessageAddDocument);
};
export const MessageAddedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"messageAdded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageAdded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]};

export function useMessageAddedSubscription<TData = MessageAddedSubscription>(options: Omit<Urql.UseSubscriptionArgs<MessageAddedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<MessageAddedSubscription, TData>) {
  return Urql.useSubscription<MessageAddedSubscription, TData, MessageAddedSubscriptionVariables>({ query: MessageAddedDocument, ...options }, handler);
};
export const NotificationsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"next"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"next"},"value":{"kind":"Variable","name":{"kind":"Name","value":"next"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasRead"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationFollow"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followerId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationInvite"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyId"}},{"kind":"Field","name":{"kind":"Name","value":"inviterId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNewStory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]};

export function useNotificationsQuery(options: Omit<Urql.UseQueryArgs<NotificationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NotificationsQuery>({ query: NotificationsDocument, ...options });
};
export const NotificationsMarkReadDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"notificationsMarkRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationsMarkRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]};

export function useNotificationsMarkReadMutation() {
  return Urql.useMutation<NotificationsMarkReadMutation, NotificationsMarkReadMutationVariables>(NotificationsMarkReadDocument);
};
export const NotificationAddedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"notificationAdded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationAdded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasRead"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationFollow"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followerId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationInvite"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyId"}},{"kind":"Field","name":{"kind":"Name","value":"inviterId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNewStory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]};

export function useNotificationAddedSubscription<TData = NotificationAddedSubscription>(options: Omit<Urql.UseSubscriptionArgs<NotificationAddedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NotificationAddedSubscription, TData>) {
  return Urql.useSubscription<NotificationAddedSubscription, TData, NotificationAddedSubscriptionVariables>({ query: NotificationAddedDocument, ...options }, handler);
};
export const NowPlayingDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nowPlaying"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlaying"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentTrack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingQueueParts"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};

export function useNowPlayingQuery(options: Omit<Urql.UseQueryArgs<NowPlayingQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NowPlayingQuery>({ query: NowPlayingDocument, ...options });
};
export const NowPlayingSkipDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"nowPlayingSkip"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingSkip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useNowPlayingSkipMutation() {
  return Urql.useMutation<NowPlayingSkipMutation, NowPlayingSkipMutationVariables>(NowPlayingSkipDocument);
};
export const OnNowPlayingUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onNowPlayingUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentTrack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingQueueParts"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};

export function useOnNowPlayingUpdatedSubscription<TData = OnNowPlayingUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnNowPlayingUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnNowPlayingUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnNowPlayingUpdatedSubscription, TData, OnNowPlayingUpdatedSubscriptionVariables>({ query: OnNowPlayingUpdatedDocument, ...options }, handler);
};
export const NowPlayingReactionsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nowPlayingReactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingReactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reaction"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]};

export function useNowPlayingReactionsQuery(options: Omit<Urql.UseQueryArgs<NowPlayingReactionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NowPlayingReactionsQuery>({ query: NowPlayingReactionsDocument, ...options });
};
export const NowPlayingReactionsUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"nowPlayingReactionsUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingReactionsUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reaction"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]};

export function useNowPlayingReactionsUpdatedSubscription<TData = NowPlayingReactionsUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<NowPlayingReactionsUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NowPlayingReactionsUpdatedSubscription, TData>) {
  return Urql.useSubscription<NowPlayingReactionsUpdatedSubscription, TData, NowPlayingReactionsUpdatedSubscriptionVariables>({ query: NowPlayingReactionsUpdatedDocument, ...options }, handler);
};
export const NowPlayingReactDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"nowPlayingReact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingReactionType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingReact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"reaction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}}}]}]}}]};

export function useNowPlayingReactMutation() {
  return Urql.useMutation<NowPlayingReactMutation, NowPlayingReactMutationVariables>(NowPlayingReactDocument);
};
export const QueueAddDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"queueAdd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueAdd"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"tracks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}}}]}]}}]};

export function useQueueAddMutation() {
  return Urql.useMutation<QueueAddMutation, QueueAddMutationVariables>(QueueAddDocument);
};
export const QueueRemoveDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"queueRemove"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trackId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueRemove"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"trackId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trackId"}}},{"kind":"Argument","name":{"kind":"Name","value":"creatorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}}}]}]}}]};

export function useQueueRemoveMutation() {
  return Urql.useMutation<QueueRemoveMutation, QueueRemoveMutationVariables>(QueueRemoveDocument);
};
export const QueueReorderDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"queueReorder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"insertPosition"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueReorder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}},{"kind":"Argument","name":{"kind":"Name","value":"insertPosition"},"value":{"kind":"Variable","name":{"kind":"Name","value":"insertPosition"}}}]}]}}]};

export function useQueueReorderMutation() {
  return Urql.useMutation<QueueReorderMutation, QueueReorderMutationVariables>(QueueReorderDocument);
};
export const QueueDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"queue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QueueItemParts"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};

export function useQueueQuery(options: Omit<Urql.UseQueryArgs<QueueQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<QueueQuery>({ query: QueueDocument, ...options });
};
export const QueueUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"queueUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QueueItemParts"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};

export function useQueueUpdatedSubscription<TData = QueueUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<QueueUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<QueueUpdatedSubscription, TData>) {
  return Urql.useSubscription<QueueUpdatedSubscription, TData, QueueUpdatedSubscriptionVariables>({ query: QueueUpdatedDocument, ...options }, handler);
};
export const StoryDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"story"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"story"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useStoryQuery(options: Omit<Urql.UseQueryArgs<StoryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StoryQuery>({ query: StoryDocument, ...options });
};
export const StoriesDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"stories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"next"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"next"},"value":{"kind":"Variable","name":{"kind":"Name","value":"next"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useStoriesQuery(options: Omit<Urql.UseQueryArgs<StoriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StoriesQuery>({ query: StoriesDocument, ...options });
};
export const StoriesOnMapDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"storiesOnMap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lng"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"radius"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storiesOnMap"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lng"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lng"}}},{"kind":"Argument","name":{"kind":"Name","value":"lat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"radius"},"value":{"kind":"Variable","name":{"kind":"Name","value":"radius"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useStoriesOnMapQuery(options: Omit<Urql.UseQueryArgs<StoriesOnMapQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StoriesOnMapQuery>({ query: StoriesOnMapDocument, ...options });
};
export const StoryLiveDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"storyLive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyLive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"creatorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useStoryLiveQuery(options: Omit<Urql.UseQueryArgs<StoryLiveQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StoryLiveQuery>({ query: StoryLiveDocument, ...options });
};
export const StoryCreateDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"storyCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isPublic"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LocationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"isPublic"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isPublic"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}},{"kind":"Argument","name":{"kind":"Name","value":"tracks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useStoryCreateMutation() {
  return Urql.useMutation<StoryCreateMutation, StoryCreateMutationVariables>(StoryCreateDocument);
};
export const StoryChangeQueueableDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"storyChangeQueueable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isRemoving"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyChangeQueueable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"isRemoving"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isRemoving"}}}]}]}}]};

export function useStoryChangeQueueableMutation() {
  return Urql.useMutation<StoryChangeQueueableMutation, StoryChangeQueueableMutationVariables>(StoryChangeQueueableDocument);
};
export const StoryDeleteDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"storyDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useStoryDeleteMutation() {
  return Urql.useMutation<StoryDeleteMutation, StoryDeleteMutationVariables>(StoryDeleteDocument);
};
export const StoryUnliveDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"storyUnlive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyUnlive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useStoryUnliveMutation() {
  return Urql.useMutation<StoryUnliveMutation, StoryUnliveMutationVariables>(StoryUnliveDocument);
};
export const StoryUsersDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"storyUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useStoryUsersQuery(options: Omit<Urql.UseQueryArgs<StoryUsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StoryUsersQuery>({ query: StoryUsersDocument, ...options });
};
export const StoryPingDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"storyPing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyPing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useStoryPingMutation() {
  return Urql.useMutation<StoryPingMutation, StoryPingMutationVariables>(StoryPingDocument);
};
export const StoryUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"storyUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useStoryUpdatedSubscription<TData = StoryUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<StoryUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<StoryUpdatedSubscription, TData>) {
  return Urql.useSubscription<StoryUpdatedSubscription, TData, StoryUpdatedSubscriptionVariables>({ query: StoryUpdatedDocument, ...options }, handler);
};
export const StoryUsersUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"storyUsersUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyUsersUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useStoryUsersUpdatedSubscription<TData = StoryUsersUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<StoryUsersUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<StoryUsersUpdatedSubscription, TData>) {
  return Urql.useSubscription<StoryUsersUpdatedSubscription, TData, StoryUsersUpdatedSubscriptionVariables>({ query: StoryUsersUpdatedDocument, ...options }, handler);
};
export const StorySendInvitesDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"storySendInvites"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invitedIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storySendInvites"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invitedIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invitedIds"}}}]}]}}]};

export function useStorySendInvitesMutation() {
  return Urql.useMutation<StorySendInvitesMutation, StorySendInvitesMutationVariables>(StorySendInvitesDocument);
};
export const TrackDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"track"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"track"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}}]};

export function useTrackQuery(options: Omit<Urql.UseQueryArgs<TrackQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TrackQuery>({ query: TrackDocument, ...options });
};
export const CrossTracksDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"crossTracks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"crossTracks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"youtube"}},{"kind":"Field","name":{"kind":"Name","value":"spotify"}}]}}]}}]};

export function useCrossTracksQuery(options: Omit<Urql.UseQueryArgs<CrossTracksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CrossTracksQuery>({ query: CrossTracksDocument, ...options });
};
export const SearchTrackDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchTrack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchTrack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}}]};

export function useSearchTrackQuery(options: Omit<Urql.UseQueryArgs<SearchTrackQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchTrackQuery>({ query: SearchTrackDocument, ...options });
};
export const PlaylistDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"playlist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]};

export function usePlaylistQuery(options: Omit<Urql.UseQueryArgs<PlaylistQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PlaylistQuery>({ query: PlaylistDocument, ...options });
};
export const MyPlaylistsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myPlaylists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPlaylists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]};

export function useMyPlaylistsQuery(options: Omit<Urql.UseQueryArgs<MyPlaylistsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyPlaylistsQuery>({ query: MyPlaylistsDocument, ...options });
};
export const PlaylistTracksDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"playlistTracks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlistTracks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}}]};

export function usePlaylistTracksQuery(options: Omit<Urql.UseQueryArgs<PlaylistTracksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PlaylistTracksQuery>({ query: PlaylistTracksDocument, ...options });
};
export const PlaylistAddTracksDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"playlistAddTracks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trackIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlistAddTracks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"trackIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trackIds"}}}]}]}}]};

export function usePlaylistAddTracksMutation() {
  return Urql.useMutation<PlaylistAddTracksMutation, PlaylistAddTracksMutationVariables>(PlaylistAddTracksDocument);
};
export const PlaylistCreateDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"playlistCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trackIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlistCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"trackIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trackIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Playlist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]};

export function usePlaylistCreateMutation() {
  return Urql.useMutation<PlaylistCreateMutation, PlaylistCreateMutationVariables>(PlaylistCreateDocument);
};
export const MeDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oauthId"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]};

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const UserDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"user"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]};

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
};
export const UserStatDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userStat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userStat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}},{"kind":"Field","name":{"kind":"Name","value":"followingCount"}}]}}]}}]};

export function useUserStatQuery(options: Omit<Urql.UseQueryArgs<UserStatQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserStatQuery>({ query: UserStatDocument, ...options });
};
export const UserFollowersDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userFollowers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userFollowers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useUserFollowersQuery(options: Omit<Urql.UseQueryArgs<UserFollowersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserFollowersQuery>({ query: UserFollowersDocument, ...options });
};
export const UserFollowingsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userFollowings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userFollowings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useUserFollowingsQuery(options: Omit<Urql.UseQueryArgs<UserFollowingsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserFollowingsQuery>({ query: UserFollowingsDocument, ...options });
};
export const UserFollowDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"userFollow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userFollow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useUserFollowMutation() {
  return Urql.useMutation<UserFollowMutation, UserFollowMutationVariables>(UserFollowDocument);
};
export const UserUnfollowDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"userUnfollow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userUnfollow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useUserUnfollowMutation() {
  return Urql.useMutation<UserUnfollowMutation, UserUnfollowMutationVariables>(UserUnfollowDocument);
};
export const MeUpdateDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"meUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]};

export function useMeUpdateMutation() {
  return Urql.useMutation<MeUpdateMutation, MeUpdateMutationVariables>(MeUpdateDocument);
};
export const MeDeleteDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"meDelete"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meDelete"}}]}}]};

export function useMeDeleteMutation() {
  return Urql.useMutation<MeDeleteMutation, MeDeleteMutationVariables>(MeDeleteDocument);
};