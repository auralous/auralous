import { IconChevronLeft } from "@/assets";
import { Button } from "@/components/Button";
import BottomTabs from "@/components/Layout/BottomTabs";
import { PLAYER_BAR_HEIGHT } from "@/player-components/PlayerView/PlayerBar";
import { Font, fontPropsFn } from "@/styles/fonts";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { LinkingOptions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { HeaderBackButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import type { FC } from "react";
import { lazy } from "react";
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
          [RouteName.Home]: "",
          [RouteName.Explore]: "explore",
          [RouteName.Map]: "map",
        },
      },
      [RouteName.ExploreRecommendation]: "explore/:id",
      [RouteName.SignIn]: "sign-in",
      [RouteName.Settings]: "settings",
      [RouteName.Notifications]: "notifications",
      [RouteName.User]: "user/:username",
      [RouteName.Playlist]: "playlist/:id",
      [RouteName.Session]: "session/:id",
      [RouteName.SessionCollaborators]: "session/:id/collaborators",
      [RouteName.SessionInvite]: "session/:id/invite/:token",
      [RouteName.SessionEdit]: "session/:id/edit",
    },
  },
};

const HomeScreen = lazy(() => import("./Home"));
const ExploreScreen = lazy(() => import("./Explore"));
const ExploreRecommendationScreen = lazy(
  () => import("./ExploreRecommendation")
);
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

const Navigator: FC = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
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
              name={RouteName.Home}
              component={HomeScreen}
              options={{
                title: t("home.title"),
                headerTitle: "",
                headerTransparent: true,
              }}
            />
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
          headerTitle: "",
          headerTransparent: true,
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
          headerTitle: "",
          headerTransparent: true,
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
          headerTitle: "",
          headerTransparent: true,
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
