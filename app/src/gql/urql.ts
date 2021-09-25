import { toast } from "@/components/Toast";
import i18n from "@/i18n";
import { Config } from "@/utils/constants";
import { createClient, setupExchanges, STORAGE_KEY_AUTH } from "@auralous/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        return AsyncStorage.getItem(STORAGE_KEY_AUTH);
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
