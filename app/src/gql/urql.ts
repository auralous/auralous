import { toast } from "@/components/Toast";
import { Config } from "@/config";
import i18n from "@/i18n";
import { createClient, setupExchanges, STORAGE_KEY_AUTH } from "@auralous/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore
import sha256 from "hash.js/lib/hash/sha/256";
import { Platform } from "react-native";

const generateHash =
  Platform.OS !== "web"
    ? async (query: string) => {
        return sha256().update(query).digest("hex");
      }
    : undefined;

export const createUrqlClient = () => {
  return createClient({
    url: `${Config.API_URI}/graphql`,
    exchanges: setupExchanges({
      websocketUri: Config.WEBSOCKET_URI,
      onError(error, operation) {
        if (operation.kind === "mutation") {
          // we only show toast error for mutation
          toast.error(
            error.graphQLErrors[0]?.message ||
              "An unexpected error has occurred"
          );
        }
      },
      getToken() {
        return AsyncStorage.getItem(STORAGE_KEY_AUTH);
      },
      generateHash,
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
