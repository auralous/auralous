import { devtoolsExchange } from "@urql/devtools";
import { authExchange } from "@urql/exchange-auth";
import { cacheExchange as createCacheExchange } from "@urql/exchange-graphcache";
import { persistedFetchExchange } from "@urql/exchange-persisted-fetch";
import type { DocumentNode } from "graphql";
import { createClient as createWSClient } from "graphql-ws";
import type { CombinedError, Operation } from "urql";
import {
  dedupExchange,
  errorExchange,
  fetchExchange,
  makeOperation,
  subscriptionExchange,
} from "urql";
import type {
  GraphCacheConfig,
  MeQuery,
  NowPlayingReactionsQuery,
  NowPlayingReactionsUpdatedSubscription,
  Session,
  SessionListenersQuery,
  UserFollowingsQuery,
  UserFollowingsQueryVariables,
} from "./gql.gen";
import {
  MeDocument,
  NowPlayingReactionsDocument,
  SessionListenersDocument,
  UserFollowingsDocument,
} from "./gql.gen";
import { mongodbPagination } from "./urql-pagination-mongodb";

const cacheExchangeFn = () =>
  createCacheExchange<GraphCacheConfig>({
    keys: {
      QueueItem: () => null,
      Me: () => null,
      NowPlayingReactionItem: () => null,
      NowPlayingQueueItem: () => null,
      SessionCurrentLive: (data) => data.creatorId || null,
    },
    resolvers: {
      Query: {
        messages: mongodbPagination(),
        sessions: mongodbPagination(),
        notifications: mongodbPagination(),
        session: (parent, args) => ({ __typename: "Session", id: args.id }),
        playlist: (parent, args) => ({ __typename: "Playlist", id: args.id }),
        track: (parent, args) => ({ __typename: "Track", id: args.id }),
        recommendationSection: (parent, args) => ({
          __typename: "RecommendationSection",
          id: args.id,
        }),
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
      Session: {
        createdAt: (parent) => new Date(parent.createdAt),
      },
      NotificationFollow: {
        createdAt: (parent) => new Date(parent.createdAt),
      },
      NotificationNewSession: {
        createdAt: (parent) => new Date(parent.createdAt),
      },
    },
    updates: {
      Mutation: {
        sessionCreate: (result, args, cache) => {
          if (!result.sessionCreate) return;
          cache.invalidate("Query", "sessionCurrentLive", {
            creatorId: (result.sessionCreate as Session).creatorId,
          });
          cache.invalidate("Query", "sessionCurrentLive", {
            mine: true,
          });
        },
        sessionEnd: (result, args, cache) => {
          if (!result.sessionEnd) return;
          cache.invalidate("Query", "sessionCurrentLive", {
            creatorId: (result.sessionEnd as Session).creatorId,
          });
          cache.invalidate("Query", "sessionCurrentLive", {
            mine: true,
          });
        },
        sessionDelete: (result, args, cache) => {
          cache.invalidate({
            __typename: "Session",
            id: result.sessionDelete as string,
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
        sessionListenersUpdated: (result, args, cache) => {
          if (result.sessionListenersUpdated) {
            cache.updateQuery<SessionListenersQuery>(
              {
                query: SessionListenersDocument,
                variables: { id: args.id },
              },
              // @ts-ignore
              () => ({ sessionListeners: result.sessionListenersUpdated })
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

interface SetupExchangesOptions {
  websocketUri: string;
  onError(error: CombinedError, operation: Operation): void;
  getToken(): Promise<string | null>;
  generateHash?: (query: string, document: DocumentNode) => Promise<string>;
}

let wsClient: ReturnType<typeof createWSClient>;

export const setupExchanges = ({
  websocketUri,
  onError,
  getToken,
  generateHash,
}: SetupExchangesOptions) => {
  if (wsClient) {
    wsClient.dispose();
  }
  wsClient = createWSClient({
    async url() {
      const accessToken = await getToken();
      return `${websocketUri}/graphql-ws?access_token=${accessToken}`;
    },
  });
  return [
    ...(process.env.NODE_ENV !== "production" ? [devtoolsExchange] : []),
    dedupExchange,
    cacheExchangeFn(),
    authExchange<{ accessToken?: string | null }>({
      async getAuth({ authState }) {
        if (!authState) {
          return {
            accessToken: await getToken(),
          };
        }
        return null;
      },
      addAuthToOperation({ authState, operation }) {
        if (!authState?.accessToken) {
          return operation;
        }
        const fetchOptions =
          typeof operation.context.fetchOptions === "function"
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {};
        return makeOperation(operation.kind, operation, {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              Authorization: authState.accessToken,
            },
          },
        });
      },
    }),
    errorExchange({ onError }),
    persistedFetchExchange({
      preferGetForPersistedQueries: true,
      generateHash,
    }),
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(operation) {
        return {
          subscribe: (sink) => {
            // @ts-ignore
            const dispose = wsClient.subscribe(operation, sink);
            return {
              unsubscribe: dispose,
            };
          },
        };
      },
    }),
  ];
};
