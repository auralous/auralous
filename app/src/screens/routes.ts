import type { TFunction } from "react-i18next";
import HomeScreen from "./Home";
import MapScreen from "./Map";
import { CreateFinalScreen, QuickShareScreen, SelectSongsScreen } from "./New";
import { NotificationsScreen } from "./Notifications";
import PlaylistScreen from "./Playlist";
import {
  SessionCollaboratorsScreen,
  SessionEditScreen,
  SessionInviteScreen,
  SessionListenersScreen,
  SessionScreen,
} from "./Session";
import { SettingsScreen } from "./Settings";
import SignInScreen from "./SignIn";
import { RouteName } from "./types";
import { UserFollowersScreen, UserFollowingScreen, UserScreen } from "./User";

export const routesFn = (t: TFunction) => [
  {
    name: RouteName.Home,
    component: HomeScreen,
    options: { headerShown: false },
  },
  {
    name: RouteName.Map,
    component: MapScreen,
    options: {
      title: t("map.title"),
    },
  },
  {
    name: RouteName.User,
    component: UserScreen,
    options: {
      headerTitle: "",
      headerTransparent: true,
    },
  },
  {
    name: RouteName.UserFollowers,
    component: UserFollowersScreen,
    options: {
      title: t("user.followers"),
    },
  },
  {
    name: RouteName.UserFollowing,
    component: UserFollowingScreen,
    options: {
      title: t("user.following"),
    },
  },
  {
    name: RouteName.Playlist,
    component: PlaylistScreen,
    options: {
      headerTitle: "",
      headerTransparent: true,
    },
  },
  {
    name: RouteName.Session,
    component: SessionScreen,
    options: {
      headerTitle: "",
      headerTransparent: true,
    },
  },
  {
    name: RouteName.SessionCollaborators,
    component: SessionCollaboratorsScreen,
    options: {
      title: t("collab.title"),
    },
  },
  {
    name: RouteName.SessionInvite,
    component: SessionInviteScreen,
    options: {
      headerTitle: "",
    },
  },
  {
    name: RouteName.SessionEdit,
    component: SessionEditScreen,
    options: {
      title: t("session_edit.title"),
    },
  },
  {
    name: RouteName.SessionListeners,
    component: SessionListenersScreen,
    options: {
      title: t("session_listeners.title"),
    },
  },
  {
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
    component: SelectSongsScreen,
    options: {
      title: t("new.select_songs.title"),
    },
  },
  {
    name: RouteName.NewQuickShare,
    component: QuickShareScreen,
    options: {
      title: t("new.quick_share.title"),
    },
  },
  {
    name: RouteName.NewFinal,
    component: CreateFinalScreen,
    options: {
      animation: "fade" as const,
      headerShown: false,
    },
  },
  {
    name: RouteName.Settings,
    component: SettingsScreen,
    options: {
      title: t("settings.title"),
    },
  },
  {
    name: RouteName.Notifications,
    component: NotificationsScreen,
    options: {
      title: t("notifications.title"),
    },
  },
];
