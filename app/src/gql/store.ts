import { ASYNC_STORAGE_AUTH } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Client } from "@urql/core";
import create, { State } from "zustand";
import { createUrqlClient } from "./urql";

interface APIState extends State {
  client: Client;
  getAuth(): Promise<string | null>;
  signIn(token: string): Promise<void>;
  signOut(): Promise<void>;
}

export const useStoreAPI = create<APIState>((set) => ({
  client: createUrqlClient(),
  async signIn(token: string) {
    await AsyncStorage.setItem(ASYNC_STORAGE_AUTH, token);
    set({ client: createUrqlClient() });
  },
  async signOut() {
    await AsyncStorage.removeItem(ASYNC_STORAGE_AUTH);
    set({ client: createUrqlClient() });
  },
  async getAuth() {
    return AsyncStorage.getItem(ASYNC_STORAGE_AUTH);
  },
}));

export function useAuthActions() {
  return useStoreAPI((state) => ({
    signIn: state.signIn,
    signOut: state.signOut,
  }));
}
