import { Playlist } from "@auralous/api";
import { ParamListBase } from "@react-navigation/routers";

export enum RouteName {
  Main = "Main",
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
  };
  [RouteName.Playlist]: {
    id: string;
  };
}
