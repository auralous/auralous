import { ParamListBase } from "@react-navigation/routers";

export enum RouteName {
  Home = "home",
  Map = "map",
  SignIn = "sign-in",
  User = "user",
  UserFollowers = "user/followers",
  UserFollowing = "user/following",
  NewFinal = "new/final",
  NewSelectSongs = "new/select-songs",
  NewQuickShare = "new/quick-share",
  Playlist = "playlist",
}

export interface ParamList extends ParamListBase {
  [RouteName.Home]: undefined;
  [RouteName.SignIn]: undefined;
  [RouteName.User]: {
    username: string;
  };
  [RouteName.UserFollowers]: {
    username: string;
  };
  [RouteName.UserFollowing]: {
    username: string;
  };
  [RouteName.SignIn]: undefined;
  [RouteName.NewFinal]: {
    selectedTracks: string[];
    modeTitle: string;
  };
  [RouteName.NewSelectSongs]: undefined;
  [RouteName.NewQuickShare]: undefined;
  [RouteName.Playlist]: {
    id: string;
  };
}
