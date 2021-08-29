import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { useMeQuery } from "@auralous/api";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";

export const useRedirectOnUnauthenticated = (
  navigation: NativeStackNavigationProp<
    ParamList,
    RouteName.NewSelectSongs | RouteName.NewQuickShare
  >
) => {
  const [{ data, fetching }] = useMeQuery();

  useEffect(() => {
    if (!data?.me && !fetching) {
      navigation.replace(RouteName.SignIn);
    }
  }, [data?.me, fetching, navigation]);
};
