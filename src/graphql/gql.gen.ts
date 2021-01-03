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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};



export enum MessageType {
  Message = 'message',
  Join = 'join',
  Play = 'play'
}

export type Query = {
  readonly __typename: 'Query';
  readonly messages?: Maybe<ReadonlyArray<Message>>;
  readonly notifications: ReadonlyArray<Notification>;
  readonly nowPlaying?: Maybe<NowPlaying>;
  readonly nowPlayingReactions?: Maybe<ReadonlyArray<NowPlayingReactionItem>>;
  readonly queue?: Maybe<Queue>;
  readonly story?: Maybe<Story>;
  readonly storyUsers?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly stories: ReadonlyArray<Story>;
  readonly storyLive?: Maybe<Story>;
  readonly track?: Maybe<Track>;
  readonly crossTracks?: Maybe<CrossTracks>;
  readonly searchTrack: ReadonlyArray<Track>;
  readonly me?: Maybe<User>;
  readonly user?: Maybe<User>;
  readonly userStat?: Maybe<UserStat>;
  readonly userFollowers: ReadonlyArray<Scalars['String']>;
  readonly userFollowings: ReadonlyArray<Scalars['String']>;
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


export type QueryStoryLiveArgs = {
  creatorId?: Maybe<Scalars['String']>;
};


export type QueryTrackArgs = {
  id: Scalars['ID'];
};


export type QueryCrossTracksArgs = {
  id: Scalars['ID'];
};


export type QuerySearchTrackArgs = {
  platform: PlatformName;
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
  readonly __typename: 'Mutation';
  readonly addMessage: Scalars['Boolean'];
  readonly readNotifications: Scalars['Int'];
  readonly reactNowPlaying?: Maybe<Scalars['Boolean']>;
  readonly skipNowPlaying?: Maybe<Scalars['Boolean']>;
  readonly updateQueue: Scalars['Boolean'];
  readonly createStory: Story;
  readonly deleteStory: Scalars['ID'];
  readonly changeStoryQueueable: Scalars['Boolean'];
  readonly unliveStory: Scalars['Boolean'];
  readonly pingStory: Scalars['Boolean'];
  readonly sendStoryInvites: Scalars['Boolean'];
  readonly me?: Maybe<User>;
  readonly followUser: Scalars['Boolean'];
  readonly unfollowUser: Scalars['Boolean'];
  readonly deleteMe: Scalars['Boolean'];
};


export type MutationAddMessageArgs = {
  id: Scalars['ID'];
  text: Scalars['String'];
};


export type MutationReadNotificationsArgs = {
  ids: ReadonlyArray<Scalars['ID']>;
};


export type MutationReactNowPlayingArgs = {
  id: Scalars['ID'];
  reaction: NowPlayingReactionType;
};


export type MutationSkipNowPlayingArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateQueueArgs = {
  id: Scalars['ID'];
  action: QueueAction;
  tracks?: Maybe<ReadonlyArray<Scalars['ID']>>;
  position?: Maybe<Scalars['Int']>;
  insertPosition?: Maybe<Scalars['Int']>;
};


export type MutationCreateStoryArgs = {
  text: Scalars['String'];
  isPublic: Scalars['Boolean'];
};


export type MutationDeleteStoryArgs = {
  id: Scalars['ID'];
};


export type MutationChangeStoryQueueableArgs = {
  id: Scalars['ID'];
  userId: Scalars['String'];
  isRemoving: Scalars['Boolean'];
};


export type MutationUnliveStoryArgs = {
  id: Scalars['ID'];
};


export type MutationPingStoryArgs = {
  id: Scalars['ID'];
};


export type MutationSendStoryInvitesArgs = {
  id: Scalars['ID'];
  invitedIds: ReadonlyArray<Scalars['String']>;
};


export type MutationMeArgs = {
  name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  profilePicture?: Maybe<Scalars['Upload']>;
};


export type MutationFollowUserArgs = {
  id: Scalars['ID'];
};


export type MutationUnfollowUserArgs = {
  id: Scalars['ID'];
};

export type Subscription = {
  readonly __typename: 'Subscription';
  readonly messageAdded: Message;
  readonly notificationAdded: Notification;
  readonly nowPlayingUpdated?: Maybe<NowPlaying>;
  readonly nowPlayingReactionsUpdated?: Maybe<ReadonlyArray<NowPlayingReactionItem>>;
  readonly queueUpdated: Queue;
  readonly storyUpdated: Story;
  readonly storyUsersUpdated: ReadonlyArray<Scalars['String']>;
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
  readonly __typename: 'Message';
  readonly id: Scalars['ID'];
  readonly creatorId: Scalars['String'];
  readonly createdAt: Scalars['DateTime'];
  readonly text?: Maybe<Scalars['String']>;
  readonly type: MessageType;
};

export type Notification = {
  readonly id: Scalars['ID'];
  readonly hasRead: Scalars['Boolean'];
  readonly createdAt: Scalars['DateTime'];
};

export type NotificationInvite = Notification & {
  readonly __typename: 'NotificationInvite';
  readonly id: Scalars['ID'];
  readonly hasRead: Scalars['Boolean'];
  readonly createdAt: Scalars['DateTime'];
  readonly inviterId: Scalars['String'];
  readonly storyId: Scalars['String'];
};

export type NotificationFollow = Notification & {
  readonly __typename: 'NotificationFollow';
  readonly id: Scalars['ID'];
  readonly hasRead: Scalars['Boolean'];
  readonly createdAt: Scalars['DateTime'];
  readonly followerId: Scalars['String'];
};

export type NotificationNewStory = Notification & {
  readonly __typename: 'NotificationNewStory';
  readonly id: Scalars['ID'];
  readonly hasRead: Scalars['Boolean'];
  readonly createdAt: Scalars['DateTime'];
  readonly storyId: Scalars['String'];
  readonly creatorId: Scalars['String'];
};

export enum NowPlayingReactionType {
  Heart = 'heart',
  Joy = 'joy',
  Fire = 'fire',
  Cry = 'cry'
}

export type NowPlayingQueueItem = {
  readonly __typename: 'NowPlayingQueueItem';
  readonly id: Scalars['ID'];
  readonly trackId: Scalars['ID'];
  readonly playedAt: Scalars['DateTime'];
  readonly endedAt: Scalars['DateTime'];
  readonly creatorId: Scalars['ID'];
};

export type NowPlaying = {
  readonly __typename: 'NowPlaying';
  readonly id: Scalars['ID'];
  readonly currentTrack?: Maybe<NowPlayingQueueItem>;
};

export type NowPlayingReactionItem = {
  readonly __typename: 'NowPlayingReactionItem';
  readonly userId: Scalars['String'];
  readonly reaction: NowPlayingReactionType;
};

export enum QueueAction {
  Remove = 'remove',
  Reorder = 'reorder',
  Add = 'add',
  Clear = 'clear'
}

export type QueueItem = {
  readonly __typename: 'QueueItem';
  readonly id: Scalars['ID'];
  readonly trackId: Scalars['String'];
  readonly creatorId: Scalars['String'];
};

export type Queue = {
  readonly __typename: 'Queue';
  readonly id: Scalars['ID'];
  readonly items: ReadonlyArray<QueueItem>;
};

export type Story = {
  readonly __typename: 'Story';
  readonly id: Scalars['ID'];
  readonly text: Scalars['String'];
  readonly isPublic: Scalars['Boolean'];
  readonly image: Scalars['String'];
  readonly creatorId: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly isLive: Scalars['Boolean'];
  readonly queueable: ReadonlyArray<Scalars['String']>;
};

export enum PlatformName {
  Youtube = 'youtube',
  Spotify = 'spotify'
}

export type Track = {
  readonly __typename: 'Track';
  readonly id: Scalars['ID'];
  readonly platform: PlatformName;
  readonly externalId: Scalars['ID'];
  readonly artists: ReadonlyArray<Artist>;
  readonly duration: Scalars['Int'];
  readonly title: Scalars['String'];
  readonly image: Scalars['String'];
  readonly url: Scalars['String'];
};

export type CrossTracks = {
  readonly __typename: 'CrossTracks';
  readonly id: Scalars['ID'];
  readonly youtube?: Maybe<Scalars['ID']>;
  readonly spotify?: Maybe<Scalars['ID']>;
};

export type Artist = {
  readonly __typename: 'Artist';
  readonly id: Scalars['ID'];
  readonly platform: PlatformName;
  readonly externalId: Scalars['ID'];
  readonly name: Scalars['String'];
  readonly image: Scalars['String'];
  readonly url: Scalars['String'];
};

export type User = {
  readonly __typename: 'User';
  readonly id: Scalars['ID'];
  readonly username: Scalars['String'];
  readonly bio?: Maybe<Scalars['String']>;
  readonly profilePicture: Scalars['String'];
};

export type UserStat = {
  readonly __typename: 'UserStat';
  readonly id: Scalars['ID'];
  readonly followerCount: Scalars['Int'];
  readonly followingCount: Scalars['Int'];
};

export type MessagePartsFragment = (
  { readonly __typename: 'Message' }
  & Pick<Message, 'id' | 'creatorId' | 'createdAt' | 'text' | 'type'>
);

export type MessagesQueryVariables = Exact<{
  id: Scalars['ID'];
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type MessagesQuery = (
  { readonly __typename: 'Query' }
  & { readonly messages?: Maybe<ReadonlyArray<(
    { readonly __typename: 'Message' }
    & MessagePartsFragment
  )>> }
);

export type AddMessageMutationVariables = Exact<{
  id: Scalars['ID'];
  text: Scalars['String'];
}>;


export type AddMessageMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'addMessage'>
);

export type OnMessageAddedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnMessageAddedSubscription = (
  { readonly __typename: 'Subscription' }
  & { readonly messageAdded: (
    { readonly __typename: 'Message' }
    & MessagePartsFragment
  ) }
);

export type NotificationsQueryVariables = Exact<{
  next?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
}>;


export type NotificationsQuery = (
  { readonly __typename: 'Query' }
  & { readonly notifications: ReadonlyArray<(
    { readonly __typename: 'NotificationInvite' }
    & Pick<NotificationInvite, 'storyId' | 'inviterId' | 'id' | 'createdAt' | 'hasRead'>
  ) | (
    { readonly __typename: 'NotificationFollow' }
    & Pick<NotificationFollow, 'followerId' | 'id' | 'createdAt' | 'hasRead'>
  ) | (
    { readonly __typename: 'NotificationNewStory' }
    & Pick<NotificationNewStory, 'storyId' | 'creatorId' | 'id' | 'createdAt' | 'hasRead'>
  )> }
);

export type ReadNotificationsMutationVariables = Exact<{
  ids: ReadonlyArray<Scalars['ID']>;
}>;


export type ReadNotificationsMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'readNotifications'>
);

export type NotificationAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NotificationAddedSubscription = (
  { readonly __typename: 'Subscription' }
  & { readonly notificationAdded: (
    { readonly __typename: 'NotificationInvite' }
    & Pick<NotificationInvite, 'storyId' | 'inviterId' | 'id' | 'createdAt' | 'hasRead'>
  ) | (
    { readonly __typename: 'NotificationFollow' }
    & Pick<NotificationFollow, 'followerId' | 'id' | 'createdAt' | 'hasRead'>
  ) | (
    { readonly __typename: 'NotificationNewStory' }
    & Pick<NotificationNewStory, 'storyId' | 'creatorId' | 'id' | 'createdAt' | 'hasRead'>
  ) }
);

export type NowPlayingQueuePartsFragment = (
  { readonly __typename: 'NowPlayingQueueItem' }
  & Pick<NowPlayingQueueItem, 'id' | 'trackId' | 'playedAt' | 'creatorId'>
);

export type NowPlayingQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingQuery = (
  { readonly __typename: 'Query' }
  & { readonly nowPlaying?: Maybe<(
    { readonly __typename: 'NowPlaying' }
    & Pick<NowPlaying, 'id'>
    & { readonly currentTrack?: Maybe<(
      { readonly __typename: 'NowPlayingQueueItem' }
      & NowPlayingQueuePartsFragment
    )> }
  )> }
);

export type SkipNowPlayingMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SkipNowPlayingMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'skipNowPlaying'>
);

export type OnNowPlayingUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnNowPlayingUpdatedSubscription = (
  { readonly __typename: 'Subscription' }
  & { readonly nowPlayingUpdated?: Maybe<(
    { readonly __typename: 'NowPlaying' }
    & Pick<NowPlaying, 'id'>
    & { readonly currentTrack?: Maybe<(
      { readonly __typename: 'NowPlayingQueueItem' }
      & NowPlayingQueuePartsFragment
    )> }
  )> }
);

export type NowPlayingReactionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingReactionsQuery = (
  { readonly __typename: 'Query' }
  & { readonly nowPlayingReactions?: Maybe<ReadonlyArray<(
    { readonly __typename: 'NowPlayingReactionItem' }
    & Pick<NowPlayingReactionItem, 'reaction' | 'userId'>
  )>> }
);

export type NowPlayingReactionsUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NowPlayingReactionsUpdatedSubscription = (
  { readonly __typename: 'Subscription' }
  & { readonly nowPlayingReactionsUpdated?: Maybe<ReadonlyArray<(
    { readonly __typename: 'NowPlayingReactionItem' }
    & Pick<NowPlayingReactionItem, 'reaction' | 'userId'>
  )>> }
);

export type ReactNowPlayingMutationVariables = Exact<{
  id: Scalars['ID'];
  reaction: NowPlayingReactionType;
}>;


export type ReactNowPlayingMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'reactNowPlaying'>
);

export type QueueItemPartsFragment = (
  { readonly __typename: 'QueueItem' }
  & Pick<QueueItem, 'id' | 'trackId' | 'creatorId'>
);

export type UpdateQueueMutationVariables = Exact<{
  id: Scalars['ID'];
  action: QueueAction;
  tracks?: Maybe<ReadonlyArray<Scalars['ID']>>;
  position?: Maybe<Scalars['Int']>;
  insertPosition?: Maybe<Scalars['Int']>;
}>;


export type UpdateQueueMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'updateQueue'>
);

export type QueueQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type QueueQuery = (
  { readonly __typename: 'Query' }
  & { readonly queue?: Maybe<(
    { readonly __typename: 'Queue' }
    & Pick<Queue, 'id'>
    & { readonly items: ReadonlyArray<(
      { readonly __typename: 'QueueItem' }
      & QueueItemPartsFragment
    )> }
  )> }
);

export type OnQueueUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnQueueUpdatedSubscription = (
  { readonly __typename: 'Subscription' }
  & { readonly queueUpdated: (
    { readonly __typename: 'Queue' }
    & Pick<Queue, 'id'>
    & { readonly items: ReadonlyArray<(
      { readonly __typename: 'QueueItem' }
      & QueueItemPartsFragment
    )> }
  ) }
);

export type StoryDetailPartsFragment = (
  { readonly __typename: 'Story' }
  & Pick<Story, 'text' | 'image' | 'createdAt' | 'isPublic' | 'isLive' | 'creatorId' | 'queueable'>
);

export type StoryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StoryQuery = (
  { readonly __typename: 'Query' }
  & { readonly story?: Maybe<(
    { readonly __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  )> }
);

export type StoriesQueryVariables = Exact<{
  id: Scalars['ID'];
  next?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
}>;


export type StoriesQuery = (
  { readonly __typename: 'Query' }
  & { readonly stories: ReadonlyArray<(
    { readonly __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  )> }
);

export type StoryLiveQueryVariables = Exact<{
  creatorId?: Maybe<Scalars['String']>;
}>;


export type StoryLiveQuery = (
  { readonly __typename: 'Query' }
  & { readonly storyLive?: Maybe<(
    { readonly __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  )> }
);

export type CreateStoryMutationVariables = Exact<{
  text: Scalars['String'];
  isPublic: Scalars['Boolean'];
}>;


export type CreateStoryMutation = (
  { readonly __typename: 'Mutation' }
  & { readonly createStory: (
    { readonly __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  ) }
);

export type ChangeStoryQueueableMutationVariables = Exact<{
  id: Scalars['ID'];
  userId: Scalars['String'];
  isRemoving: Scalars['Boolean'];
}>;


export type ChangeStoryQueueableMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'changeStoryQueueable'>
);

export type DeleteStoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteStoryMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'deleteStory'>
);

export type UnliveStoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UnliveStoryMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'unliveStory'>
);

export type StoryUsersQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StoryUsersQuery = (
  { readonly __typename: 'Query' }
  & Pick<Query, 'storyUsers'>
);

export type PingStoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PingStoryMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'pingStory'>
);

export type StoryUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StoryUpdatedSubscription = (
  { readonly __typename: 'Subscription' }
  & { readonly storyUpdated: (
    { readonly __typename: 'Story' }
    & Pick<Story, 'id'>
    & StoryDetailPartsFragment
  ) }
);

export type OnStoryUsersUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnStoryUsersUpdatedSubscription = (
  { readonly __typename: 'Subscription' }
  & Pick<Subscription, 'storyUsersUpdated'>
);

export type SendStoryInvitesMutationVariables = Exact<{
  id: Scalars['ID'];
  invitedIds: ReadonlyArray<Scalars['String']>;
}>;


export type SendStoryInvitesMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'sendStoryInvites'>
);

export type ArtistPartsFragment = (
  { readonly __typename: 'Artist' }
  & Pick<Artist, 'id' | 'platform' | 'externalId' | 'name' | 'image' | 'url'>
);

export type TrackPartsFragment = (
  { readonly __typename: 'Track' }
  & Pick<Track, 'id' | 'platform' | 'externalId' | 'title' | 'duration' | 'image' | 'url'>
  & { readonly artists: ReadonlyArray<(
    { readonly __typename: 'Artist' }
    & ArtistPartsFragment
  )> }
);

export type TrackQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type TrackQuery = (
  { readonly __typename: 'Query' }
  & { readonly track?: Maybe<(
    { readonly __typename: 'Track' }
    & TrackPartsFragment
  )> }
);

export type CrossTracksQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CrossTracksQuery = (
  { readonly __typename: 'Query' }
  & { readonly crossTracks?: Maybe<(
    { readonly __typename: 'CrossTracks' }
    & Pick<CrossTracks, 'id' | 'youtube' | 'spotify'>
  )> }
);

export type SearchTrackQueryVariables = Exact<{
  platform: PlatformName;
  query: Scalars['String'];
}>;


export type SearchTrackQuery = (
  { readonly __typename: 'Query' }
  & { readonly searchTrack: ReadonlyArray<(
    { readonly __typename: 'Track' }
    & TrackPartsFragment
  )> }
);

export type UserPublicPartsFragment = (
  { readonly __typename: 'User' }
  & Pick<User, 'id' | 'username' | 'bio' | 'profilePicture'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { readonly __typename: 'Query' }
  & { readonly me?: Maybe<(
    { readonly __typename: 'User' }
    & UserPublicPartsFragment
  )> }
);

export type UserQueryVariables = Exact<{
  username?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
}>;


export type UserQuery = (
  { readonly __typename: 'Query' }
  & { readonly user?: Maybe<(
    { readonly __typename: 'User' }
    & UserPublicPartsFragment
  )> }
);

export type UserStatQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserStatQuery = (
  { readonly __typename: 'Query' }
  & { readonly userStat?: Maybe<(
    { readonly __typename: 'UserStat' }
    & Pick<UserStat, 'id' | 'followerCount' | 'followingCount'>
  )> }
);

export type UserFollowersQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserFollowersQuery = (
  { readonly __typename: 'Query' }
  & Pick<Query, 'userFollowers'>
);

export type UserFollowingsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserFollowingsQuery = (
  { readonly __typename: 'Query' }
  & Pick<Query, 'userFollowings'>
);

export type FollowUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type FollowUserMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'followUser'>
);

export type UnfollowUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UnfollowUserMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'unfollowUser'>
);

export type UpdateMeMutationVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  profilePicture?: Maybe<Scalars['Upload']>;
}>;


export type UpdateMeMutation = (
  { readonly __typename: 'Mutation' }
  & { readonly me?: Maybe<(
    { readonly __typename: 'User' }
    & UserPublicPartsFragment
  )> }
);

export type DeleteMeMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteMeMutation = (
  { readonly __typename: 'Mutation' }
  & Pick<Mutation, 'deleteMe'>
);

export const MessagePartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]};
export const NowPlayingQueuePartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};
export const QueueItemPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};
export const StoryDetailPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};
export const ArtistPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]};
export const TrackPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]};
export const UserPublicPartsFragmentDoc: DocumentNode = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]};
export const MessagesDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"messages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]};

export function useMessagesQuery(options: Omit<Urql.UseQueryArgs<MessagesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MessagesQuery>({ query: MessagesDocument, ...options });
};
export const AddMessageDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}]}]}}]};

export function useAddMessageMutation() {
  return Urql.useMutation<AddMessageMutation, AddMessageMutationVariables>(AddMessageDocument);
};
export const OnMessageAddedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onMessageAdded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageAdded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]};

export function useOnMessageAddedSubscription<TData = OnMessageAddedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnMessageAddedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnMessageAddedSubscription, TData>) {
  return Urql.useSubscription<OnMessageAddedSubscription, TData, OnMessageAddedSubscriptionVariables>({ query: OnMessageAddedDocument, ...options }, handler);
};
export const NotificationsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"next"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"next"},"value":{"kind":"Variable","name":{"kind":"Name","value":"next"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasRead"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationFollow"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followerId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationInvite"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyId"}},{"kind":"Field","name":{"kind":"Name","value":"inviterId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNewStory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]};

export function useNotificationsQuery(options: Omit<Urql.UseQueryArgs<NotificationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NotificationsQuery>({ query: NotificationsDocument, ...options });
};
export const ReadNotificationsDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"readNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]};

export function useReadNotificationsMutation() {
  return Urql.useMutation<ReadNotificationsMutation, ReadNotificationsMutationVariables>(ReadNotificationsDocument);
};
export const NotificationAddedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"notificationAdded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationAdded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasRead"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationFollow"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followerId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationInvite"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyId"}},{"kind":"Field","name":{"kind":"Name","value":"inviterId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNewStory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]};

export function useNotificationAddedSubscription<TData = NotificationAddedSubscription>(options: Omit<Urql.UseSubscriptionArgs<NotificationAddedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NotificationAddedSubscription, TData>) {
  return Urql.useSubscription<NotificationAddedSubscription, TData, NotificationAddedSubscriptionVariables>({ query: NotificationAddedDocument, ...options }, handler);
};
export const NowPlayingDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nowPlaying"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlaying"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentTrack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingQueueParts"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};

export function useNowPlayingQuery(options: Omit<Urql.UseQueryArgs<NowPlayingQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NowPlayingQuery>({ query: NowPlayingDocument, ...options });
};
export const SkipNowPlayingDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"skipNowPlaying"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skipNowPlaying"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useSkipNowPlayingMutation() {
  return Urql.useMutation<SkipNowPlayingMutation, SkipNowPlayingMutationVariables>(SkipNowPlayingDocument);
};
export const OnNowPlayingUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onNowPlayingUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nowPlayingUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentTrack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NowPlayingQueueParts"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NowPlayingQueueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingQueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"playedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};

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
export const ReactNowPlayingDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"reactNowPlaying"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NowPlayingReactionType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reactNowPlaying"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"reaction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reaction"}}}]}]}}]};

export function useReactNowPlayingMutation() {
  return Urql.useMutation<ReactNowPlayingMutation, ReactNowPlayingMutationVariables>(ReactNowPlayingDocument);
};
export const UpdateQueueDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateQueue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"action"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QueueAction"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"insertPosition"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateQueue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"action"},"value":{"kind":"Variable","name":{"kind":"Name","value":"action"}}},{"kind":"Argument","name":{"kind":"Name","value":"tracks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tracks"}}},{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}},{"kind":"Argument","name":{"kind":"Name","value":"insertPosition"},"value":{"kind":"Variable","name":{"kind":"Name","value":"insertPosition"}}}]}]}}]};

export function useUpdateQueueMutation() {
  return Urql.useMutation<UpdateQueueMutation, UpdateQueueMutationVariables>(UpdateQueueDocument);
};
export const QueueDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"queue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QueueItemParts"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};

export function useQueueQuery(options: Omit<Urql.UseQueryArgs<QueueQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<QueueQuery>({ query: QueueDocument, ...options });
};
export const OnQueueUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onQueueUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QueueItemParts"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueItemParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trackId"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}}]}}]};

export function useOnQueueUpdatedSubscription<TData = OnQueueUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnQueueUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnQueueUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnQueueUpdatedSubscription, TData, OnQueueUpdatedSubscriptionVariables>({ query: OnQueueUpdatedDocument, ...options }, handler);
};
export const StoryDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"story"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"story"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useStoryQuery(options: Omit<Urql.UseQueryArgs<StoryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StoryQuery>({ query: StoryDocument, ...options });
};
export const StoriesDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"stories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"next"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"next"},"value":{"kind":"Variable","name":{"kind":"Name","value":"next"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useStoriesQuery(options: Omit<Urql.UseQueryArgs<StoriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StoriesQuery>({ query: StoriesDocument, ...options });
};
export const StoryLiveDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"storyLive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyLive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"creatorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creatorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useStoryLiveQuery(options: Omit<Urql.UseQueryArgs<StoryLiveQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StoryLiveQuery>({ query: StoryLiveDocument, ...options });
};
export const CreateStoryDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createStory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isPublic"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"isPublic"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isPublic"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useCreateStoryMutation() {
  return Urql.useMutation<CreateStoryMutation, CreateStoryMutationVariables>(CreateStoryDocument);
};
export const ChangeStoryQueueableDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"changeStoryQueueable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isRemoving"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeStoryQueueable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"isRemoving"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isRemoving"}}}]}]}}]};

export function useChangeStoryQueueableMutation() {
  return Urql.useMutation<ChangeStoryQueueableMutation, ChangeStoryQueueableMutationVariables>(ChangeStoryQueueableDocument);
};
export const DeleteStoryDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteStory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useDeleteStoryMutation() {
  return Urql.useMutation<DeleteStoryMutation, DeleteStoryMutationVariables>(DeleteStoryDocument);
};
export const UnliveStoryDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unliveStory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unliveStory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useUnliveStoryMutation() {
  return Urql.useMutation<UnliveStoryMutation, UnliveStoryMutationVariables>(UnliveStoryDocument);
};
export const StoryUsersDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"storyUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useStoryUsersQuery(options: Omit<Urql.UseQueryArgs<StoryUsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StoryUsersQuery>({ query: StoryUsersDocument, ...options });
};
export const PingStoryDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"pingStory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pingStory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function usePingStoryMutation() {
  return Urql.useMutation<PingStoryMutation, PingStoryMutationVariables>(PingStoryDocument);
};
export const StoryUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"storyUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoryDetailParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoryDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Story"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"creatorId"}},{"kind":"Field","name":{"kind":"Name","value":"queueable"}}]}}]};

export function useStoryUpdatedSubscription<TData = StoryUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<StoryUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<StoryUpdatedSubscription, TData>) {
  return Urql.useSubscription<StoryUpdatedSubscription, TData, StoryUpdatedSubscriptionVariables>({ query: StoryUpdatedDocument, ...options }, handler);
};
export const OnStoryUsersUpdatedDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"onStoryUsersUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storyUsersUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useOnStoryUsersUpdatedSubscription<TData = OnStoryUsersUpdatedSubscription>(options: Omit<Urql.UseSubscriptionArgs<OnStoryUsersUpdatedSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<OnStoryUsersUpdatedSubscription, TData>) {
  return Urql.useSubscription<OnStoryUsersUpdatedSubscription, TData, OnStoryUsersUpdatedSubscriptionVariables>({ query: OnStoryUsersUpdatedDocument, ...options }, handler);
};
export const SendStoryInvitesDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendStoryInvites"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invitedIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendStoryInvites"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"invitedIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invitedIds"}}}]}]}}]};

export function useSendStoryInvitesMutation() {
  return Urql.useMutation<SendStoryInvitesMutation, SendStoryInvitesMutationVariables>(SendStoryInvitesDocument);
};
export const TrackDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"track"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"track"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}}]};

export function useTrackQuery(options: Omit<Urql.UseQueryArgs<TrackQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TrackQuery>({ query: TrackDocument, ...options });
};
export const CrossTracksDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"crossTracks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"crossTracks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"youtube"}},{"kind":"Field","name":{"kind":"Name","value":"spotify"}}]}}]}}]};

export function useCrossTracksQuery(options: Omit<Urql.UseQueryArgs<CrossTracksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CrossTracksQuery>({ query: CrossTracksDocument, ...options });
};
export const SearchTrackDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchTrack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlatformName"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchTrack"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArtistParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Artist"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Track"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArtistParts"}}]}}]}}]};

export function useSearchTrackQuery(options: Omit<Urql.UseQueryArgs<SearchTrackQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchTrackQuery>({ query: SearchTrackDocument, ...options });
};
export const MeDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]};

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
export const FollowUserDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"followUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useFollowUserMutation() {
  return Urql.useMutation<FollowUserMutation, FollowUserMutationVariables>(FollowUserDocument);
};
export const UnfollowUserDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unfollowUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unfollowUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]};

export function useUnfollowUserMutation() {
  return Urql.useMutation<UnfollowUserMutation, UnfollowUserMutationVariables>(UnfollowUserDocument);
};
export const UpdateMeDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserPublicParts"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserPublicParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]};

export function useUpdateMeMutation() {
  return Urql.useMutation<UpdateMeMutation, UpdateMeMutationVariables>(UpdateMeDocument);
};
export const DeleteMeDocument: DocumentNode = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMe"}}]}}]};

export function useDeleteMeMutation() {
  return Urql.useMutation<DeleteMeMutation, DeleteMeMutationVariables>(DeleteMeDocument);
};