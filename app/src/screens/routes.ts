import { PLAYER_BAR_HEIGHT } from "@/player-components/PlayerView/PlayerBar";
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
        options: {
          headerShown: false,
          title: t("home.title"),
          animation: "none",
          headerBackVisible: false,
        },
      },
      {
        name: RouteName.Explore,
        component: lazy(() => import("./Explore")),
        options: {
          title: t("explore.title"),
          animation: "none",
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
          headerBackVisible: false,
        },
        animation: "none",
      },
      {
        name: RouteName.Map,
        component: lazy(() => import("./Map")),
        options: {
          headerShown: false,
          title: t("map.title"),
          animation: "none",
        },
      },
      {
        name: RouteName.User,
        component: lazy(() => import("./User")),
        options: {
          headerTitle: "",
          headerTransparent: true,
          title: t("user.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.UserFollowers,
        component: lazy(() => import("./UserFollowersScreen")),
        options: {
          title: t("user.followers"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.UserFollowing,
        component: lazy(() => import("./UserFollowingScreen")),
        options: {
          title: t("user.following"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.Playlist,
        component: lazy(() => import("./Playlist")),
        options: {
          headerTitle: "",
          headerTransparent: true,
          title: t("playlist.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.Session,
        component: lazy(() => import("./Session")),
        options: {
          headerTitle: "",
          headerTransparent: true,
          title: t("session.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.SessionCollaborators,
        component: lazy(() => import("./SessionCollaborators")),
        options: {
          title: t("collab.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.SessionInvite,
        component: lazy(() => import("./SessionInvite")),
        options: {
          headerTitle: "",
          title: "",
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.SessionEdit,
        component: lazy(() => import("./SessionEdit")),
        options: {
          title: t("session_edit.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.SessionListeners,
        component: lazy(() => import("./SessionListeners")),
        options: {
          title: t("session_listeners.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
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
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.Notifications,
        component: lazy(() => import("./Notifications")),
        options: {
          title: t("notifications.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
    ] as RouteFnParam[]
  ).filter(isTruthy);
};
