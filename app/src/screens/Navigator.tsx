import { NullComponent } from "@/components/misc";
import { Font, fontPropsFn } from "@/styles/fonts";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { LinkingOptions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { FC } from "react";
import { memo } from "react";
import { Platform } from "react-native";
import ExploreRouteConfig from "./Explore";
import ExploreRecommendationRouteConfig from "./ExploreRecommendation";
import FeedRouteConfig from "./Feed";
import NewFinalRouteConfig from "./NewFinal";
import NewQuickShareRouteConfig from "./NewQuickShare";
import NewSelectSongsRouteConfig from "./NewSelectSongs";
import NotificationsRouteConfig from "./Notifications";
import PlaylistRouteConfig from "./Playlist";
import SearchRouteConfig from "./Search";
import SessionRouteConfig from "./Session";
import SessionCollaboratorsRouteConfig from "./SessionCollaborators";
import SessionEditRouteConfig from "./SessionEdit";
import SessionInviteRouteConfig from "./SessionInvite";
import SessionListenersRouteConfig from "./SessionListeners";
import SessionsRouteConfig from "./Sessions";
import SettingsRouteConfig from "./Settings";
import SignInRouteConfig from "./SignIn";
import type { ParamList } from "./types";
import { RouteName } from "./types";
import UserRouteConfig from "./User";
import UserFollowersRouteConfig from "./UserFollowersScreen";
import UserFollowingRouteConfig from "./UserFollowingScreen";

export const linking: LinkingOptions<ParamList> = {
  enabled: true,
  prefixes: ["auralous://"],
  config: {
    initialRouteName: RouteName.Main,
    screens: {
      [RouteName.Main]: {
        // @ts-ignore
        screens: {
          [RouteName.Explore]: "",
          [RouteName.Feed]: "feed",
          [RouteName.Notifications]: "notifications",
        },
      },
      [RouteName.Search]: "search",
      [RouteName.ExploreRecommendation]: "explore/:id",
      [RouteName.Sessions]: "sessions",
      [RouteName.Settings]: "settings",
      [RouteName.User]: "users/:username",
      [RouteName.UserFollowers]: "users/:username/followers",
      [RouteName.UserFollowing]: "users/:username/following",
      [RouteName.Playlist]: {
        path: "playlists/:id",
        parse: {
          id: (id) => id.replace("-", ":"),
        },
        stringify: {
          id: (id) => {
            const [platform, externalId] = id.split(":");
            return `${platform}-${externalId}`;
          },
        },
      },
      [RouteName.Session]: "sessions/:id",
      [RouteName.SessionEdit]: "sessions/:id/edit",
      [RouteName.SessionListeners]: "sessions/:id/listeners",
      [RouteName.SessionCollaborators]: "sessions/:id/collaborators",
      [RouteName.SessionInvite]: "sessions/:id/invite/:token",
      [RouteName.NewSelectSongs]: "new/select-songs",
      [RouteName.NewQuickShare]: "new/quick-share",
      [RouteName.SignIn]: "sign-in",
    },
  },
};

const headerTitleStyle = { ...fontPropsFn(Font.NotoSans, "bold") };

const Tab = createBottomTabNavigator();
const tabScreenOptions = {
  headerTitleStyle,
};
const MainScreenComponent: FC = () => {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions} tabBar={NullComponent}>
      <Tab.Screen
        name={ExploreRouteConfig.name}
        component={ExploreRouteConfig.component}
        options={ExploreRouteConfig.options}
      />
      <Tab.Screen
        name={FeedRouteConfig.name}
        component={FeedRouteConfig.component}
        options={FeedRouteConfig.options}
      />
      <Tab.Screen
        name={NotificationsRouteConfig.name}
        component={NotificationsRouteConfig.component}
        options={NotificationsRouteConfig.options}
      />
    </Tab.Navigator>
  );
};

const stackRoutes = [
  SearchRouteConfig,
  ExploreRecommendationRouteConfig,
  PlaylistRouteConfig,
  SessionRouteConfig,
  SessionCollaboratorsRouteConfig,
  SessionEditRouteConfig,
  SessionInviteRouteConfig,
  SessionListenersRouteConfig,
  SessionsRouteConfig,
  UserRouteConfig,
  UserFollowersRouteConfig,
  UserFollowingRouteConfig,
  NewFinalRouteConfig,
  NewQuickShareRouteConfig,
  NewSelectSongsRouteConfig,
  SettingsRouteConfig,
];

const screenOptions = {
  headerTitleStyle,
};
const mainScreenOptions = { headerShown: false };

const Stack = createNativeStackNavigator();
const Navigator: FC = () => {
  return (
    <Stack.Navigator
      // @ts-ignore
      screenOptions={screenOptions}
      initialRouteName={RouteName.Main}
    >
      <Stack.Screen
        name={RouteName.Main}
        options={mainScreenOptions}
        component={MainScreenComponent}
      />
      {stackRoutes.map((stackRoute) => (
        <Stack.Screen
          key={stackRoute.name}
          name={stackRoute.name}
          component={stackRoute.component}
          options={stackRoute.options}
        />
      ))}
      {Platform.OS !== "web" && <Stack.Screen {...SignInRouteConfig} />}
    </Stack.Navigator>
  );
};

export default memo(Navigator);
