import { IconChevronLeft } from "@/assets";
import { Button } from "@/components/Button";
import BottomTabs from "@/components/Layout/BottomTabs";
import { LoadingScreen } from "@/components/Loading";
import { NullComponent } from "@/components/misc";
import { PLAYER_BAR_HEIGHT } from "@/player-components/PlayerView/PlayerBar";
import { Font, fontPropsFn } from "@/styles/fonts";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { LinkingOptions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { HeaderBackButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import type { ComponentProps, ComponentType, FC } from "react";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import SignInScreen from "./SignIn";
import type { ParamList } from "./types";
import { RouteName } from "./types";

export const linking: LinkingOptions<ParamList> = {
  enabled: true,
  prefixes: ["auralous://"],
  config: {
    screens: {
      [RouteName.Main]: {
        // @ts-ignore
        screens: {
          [RouteName.Explore]: "",
          [RouteName.Map]: "map",
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
      [RouteName.Playlist]: "playlists/:id",
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

const wrappedLazy = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  const Component = lazy(factory);
  return function WrappedLazyComponent(props: ComponentProps<T>) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
      </Suspense>
    );
  };
};

const ExploreScreen = wrappedLazy(() => import("./Explore"));
const ExploreRecommendationScreen = wrappedLazy(
  () => import("./ExploreRecommendation")
);
const SessionsScreen = wrappedLazy(() => import("./Sessions"));
const MapScreen = wrappedLazy(() => import("./Map"));
const UserScreen = wrappedLazy(() => import("./User"));
const UserFollowersScreen = wrappedLazy(() => import("./UserFollowersScreen"));
const UserFollowingScreen = wrappedLazy(() => import("./UserFollowingScreen"));
const PlaylistScreen = wrappedLazy(() => import("./Playlist"));
const SessionScreen = wrappedLazy(() => import("./Session"));
const SessionCollaboratorsScreen = wrappedLazy(
  () => import("./SessionCollaborators")
);
const SessionInviteScreen = wrappedLazy(() => import("./SessionInvite"));
const SessionEditScreen = wrappedLazy(() => import("./SessionEdit"));
const SessionListenersScreen = wrappedLazy(() => import("./SessionListeners"));
const NewSelectSongsScreen = wrappedLazy(() => import("./NewSelectSongs"));
const NewQuickShareScreen = wrappedLazy(() => import("./NewQuickShare"));
const NewFinalScreen = wrappedLazy(() => import("./NewFinal"));
const SettingsScreen = wrappedLazy(() => import("./Settings"));
const NotificationsScreen = wrappedLazy(() => import("./Notifications"));
const SearchScreen = wrappedLazy(() => import("./Search"));

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerTitleStyle = { ...fontPropsFn(Font.NotoSans, "bold") };

const HeaderLeft: FC<HeaderBackButtonProps> = ({ canGoBack }) => {
  const navigation = useNavigation();
  return (
    <Button
      onPress={
        canGoBack
          ? navigation.goBack
          : () => navigation.navigate(RouteName.Main)
      }
      variant="text"
      icon={<IconChevronLeft />}
    />
  );
};
const headerLeft = (props: HeaderBackButtonProps) => {
  return <HeaderLeft {...props} />;
};

const blankHeaderTitle = {
  headerTitle: NullComponent,
  headerTransparent: true,
};

const Navigator: FC = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        // @ts-ignore
        headerTitleStyle,
        headerLeft,
      }}
    >
      <Stack.Screen name={RouteName.Main} options={{ headerShown: false }}>
        {() => (
          <Tab.Navigator
            screenOptions={{
              headerTitleStyle,
            }}
            tabBar={(props) => <BottomTabs {...props} />}
          >
            <Tab.Screen
              name={RouteName.Explore}
              component={ExploreScreen}
              options={{
                title: t("explore.title"),
                tabBarStyle: {
                  marginTop: PLAYER_BAR_HEIGHT,
                },
              }}
            />
            <Tab.Screen
              name={RouteName.Map}
              component={MapScreen}
              options={{
                headerShown: false,
                title: t("map.title"),
              }}
            />
            <Tab.Screen
              name={RouteName.Notifications}
              component={NotificationsScreen}
              options={{
                title: t("notifications.title"),
                tabBarStyle: {
                  marginTop: PLAYER_BAR_HEIGHT,
                },
              }}
            />
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen
        name={RouteName.Search}
        component={SearchScreen}
        options={{
          title: t("search.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        }}
      />
      <Stack.Screen
        name={RouteName.ExploreRecommendation}
        component={ExploreRecommendationScreen}
        options={{
          title: t("explore.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        }}
      />
      <Stack.Screen
        name={RouteName.Sessions}
        component={SessionsScreen}
        options={{
          title: t("explore.recent_sessions.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        }}
      />
      <Stack.Screen
        name={RouteName.Settings}
        component={SettingsScreen}
        options={{
          title: t("settings.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        }}
      />
      <Stack.Screen
        name={RouteName.User}
        component={UserScreen}
        options={{
          title: t("user.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
          ...blankHeaderTitle,
        }}
      />
      <Stack.Screen
        name={RouteName.UserFollowers}
        component={UserFollowersScreen}
        options={{
          title: t("user.followers"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        }}
      />
      <Stack.Screen
        name={RouteName.UserFollowing}
        component={UserFollowingScreen}
        options={{
          title: t("user.following"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        }}
      />
      <Stack.Screen
        name={RouteName.Playlist}
        component={PlaylistScreen}
        options={{
          title: t("playlist.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
          ...blankHeaderTitle,
        }}
      />
      <Stack.Screen
        name={RouteName.Session}
        component={SessionScreen}
        options={{
          title: t("session.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
          ...blankHeaderTitle,
        }}
      />
      <Stack.Screen
        name={RouteName.SessionEdit}
        component={SessionEditScreen}
        options={{
          title: t("session_edit.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        }}
      />
      <Stack.Screen
        name={RouteName.SessionListeners}
        component={SessionListenersScreen}
        options={{
          title: t("session_listeners.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        }}
      />
      <Stack.Screen
        name={RouteName.SessionCollaborators}
        component={SessionCollaboratorsScreen}
        options={{
          title: t("collab.title"),
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        }}
      />
      <Stack.Screen
        name={RouteName.SessionInvite}
        component={SessionInviteScreen}
        options={{
          title: "",
          contentStyle: {
            paddingBottom: PLAYER_BAR_HEIGHT,
          },
        }}
      />
      {Platform.OS !== "web" && (
        <Stack.Screen
          name={RouteName.SignIn}
          component={SignInScreen}
          options={{
            presentation: "modal" as const,
            title: t("sign_in.title"),
            headerShown: false,
          }}
        />
      )}
      <Stack.Screen
        name={RouteName.NewSelectSongs}
        component={NewSelectSongsScreen}
        options={{
          title: t("new.select_songs.title"),
        }}
      />
      <Stack.Screen
        name={RouteName.NewQuickShare}
        component={NewQuickShareScreen}
        options={{
          title: t("new.quick_share.title"),
        }}
      />
      <Stack.Screen
        name={RouteName.NewFinal}
        component={NewFinalScreen}
        options={{
          animation: "fade" as const,
          headerShown: false,
          title: t("new.final.title"),
        }}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
