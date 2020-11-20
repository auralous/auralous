import {
  dedupExchange,
  createClient,
  subscriptionExchange,
  Exchange,
} from "urql";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import { persistedFetchExchange } from "@urql/exchange-persisted-fetch";
import { simplePagination } from "./exchanges/simplePagination";
import { refocusExchange } from "@urql/exchange-refocus";
import { SubscriptionClient } from "benzene-ws-client";
import { pipe, onPush } from "wonka";
import { cacheExchange as createCacheExchange } from "@urql/exchange-graphcache";
import { devtoolsExchange } from "@urql/devtools";
// import { default as schemaIntrospection } from "./introspection.json";
import { Room, RoomDocument } from "~/graphql/gql.gen";
import { t } from "~/i18n/index";

const subscriptionClient =
  typeof window !== "undefined"
    ? new SubscriptionClient(`${process.env.WEBSOCKET_URI}/graphql`, {
        genId: (params) => params.key,
        reconnectionAttempts: Infinity,
      })
    : null;

const errorExchange: Exchange = ({ forward }) => (ops$) =>
  pipe(
    forward(ops$),
    onPush((result) => {
      if (result.error) {
        if (typeof window === "undefined" || !window.toasts) return;
        const { networkError, graphQLErrors } = result.error;

        if (networkError) window.toasts.error("Unable to connect to server.");

        graphQLErrors.forEach((error) => {
          let message = error.message;
          const code = error.extensions?.code;
          if (code === "PERSISTED_QUERY_NOT_FOUND") return;
          if (message.startsWith("Internal error:")) {
            // We log this error to console so dev can look into it
            console.error(error);
            message = t("error.internalError");
          }
          if (code === "UNAUTHENTICATED") message = t("error.authenticated");
          window.toasts.error(message);
        });
      }
    })
  );

const cacheExchange = createCacheExchange({
  // schema: schemaIntrospection as any,
  keys: {
    QueueItem: () => null,
  },
  resolvers: {
    Query: {
      messages: simplePagination({
        offsetArgument: "offset",
        mergeMode: "before",
      }),
    },
    Message: {
      // @ts-ignore
      createdAt: (parent) => new Date(parent.createdAt),
    },
    NowPlayingQueueItem: {
      playedAt: (parent) =>
        typeof parent.playedAt === "string" ? new Date(parent.playedAt) : null,
      endedAt: (parent) =>
        typeof parent.endedAt === "string"
          ? new Date(parent.endedAt)
          : undefined,
    },
    Room: {
      // @ts-ignore
      createdAt: (parent: Room) => new Date(parent.createdAt),
    },
  },
  updates: {
    Mutation: {
      createRoom: (result, args, cache) => {
        if (result.createRoom) {
          cache.updateQuery(
            {
              query: RoomDocument,
              // @ts-ignore
              variables: { creatorId: result.createRoom.creatorId },
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
        window.resetUrqlClient();
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
      typeof window !== "undefined" && refocusExchange(),
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
