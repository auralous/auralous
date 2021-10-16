import type { LinkingOptions } from "@react-navigation/native";
import type { ParamList } from "./types";
import { RouteName } from "./types";

export const linking: LinkingOptions<ParamList> = {
  enabled: true,
  prefixes: ["auralous://"],
  config: {
    screens: {
      [RouteName.Home]: "",
      [RouteName.Explore]: "explore",
      [RouteName.Map]: "map",
      [RouteName.SignIn]: "sign-in",
      [RouteName.Settings]: "settings",
      [RouteName.Notifications]: "notifications",
      [RouteName.User]: "user/:username",
      [RouteName.Playlist]: "playlist/:id",
      [RouteName.Session]: "session/:id",
      [RouteName.SessionCollaborators]: "session/:id/collaborators",
      [RouteName.SessionInvite]: "session/:id/invite/:token",
      [RouteName.SessionEdit]: "session/:id/edit",
    },
  },
};
