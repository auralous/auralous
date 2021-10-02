import type { TFunction } from "react-i18next";
import HomeScreen from "./Home";
import MapScreen from "./Map";
import NewFinalScreen from "./NewFinal";
import NewQuickShareScreen from "./NewQuickShare";
import NewSelectSongsScreen from "./NewSelectSongs";
import { NotificationsScreen } from "./Notifications";
import PlaylistScreen from "./Playlist";
import SessionScreen from "./Session";
import SessionCollaboratorsScreen from "./SessionCollaborators";
import SessionEditScreen from "./SessionEdit";
import SessionInviteScreen from "./SessionInvite";
import SessionListenersScreen from "./SessionListeners";
import { SettingsScreen } from "./Settings";
import SignInScreen from "./SignIn";
import { RouteName } from "./types";
import UserScreen from "./User";
import UserFollowersScreen from "./UserFollowersScreen";
import UserFollowingScreen from "./UserFollowingScreen";

export const routesFn = (t: TFunction) => [
  {
    name: RouteName.Home,
    component: HomeScreen,
    options: { headerShown: false, title: t("home.title") },
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
      title: t("user.title"),
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
      title: t("playlist.title"),
    },
  },
  {
    name: RouteName.Session,
    component: SessionScreen,
    options: {
      headerTitle: "",
      headerTransparent: true,
      title: t("session.title"),
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
