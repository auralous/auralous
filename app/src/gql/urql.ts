import i18n from "@/i18n";
import { ASYNC_STORAGE_AUTH } from "@/utils/auth";
import { createClient, setupExchanges } from "@auralous/api";
import { toast } from "@auralous/ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "react-native-config";

export const createUrqlClient = () => {
  return createClient({
    url: `${Config.API_URI}/graphql`,
    exchanges: setupExchanges({
      websocketUri: Config.WEBSOCKET_URI,
      onError(error, operation) {
        if (operation.kind === "mutation") {
          // we only show toast error for mutation
          toast.error(error.graphQLErrors[0].message);
        }
      },
      getToken() {
        return AsyncStorage.getItem(ASYNC_STORAGE_AUTH);
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
