import { TabBar } from "@/components/TabBar";
import { HomeContainer } from "@/containers/Home";
import { MapContainer } from "@/containers/Map";
import { NewContainer } from "@/containers/New";
import { SignInContainer } from "@/containers/SignIn";
import { UserContainer } from "@/containers/User";
import { useStoreAPI } from "@/gql/store";
import { useColors } from "@/styles";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "urql";

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
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="home" component={HomeContainer} />
      <Tab.Screen name="map" component={MapContainer} />
    </Tab.Navigator>
  );
};

const App = () => {
  const colors = useColors();
  const client = useStoreAPI((state) => state.client);

  return (
    <Provider value={client}>
      <SafeAreaProvider style={{ backgroundColor: colors.background }}>
        <StatusBar backgroundColor={colors.background} animated />
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
          <Stack.Navigator headerMode="none">
            <Stack.Screen name="main" component={MainScreen} />
            <Stack.Screen name="sign-in" component={SignInContainer} />
            <Stack.Screen name="user" component={UserContainer} />
            <Stack.Screen name="new" component={NewContainer} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
