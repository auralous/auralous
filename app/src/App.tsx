import { ApiProvider } from "@/gql/context";
import HomeScreen from "@/screens/Home";
import MapScreen from "@/screens/Map";
import {
  CreateFinalScreen,
  QuickShareScreen,
  SelectSongsScreen,
} from "@/screens/New";
import SignInScreen from "@/screens/SignIn";
import { ParamList, RouteName } from "@/screens/types";
import UserScreen from "@/screens/User";
import { Size, TabBar, useColors } from "@auralous/ui";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { StatusBar } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PlayerProvider } from "./player";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const linking: LinkingOptions<ParamList> = {
  prefixes: ["auralous://"],
  config: {
    screens: {
      [RouteName.SignIn]: "sign-in",
      [RouteName.User]: "user/:username",
    },
  },
};

const MainScreen: React.FC = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{ paddingBottom: Size[16] }}
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="map" component={MapScreen} />
    </Tab.Navigator>
  );
};

const routes = [
  {
    name: "main",
    component: gestureHandlerRootHOC(MainScreen),
  },
  {
    name: RouteName.SignIn,
    component: gestureHandlerRootHOC(SignInScreen),
    options: {
      presentation: "modal" as const,
    },
  },
  {
    name: RouteName.User,
    component: gestureHandlerRootHOC(UserScreen),
  },
  {
    name: RouteName.NewSelectSongs,
    component: gestureHandlerRootHOC(SelectSongsScreen),
  },
  {
    name: RouteName.NewQuickShare,
    component: gestureHandlerRootHOC(QuickShareScreen),
  },
  {
    name: RouteName.NewFinal,
    component: gestureHandlerRootHOC(CreateFinalScreen),
    options: {
      animation: "fade" as const,
    },
  },
];

const App = () => {
  const colors = useColors();

  const stackRoutes = useMemo(() => {
    return routes.map((route) => (
      <Stack.Screen
        key={route.name}
        name={route.name}
        component={route.component}
        options={route.options}
      />
    ));
  }, []);

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          background: colors.background,
          card: "transparent",
          border: "transparent",
          primary: colors.primary,
          text: colors.text,
          notification: colors.backgroundSecondary,
        },
      }}
      linking={linking}
    >
      <ApiProvider>
        <BottomSheetModalProvider>
          <PlayerProvider>
            <SafeAreaProvider style={{ backgroundColor: colors.background }}>
              <StatusBar backgroundColor={colors.background} />
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {stackRoutes}
              </Stack.Navigator>
            </SafeAreaProvider>
          </PlayerProvider>
        </BottomSheetModalProvider>
      </ApiProvider>
    </NavigationContainer>
  );
};

export default App;
