import { TabBar } from "@/components/TabBar";
import { useStoreAPI } from "@/gql/store";
import HomeScreen from "@/screens/Home";
import MapScreen from "@/screens/Map";
import {
  CreateFinalScreen,
  QuickShareScreen,
  SelectSongsScreen,
} from "@/screens/New";
import SignInScreen from "@/screens/SignIn";
import { RouteName } from "@/screens/types";
import UserScreen from "@/screens/User";
import { Size, useColors } from "@/styles";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "urql";
import { PlayerProvider } from "./player";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const linking: LinkingOptions = {
  prefixes: ["auralous://"],
  config: {
    screens: {
      "sign-in": "sign-in",
      user: "user/:username",
    },
  },
};

const MainScreen: React.FC = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{ paddingBottom: Size[16] }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="map" component={MapScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  const colors = useColors();
  const client = useStoreAPI((state) => state.client);

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
      <Provider value={client}>
        <BottomSheetModalProvider>
          <PlayerProvider>
            <BottomSheetModalProvider>
              <SafeAreaProvider style={{ backgroundColor: colors.background }}>
                <StatusBar backgroundColor={colors.background} animated />
                <Stack.Navigator headerMode="none">
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
      </Provider>
    </NavigationContainer>
  );
};

export default App;
