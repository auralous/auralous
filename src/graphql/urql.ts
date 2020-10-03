import {
  dedupExchange,
  createClient,
  subscriptionExchange,
  Exchange,
} from "urql";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import { persistedFetchExchange } from "@urql/exchange-persisted-fetch";
import { SubscriptionClient } from "benzene-ws-client";
import { pipe, onPush } from "wonka";
import { cacheExchange as createCacheExchange } from "@urql/exchange-graphcache";
import { devtoolsExchange } from "@urql/devtools";
import { default as schemaIntrospection } from "./introspection.json";
import { QUERY_MY_PLAYLISTS } from "~/graphql/playlist";
import { QUERY_ROOM } from "~/graphql/room";

const subscriptionClient =
  typeof window !== "undefined"
    ? new SubscriptionClient(process.env.WEBSOCKET_URI as string, {
        genId: (params) => params.key,
        reconnectionAttempts: Infinity,
      })
    : null;

const errorExchange: Exchange = ({ forward }) => (ops$) =>
  pipe(
    forward(ops$),
    onPush((result) => {
      if (result.error) {
        if (typeof window === "undefined" || !(window as any).toasts) return;
        const { networkError, graphQLErrors } = result.error;

        if (networkError)
          (window as any).toasts.error("Unable to connect to server.");

        graphQLErrors.forEach((error) => {
          let message = error.message;
          const code = error.extensions?.code;
          if (code === "PERSISTED_QUERY_NOT_FOUND") return;
          if (code === "UNAUTHENTICATED") message = "Please log in again.";
          (window as any).toasts.error(message);
        });
      }
    })
  );

const cacheExchange = createCacheExchange({
  schema: schemaIntrospection as any,
  keys: {
    QueueItem: () => null,
    CrossTracksWrapper: () => null,
    UserAuthWrapper: () => null,
    UserAuthInfo: () => null,
  },
  resolvers: {
    Message: {
      // @ts-ignore
      createdAt: (parent) => new Date(parent.createdAt),
    },
    NowPlayingQueueItem: {
      // @ts-ignore
      playedAt: (parent) => new Date(parent.playedAt),
    },
    Room: {
      // @ts-ignore
      createdAt: (parent) => new Date(parent.createdAt),
    },
  },
  updates: {
    Mutation: {
      createPlaylist: (result, args, cache) => {
        // @ts-ignore
        cache.updateQuery({ query: QUERY_MY_PLAYLISTS }, (data) => ({
          myPlaylists: [...(data?.myPlaylists || []), result.createPlaylist],
        }));
      },
      createRoom: (result, args, cache) => {
        if (result.createRoom) {
          cache.updateQuery(
            {
              query: QUERY_ROOM,
              // @ts-ignore
              variables: { creatorId: result.createRoom.creator.id },
            },
            // @ts-ignore
            () => ({ room: result.createRoom })
          );
        }
      },
      deleteRoom: (result, args, cache) => {
        cache.invalidate({
          __typename: "Room",
          // @ts-ignore
          id: result.deleteRoom,
        });
      },
      deleteMe: () => {
        (window as any).resetUrqlClient();
      },
      deleteMeOauth: () => {
        (window as any).resetUrqlClient();
      },
    },
  },
});

export const createUrqlClient = () =>
  createClient({
    url: `${process.env.API_URI}/graphql`,
    fetchOptions: { credentials: "include" },
    exchanges: [
      process.env.NODE_ENV !== "production" && devtoolsExchange,
      dedupExchange,
      cacheExchange,
      errorExchange,
      persistedFetchExchange({
        preferGetForPersistedQueries: true,
      }),
      multipartFetchExchange,
      subscriptionExchange({
        // @ts-ignore
        forwardSubscription(operation) {
          return subscriptionClient?.request(operation);
        },
      }),
    ].filter(Boolean) as Exchange[],
  });
