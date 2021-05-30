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
import { ParamList, RouteName } from "@/screens/types";
import UserScreen from "@/screens/User";
import { Size, useColors } from "@/styles";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "urql";
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
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="main" component={MainScreen} />
                  <Stack.Screen
                    name={RouteName.SignIn}
                    component={SignInScreen}
                    options={{ presentation: "modal" }}
                  />
                  <Stack.Screen name={RouteName.User} component={UserScreen} />
                  <Stack.Screen
                    name={RouteName.NewSelectSongs}
                    component={SelectSongsScreen}
                    options={{ presentation: "modal" }}
                  />
                  <Stack.Screen
                    name={RouteName.NewQuickShare}
                    component={QuickShareScreen}
                    options={{ presentation: "modal" }}
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
