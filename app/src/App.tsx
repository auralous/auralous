import { ApiProvider } from "@/gql/context";
import HomeScreen from "@/screens/Home";
import MapScreen from "@/screens/Map";
import {
  CreateFinalScreen,
  QuickShareScreen,
  SelectSongsScreen,
} from "@/screens/New";
import PlaylistScreen from "@/screens/Playlist";
import SignInScreen from "@/screens/SignIn";
import { ParamList, RouteName } from "@/screens/types";
import {
  UserFollowersScreen,
  UserFollowingScreen,
  UserScreen,
} from "@/screens/User";
import { Colors, Font, Toaster } from "@auralous/ui";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootSheetModals } from "./components/RootSheetModals";
import { PlayerComponent, PlayerProvider } from "./player";
import { NotificationsScreen } from "./screens/Notifications";
import {
  SessionCollaboratorsScreen,
  SessionEditScreen,
  SessionInviteScreen,
  SessionListenersScreen,
  SessionScreen,
} from "./screens/Session";
import { SettingsScreen } from "./screens/Settings";

const Stack = createNativeStackNavigator();

const linking: LinkingOptions<ParamList> = {
  enabled: true,
  prefixes: ["auralous://"],
  config: {
    screens: {
      [RouteName.SignIn]: "sign-in",
      [RouteName.User]: "user/:username",
      [RouteName.Playlist]: "playlist/:id",
      [RouteName.Session]: "session/:id",
      [RouteName.SessionCollaborators]: "session/:id/collaborators",
      [RouteName.SessionInvite]: "session/:id/invite/:token",
      [RouteName.SessionEdit]: "session/:id/edit",
    },
  },
};

// Routes that should be shown inside tab navigator
// allow bottom bars to be visible
type RouteItem = {
  name: string;
  component: React.ComponentType<any>;
  options?: NativeStackNavigationOptions;
};

const commonScreenOptions: NativeStackNavigationOptions = {
  headerShadowVisible: false,
  headerTitleStyle: { fontFamily: Font.Bold },
};

const styles = StyleSheet.create({
  sap: {
    backgroundColor: Colors.background,
  },
});

const navigationTheme = {
  dark: true,
  colors: {
    background: Colors.background,
    card: Colors.background,
    border: Colors.border,
    primary: Colors.primary,
    text: Colors.text,
    notification: Colors.backgroundSecondary,
  },
};

const App = () => {
  const { t } = useTranslation();

  // Routes that should be shown outside of tab navigator
  // preventing bottom bars to be visible
  const rootRoutes = useMemo<RouteItem[]>(
    () => [
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
          headerTranslucent: true,
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
          headerTranslucent: true,
        },
      },
      {
        name: RouteName.Session,
        component: SessionScreen,
        options: {
          headerTitle: "",
          headerTranslucent: true,
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
          headerTranslucent: true,
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
    ],
    [t]
  );

  return (
    <ApiProvider>
      <PlayerProvider>
        <SafeAreaProvider style={styles.sap}>
          <StatusBar translucent backgroundColor="transparent" />
          <NavigationContainer theme={navigationTheme} linking={linking}>
            <RootSheetModals.Provider>
              <BottomSheetModalProvider>
                <PlayerComponent>
                  <Stack.Navigator screenOptions={commonScreenOptions}>
                    {rootRoutes.map((route) => (
                      <Stack.Screen
                        key={route.name}
                        name={route.name}
                        component={route.component}
                        options={route.options}
                      />
                    ))}
                  </Stack.Navigator>
                </PlayerComponent>
                <RootSheetModals.Components />
              </BottomSheetModalProvider>
            </RootSheetModals.Provider>
          </NavigationContainer>
          <Toaster />
        </SafeAreaProvider>
      </PlayerProvider>
    </ApiProvider>
  );
};

export default App;
