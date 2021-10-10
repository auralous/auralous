import { isTruthy } from "@/utils/utils";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";
import type { TFunction } from "react-i18next";
import { Platform } from "react-native";
import { RouteName } from "./types";

interface RouteFnParam {
  name: string;
  options: NativeStackNavigationOptions;
  component: ComponentType | LazyExoticComponent<ComponentType>;
}

export const routesFn = (t: TFunction) => {
  return (
    [
      {
        name: RouteName.Home,
        component: lazy(() => import("./Home")),
        options: { headerShown: false, title: t("home.title") },
      },
      {
        name: RouteName.Map,
        component: lazy(() => import("./Map")),
        options: {
          title: t("map.title"),
        },
      },
      {
        name: RouteName.User,
        component: lazy(() => import("./User")),
        options: {
          headerTitle: "",
          headerTransparent: true,
          title: t("user.title"),
        },
      },
      {
        name: RouteName.UserFollowers,
        component: lazy(() => import("./UserFollowersScreen")),
        options: {
          title: t("user.followers"),
        },
      },
      {
        name: RouteName.UserFollowing,
        component: lazy(() => import("./UserFollowingScreen")),
        options: {
          title: t("user.following"),
        },
      },
      {
        name: RouteName.Playlist,
        component: lazy(() => import("./Playlist")),
        options: {
          headerTitle: "",
          headerTransparent: true,
          title: t("playlist.title"),
        },
      },
      {
        name: RouteName.Session,
        component: lazy(() => import("./Session")),
        options: {
          headerTitle: "",
          headerTransparent: true,
          title: t("session.title"),
        },
      },
      {
        name: RouteName.SessionCollaborators,
        component: lazy(() => import("./SessionCollaborators")),
        options: {
          title: t("collab.title"),
        },
      },
      {
        name: RouteName.SessionInvite,
        component: lazy(() => import("./SessionInvite")),
        options: {
          headerTitle: "",
          title: "",
        },
      },
      {
        name: RouteName.SessionEdit,
        component: lazy(() => import("./SessionEdit")),
        options: {
          title: t("session_edit.title"),
        },
      },
      {
        name: RouteName.SessionListeners,
        component: lazy(() => import("./SessionListeners")),
        options: {
          title: t("session_listeners.title"),
        },
      },
      Platform.OS !== "web" && {
        name: RouteName.SignIn,
        component: lazy(() => import("./SignIn")),
        options: {
          presentation: "modal" as const,
          title: t("sign_in.title"),
          headerTransparent: true,
        },
      },
      {
        name: RouteName.NewSelectSongs,
        component: lazy(() => import("./NewSelectSongs")),
        options: {
          title: t("new.select_songs.title"),
        },
      },
      {
        name: RouteName.NewQuickShare,
        component: lazy(() => import("./NewQuickShare")),
        options: {
          title: t("new.quick_share.title"),
        },
      },
      {
        name: RouteName.NewFinal,
        component: lazy(() => import("./NewFinal")),
        options: {
          animation: "fade" as const,
          headerShown: false,
          title: t("new.final.title"),
        },
      },
      {
        name: RouteName.Settings,
        component: lazy(() => import("./Settings")),
        options: {
          title: t("settings.title"),
        },
      },
      {
        name: RouteName.Notifications,
        component: lazy(() => import("./Notifications")),
        options: {
          title: t("notifications.title"),
        },
      },
    ] as RouteFnParam[]
  ).filter(isTruthy);
};
