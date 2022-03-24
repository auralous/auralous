import player from "@/player";
import { Provider, STORAGE_KEY_AUTH } from "@auralous/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { FC } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createUrqlClient } from "./urql";

interface ApiState {
  signIn(token: string): Promise<void>;
  signOut(): Promise<void>;
}

const ApiContext = createContext({} as ApiState);

export const ApiProvider: FC = ({ children }) => {
  const [client, setClient] = useState(createUrqlClient);
  useEffect(() => {
    player.gqlClient = client;
  }, [client]);

  const authAction = useMemo<ApiState>(
    () => ({
      async signIn(token) {
        await AsyncStorage.setItem(STORAGE_KEY_AUTH, token);
        setClient(createUrqlClient());
      },
      async signOut() {
        await AsyncStorage.removeItem(STORAGE_KEY_AUTH);
        setClient(createUrqlClient());
      },
    }),
    []
  );

  return (
    <ApiContext.Provider value={authAction}>
      <Provider value={client}>{children}</Provider>
    </ApiContext.Provider>
  );
};

export function useAuthActions() {
  return useContext(ApiContext);
}
