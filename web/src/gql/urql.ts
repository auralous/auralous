import { createClient, setupExchanges, STORAGE_KEY_AUTH } from "@auralous/api";
import { toast } from "@auralous/ui";
import i18n from "../i18n";

export const createUrqlClient = () => {
  return createClient({
    url: `${process.env.API_URI}/graphql`,
    exchanges: setupExchanges({
      websocketUri: process.env.WEBSOCKET_URI as string,
      onError(error, operation) {
        if (operation.kind === "mutation") {
          // we only show toast error for mutation
          toast.error(error.graphQLErrors[0].message);
        }
      },
      async getToken() {
        return window.localStorage.getItem(STORAGE_KEY_AUTH);
      },
    }),
    fetchOptions() {
      return {
        headers: {
          "accept-language": i18n.language,
        },
      };
    },
  });
};
