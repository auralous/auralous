import { TabBar } from "@/components/TabBar";
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
import { Font, makeStyles, useTheme } from "@auralous/ui";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PlayerComponent, PlayerProvider } from "./player";
import {
  StoryCollaboratorsScreen,
  StoryEditScreen,
  StoryInviteScreen,
  StoryScreen,
} from "./screens/Story";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const linking: LinkingOptions<ParamList> = {
  enabled: true,
  prefixes: ["auralous://"],
  config: {
    screens: {
      [RouteName.SignIn]: "sign-in",
      root: {
        // @ts-ignore
        screens: {
          [RouteName.Main]: {
            screens: {
              [RouteName.User]: "user/:username",
              [RouteName.Playlist]: "playlist/:id",
              [RouteName.Story]: "story/:id",
              [RouteName.StoryCollaborators]: "story/:id/collaborators",
              [RouteName.StoryInvite]: "story/:id/invite/:token",
              [RouteName.StoryEdit]: "story/:id/edit",
            },
          },
        },
      },
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

const MainScreen: FC = () => {
  const { t } = useTranslation();
  const mainRoutes = useMemo<RouteItem[]>(
    () => [
      {
        name: RouteName.Home,
        component: gestureHandlerRootHOC(HomeScreen),
        options: { headerShown: false },
      },
      {
        name: RouteName.User,
        component: gestureHandlerRootHOC(UserScreen),
        options: {
          headerTitle: "",
        },
      },
      {
        name: RouteName.UserFollowers,
        component: gestureHandlerRootHOC(UserFollowersScreen),
        options: {
          title: t("user.followers"),
        },
      },
      {
        name: RouteName.UserFollowing,
        component: gestureHandlerRootHOC(UserFollowingScreen),
        options: {
          title: t("user.following"),
        },
      },
      {
        name: RouteName.Playlist,
        component: gestureHandlerRootHOC(PlaylistScreen),
        options: {
          headerTitle: "",
          headerTranslucent: true,
        },
      },
      {
        name: RouteName.Story,
        component: gestureHandlerRootHOC(StoryScreen),
        options: {
          headerTitle: "",
          headerTranslucent: true,
        },
      },
      {
        name: RouteName.StoryCollaborators,
        component: gestureHandlerRootHOC(StoryCollaboratorsScreen),
        options: {
          title: t("collab.title"),
        },
      },
      {
        name: RouteName.StoryInvite,
        component: gestureHandlerRootHOC(StoryInviteScreen),
        options: {
          headerTitle: "",
        },
      },
      {
        name: RouteName.StoryEdit,
        component: gestureHandlerRootHOC(StoryEditScreen),
        options: {
          title: t("story_edit.title"),
        },
      },
    ],
    [t]
  );
  return (
    <Stack.Navigator screenOptions={commonScreenOptions}>
      {mainRoutes.map((route) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={route.options}
        />
      ))}
    </Stack.Navigator>
  );
};

const tabBar = (props: BottomTabBarProps) => <TabBar {...props} />;

const RootScreen: FC = () => {
  return (
    <Tab.Navigator tabBar={tabBar} screenOptions={{ headerShown: false }}>
      <Tab.Screen name={RouteName.Main} component={MainScreen} />
      <Tab.Screen name={RouteName.Map} component={MapScreen} />
    </Tab.Navigator>
  );
};

const useStyles = makeStyles((theme) => ({
  sap: {
    backgroundColor: theme.colors.background,
  },
}));

const App = () => {
  const theme = useTheme();

  const styles = useStyles();

  const navigationTheme = useMemo(
    () => ({
      dark: true,
      colors: {
        background: theme.colors.background,
        card: theme.colors.background,
        border: theme.colors.border,
        primary: theme.colors.primary,
        text: theme.colors.text,
        notification: theme.colors.backgroundSecondary,
      },
    }),
    [theme]
  );

  const { t } = useTranslation();

  // Routes that should be shown outside of tab navigator
  // preventing bottom bars to be visible
  const rootRoutes = useMemo<RouteItem[]>(
    () => [
      {
        name: "root",
        component: RootScreen,
        options: { headerShown: false },
      },
      {
        name: RouteName.SignIn,
        component: gestureHandlerRootHOC(SignInScreen),
        options: {
          presentation: "modal" as const,
          title: t("sign_in.title"),
          headerTranslucent: true,
        },
      },
      {
        name: RouteName.NewSelectSongs,
        component: gestureHandlerRootHOC(SelectSongsScreen),
        options: {
          title: t("new.select_songs.title"),
        },
      },
      {
        name: RouteName.NewQuickShare,
        component: gestureHandlerRootHOC(QuickShareScreen),
        options: {
          title: t("new.quick_share.title"),
        },
      },
      {
        name: RouteName.NewFinal,
        component: gestureHandlerRootHOC(CreateFinalScreen),
        options: {
          animation: "fade" as const,
          headerShown: false,
        },
      },
    ],
    [t]
  );

  return (
    <SafeAreaProvider style={styles.sap}>
      <NavigationContainer theme={navigationTheme} linking={linking}>
        <ApiProvider>
          <PlayerProvider>
            <BottomSheetModalProvider>
              <StatusBar translucent backgroundColor="transparent" />
              <PlayerComponent />
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
            </BottomSheetModalProvider>
          </PlayerProvider>
        </ApiProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
