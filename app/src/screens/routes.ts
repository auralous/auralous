import { PLAYER_BAR_HEIGHT } from "@/player-components/PlayerView/PlayerBar";
import { isTruthy } from "@/utils/utils";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";
import type { TFunction } from "react-i18next";
import { Platform } from "react-native";
import SignInScreen from "./SignIn";
import { RouteName } from "./types";

interface RouteFnParam {
  name: string;
  options: NativeStackNavigationOptions;
  component: ComponentType | LazyExoticComponent<ComponentType>;
}

const HomeScreen = lazy(() => import("./Home"));
const ExploreScreen = lazy(() => import("./Explore"));
const MapScreen = lazy(() => import("./Map"));
const UserScreen = lazy(() => import("./User"));
const UserFollowersScreen = lazy(() => import("./UserFollowersScreen"));
const UserFollowingScreen = lazy(() => import("./UserFollowingScreen"));
const PlaylistScreen = lazy(() => import("./Playlist"));
const SessionScreen = lazy(() => import("./Session"));
const SessionCollaboratorsScreen = lazy(() => import("./SessionCollaborators"));
const SessionInviteScreen = lazy(() => import("./SessionInvite"));
const SessionEditScreen = lazy(() => import("./SessionEdit"));
const SessionListenersScreen = lazy(() => import("./SessionListeners"));
const NewSelectSongsScreen = lazy(() => import("./NewSelectSongs"));
const NewQuickShareScreen = lazy(() => import("./NewQuickShare"));
const NewFinalScreen = lazy(() => import("./NewFinal"));
const SettingsScreen = lazy(() => import("./Settings"));
const NotificationsScreen = lazy(() => import("./Notifications"));

export const routesFn = (t: TFunction) => {
  return (
    [
      {
        name: RouteName.Home,
        component: HomeScreen,
        options: {
          headerShown: false,
          title: t("home.title"),
          animation: "none",
          headerBackVisible: false,
        },
      },
      {
        name: RouteName.Explore,
        component: ExploreScreen,
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
        component: MapScreen,
        options: {
          headerShown: false,
          title: t("map.title"),
          animation: "none",
        },
      },
      {
        name: RouteName.User,
        component: UserScreen,
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
        component: UserFollowersScreen,
        options: {
          title: t("user.followers"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.UserFollowing,
        component: UserFollowingScreen,
        options: {
          title: t("user.following"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.Playlist,
        component: PlaylistScreen,
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
        component: SessionScreen,
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
        component: SessionCollaboratorsScreen,
        options: {
          title: t("collab.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.SessionInvite,
        component: SessionInviteScreen,
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
        component: SessionEditScreen,
        options: {
          title: t("session_edit.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.SessionListeners,
        component: SessionListenersScreen,
        options: {
          title: t("session_listeners.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      Platform.OS !== "web" && {
        name: RouteName.SignIn,
        component: SignInScreen,
        options: {
          presentation: "modal" as const,
          title: t("sign_in.title"),
          headerTransparent: true,
        },
      },
      {
        name: RouteName.NewSelectSongs,
        component: NewSelectSongsScreen,
        options: {
          title: t("new.select_songs.title"),
        },
      },
      {
        name: RouteName.NewQuickShare,
        component: NewQuickShareScreen,
        options: {
          title: t("new.quick_share.title"),
        },
      },
      {
        name: RouteName.NewFinal,
        component: NewFinalScreen,
        options: {
          animation: "fade" as const,
          headerShown: false,
          title: t("new.final.title"),
        },
      },
      {
        name: RouteName.Settings,
        component: SettingsScreen,
        options: {
          title: t("settings.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        },
      },
      {
        name: RouteName.Notifications,
        component: NotificationsScreen,
        options: {
          title: t("notifications.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
          headerBackVisible: false,
        },
      },
    ] as RouteFnParam[]
  ).filter(isTruthy);
};
