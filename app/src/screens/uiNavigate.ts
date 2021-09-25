import type { UIContextValue } from "@auralous/ui";
import type { NavigationContainerRef } from "@react-navigation/native";
import type { RefObject } from "react";
import { useCallback } from "react";
import type { ParamList } from "./types";
import { RouteName } from "./types";

export const useUiNavigateFn = (
  ref: RefObject<NavigationContainerRef<ParamList>>
) => {
  return useCallback<UIContextValue["uiNavigate"]>(
    // FIXME
    (page, params: any) => {
      if (!ref.current) return;
      switch (page) {
        case "home":
          return ref.current.navigate(RouteName.Home);
        case "map":
          return ref.current.navigate(RouteName.Map);
        case "user":
          return ref.current.navigate(RouteName.User, {
            username: params.username,
          });
        case "userFollowers":
          return ref.current.navigate(RouteName.UserFollowers, {
            username: params.username,
          });
        case "userFollowing":
          return ref.current.navigate(RouteName.UserFollowing, {
            username: params.username,
          });
        case "session":
          return ref.current.navigate(RouteName.Session, {
            id: params.id,
          });
        case "sessionListeners":
          return ref.current.navigate(RouteName.SessionListeners, {
            id: params.id,
          });
        case "sessionCollaborators":
          return ref.current.navigate(RouteName.SessionCollaborators, {
            id: params.id,
          });
        case "playlist":
          return ref.current.navigate(RouteName.Playlist, {
            id: params.id,
          });
      }
    },
    [ref]
  );
};
