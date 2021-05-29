import { TabBar } from "@/components/TabBar";
import { HomeContainer } from "@/containers/Home";
import { MapContainer } from "@/containers/Map";
import {
  CreateFinalScreen,
  QuickShareScreen,
  SelectSongsScreen,
} from "@/containers/New";
import { SignInContainer } from "@/containers/SignIn";
import { UserContainer } from "@/containers/User";
import { useStoreAPI } from "@/gql/store";
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
      <Tab.Screen name="home" component={HomeContainer} />
      <Tab.Screen name="map" component={MapContainer} />
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
                  <Stack.Screen name="sign-in" component={SignInContainer} />
                  <Stack.Screen name="user" component={UserContainer} />
                  <Stack.Screen
                    name="new/select-songs"
                    component={SelectSongsScreen}
                  />
                  <Stack.Screen
                    name="new/quick-share"
                    component={QuickShareScreen}
                  />
                  <Stack.Screen
                    name="new/quick"
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
