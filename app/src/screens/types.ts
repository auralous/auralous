import { Playlist, Story } from "@auralous/api";
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
  Story = "story",
  StoryCollaborators = "story/collaborators",
  StoryInvite = "story/invite",
}

export interface ParamList extends ParamListBase {
  root: undefined;
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
    story?: Story;
  };
  [RouteName.Playlist]: {
    id: string;
  };
  [RouteName.Story]: {
    id: string;
  };
  [RouteName.StoryCollaborators]: {
    id: string;
  };
  [RouteName.StoryInvite]: {
    id: string;
    token: string;
  };
}
