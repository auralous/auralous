import type { Playlist, Session } from "@auralous/api";
import type { ParamListBase } from "@react-navigation/native";

export enum RouteName {
  Main = "main",
  Feed = "feed",
  Map = "map",
  Explore = "explore",
  ExploreRecommendation = "explore/recommendation",
  Sessions = "sessions",
  SignIn = "sign-in",
  User = "user",
  UserFollowers = "user/followers",
  UserFollowing = "user/following",
  NewFinal = "new/final",
  NewSelectSongs = "new/select-songs",
  NewQuickShare = "new/quick-share",
  Playlist = "playlist",
  Session = "session",
  SessionCollaborators = "session/collaborators",
  SessionInvite = "session/invite",
  SessionEdit = "session/edit",
  SessionListeners = "session/listeners",
  Settings = "settings",
  Notifications = "notifications",
}

export interface ParamList extends ParamListBase {
  root: undefined;
  [RouteName.Feed]: undefined;
  [RouteName.Explore]: undefined;
  [RouteName.ExploreRecommendation]: {
    id: string;
  };
  [RouteName.Sessions]: undefined;
  [RouteName.SignIn]?: {
    access_token?: string;
  };
  [RouteName.User]: {
    username: string;
  };
  [RouteName.UserFollowers]: {
    username: string;
  };
  [RouteName.UserFollowing]: {
    username: string;
  };
  [RouteName.NewFinal]: {
    selectedTracks: string[];
    text: string;
  };
  [RouteName.NewSelectSongs]: undefined;
  [RouteName.NewQuickShare]?: {
    playlist?: Playlist;
    session?: Session;
  };
  [RouteName.Playlist]: {
    id: string;
  };
  [RouteName.Session]: {
    id: string;
    isNew?: boolean;
  };
  [RouteName.SessionCollaborators]: {
    id: string;
  };
  [RouteName.SessionInvite]: {
    id: string;
    token: string;
  };
  [RouteName.SessionEdit]: {
    id: string;
    showEndModal?: boolean;
  };
  [RouteName.SessionListeners]: {
    id: string;
  };
  [RouteName.Settings]: undefined;
  [RouteName.Notifications]: undefined;
}
