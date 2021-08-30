import { Provider, STORAGE_KEY_AUTH } from "@auralous/api";
import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { createUrqlClient } from "./urql";

interface ApiState {
  signIn(token: string): Promise<void>;
  signOut(): Promise<void>;
}

const ApiContext = createContext({} as ApiState);

export const ApiProvider: FC = ({ children }) => {
  const [client, setClient] = useState(createUrqlClient);
  const signIn: ApiState["signIn"] = useCallback(async (token) => {
    window.localStorage.setItem(STORAGE_KEY_AUTH, token);
    setClient(createUrqlClient());
  }, []);
  const signOut: ApiState["signOut"] = useCallback(async () => {
    window.localStorage.removeItem(STORAGE_KEY_AUTH);
    setClient(createUrqlClient());
  }, []);
  return (
    <ApiContext.Provider value={{ signIn, signOut }}>
      <Provider value={client}>{children}</Provider>
    </ApiContext.Provider>
  );
};

const authActionsSelector = (v: ApiState) => ({
  signIn: v.signIn,
  signOut: v.signOut,
});

export function useAuthActions() {
  return useContextSelector(ApiContext, authActionsSelector);
}
