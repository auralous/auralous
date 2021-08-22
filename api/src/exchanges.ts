import { cacheExchange as createCacheExchange } from "@urql/exchange-graphcache";
import { simplePagination } from "@urql/exchange-graphcache/extras";
import {
  GraphCacheConfig,
  MeDocument,
  MeQuery,
  NowPlayingReactionsDocument,
  NowPlayingReactionsQuery,
  NowPlayingReactionsUpdatedSubscription,
  Story,
  StoryListenersDocument,
  StoryListenersQuery,
  UserFollowingsDocument,
  UserFollowingsQuery,
  UserFollowingsQueryVariables,
} from "./gql.gen";
import schema from "./introspection.gen";
import { nextCursorPagination } from "./_pagination";

export const cacheExchange = () =>
  createCacheExchange<GraphCacheConfig>({
    // @ts-ignore
    schema,
    keys: {
      QueueItem: () => null,
      Me: () => null,
      NowPlayingReactionItem: () => null,
      NowPlayingQueueItem: () => null,
      StoryCurrentLive: (data) => data.creatorId || null,
    },
    resolvers: {
      Query: {
        messages: simplePagination({
          offsetArgument: "offset",
          mergeMode: "before",
        }),
        stories: nextCursorPagination(),
        notifications: nextCursorPagination(),
        story: (parent, args) => ({ __typename: "Story", id: args.id }),
        track: (parent, args) => ({ __typename: "Track", id: args.id }),
      },
      Message: {
        createdAt: (parent) => new Date(parent.createdAt),
      },
      NowPlayingQueueItem: {
        playedAt: (parent) =>
          typeof parent.playedAt === "string"
            ? new Date(parent.playedAt)
            : null,
        endedAt: (parent) =>
          typeof parent.endedAt === "string"
            ? new Date(parent.endedAt)
            : undefined,
      },
      Story: {
        createdAt: (parent) => new Date(parent.createdAt),
      },
      NotificationFollow: {
        createdAt: (parent) => new Date(parent.createdAt),
      },
      NotificationNewStory: {
        createdAt: (parent) => new Date(parent.createdAt),
      },
    },
    updates: {
      Mutation: {
        storyCreate: (result, args, cache) => {
          if (!result.storyCreate) return;
          cache.invalidate("Query", "storyCurrentLive", {
            creatorId: (result.storyCreate as Story).creatorId,
          });
        },
        storyUnlive: (result, args, cache) => {
          if (!result.storyUnlive) return;
          cache.invalidate("Query", "storyCurrentLive", {
            creatorId: (result.storyUnlive as Story).creatorId,
          });
        },
        storyDelete: (result, args, cache) => {
          cache.invalidate({
            __typename: "Story",
            id: result.storyDelete as string,
          });
        },
        userFollow: (result, args, cache) => {
          if (!result.userFollow) return;

          const followedId = args.id as string;

          const meCache = cache.readQuery<MeQuery>({ query: MeDocument });
          // Possibly invalid state
          if (!meCache?.me)
            throw new Error("Bad state: should have been authenticated");

          // Update current user following
          cache.updateQuery<UserFollowingsQuery, UserFollowingsQueryVariables>(
            {
              query: UserFollowingsDocument,
              variables: { id: meCache.me.user.id },
            },
            (data) => ({
              userFollowings: (data?.userFollowings
                ? [followedId, ...data.userFollowings]
                : [followedId]) as string[],
            })
          );

          // Invalidate user stat of both entity
          cache.invalidate({
            __typename: "UserStat",
            id: followedId,
          });
          cache.invalidate({
            __typename: "UserStat",
            id: meCache.me.user.id,
          });
        },
        userUnfollow: (result, args, cache) => {
          if (!result.userUnfollow) return;

          const unfollowedId = args.id as string;

          const meCache = cache.readQuery<MeQuery>({ query: MeDocument });
          // Possibly invalid state
          if (!meCache?.me)
            throw new Error("Bad state: should have been authenticated");

          // Update current user following
          cache.updateQuery<UserFollowingsQuery, UserFollowingsQueryVariables>(
            {
              query: UserFollowingsDocument,
              variables: { id: meCache.me.user.id },
            },
            (data) =>
              data?.userFollowings
                ? {
                    userFollowings: data.userFollowings.filter(
                      (uf) => uf !== unfollowedId
                    ),
                  }
                : data
          );

          // Invalidate user stat of both entity
          cache.invalidate({
            __typename: "UserStat",
            id: unfollowedId,
          });
          cache.invalidate({
            __typename: "UserStat",
            id: meCache.me.user.id,
          });
        },
        playlistCreate: (result, args, cache) => {
          cache.invalidate("Query", "myPlaylists");
        },
        playlistAddTracks: (result, args, cache) => {
          cache.invalidate({ __typename: "Playlist", id: args.id });
          cache.invalidate("Query", "playlistTracks", { id: args.id });
        },
      },
      Subscription: {
        storyListenersUpdated: (result, args, cache) => {
          if (result.storyListenersUpdated) {
            cache.updateQuery<StoryListenersQuery>(
              {
                query: StoryListenersDocument,
                variables: { id: args.id },
              },
              () => ({
                storyListeners: result.storyListenersUpdated as string[],
              })
            );
          }
        },
        nowPlayingReactionsUpdated: (result, args, cache) => {
          if (result.nowPlayingReactionsUpdated) {
            cache.updateQuery<NowPlayingReactionsQuery>(
              {
                query: NowPlayingReactionsDocument,
                variables: { id: args.id },
              },
              () => ({
                nowPlayingReactions: (
                  result as NowPlayingReactionsUpdatedSubscription
                ).nowPlayingReactionsUpdated,
              })
            );
          }
        },
      },
    },
  });
