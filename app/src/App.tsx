import { TabBar } from "@/components/TabBar";
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
import { Size, useColors } from "@/styles";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApiProvider } from "./gql/context";
import { PlayerProvider } from "./player";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

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

const App = () => {
  const colors = useColors();

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
            <BottomSheetModalProvider>
              <SafeAreaProvider style={{ backgroundColor: colors.background }}>
                <StatusBar backgroundColor={colors.background} animated />
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="main" component={MainScreen} />
                  <Stack.Screen
                    name={RouteName.SignIn}
                    component={SignInScreen}
                  />
                  <Stack.Screen name={RouteName.User} component={UserScreen} />
                  <Stack.Screen
                    name={RouteName.NewSelectSongs}
                    component={SelectSongsScreen}
                  />
                  <Stack.Screen
                    name={RouteName.NewQuickShare}
                    component={QuickShareScreen}
                  />
                  <Stack.Screen
                    name={RouteName.NewFinal}
                    component={CreateFinalScreen}
                  />
                </Stack.Navigator>
              </SafeAreaProvider>
            </BottomSheetModalProvider>
          </PlayerProvider>
        </BottomSheetModalProvider>
      </ApiProvider>
    </NavigationContainer>
  );
};

export default App;
