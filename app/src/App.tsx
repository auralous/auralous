import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { TabBar } from "components/TabBar";
import { HomeContainer } from "containers/Home";
import { MapContainer } from "containers/Map";
import { createUrqlClient } from "gql/urql";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColors } from "styles";
import { Provider } from "urql";

const Tab = createBottomTabNavigator();

const App = () => {
  const colors = useColors();
  const [urqlClient] = useState(() => createUrqlClient());

  return (
    <Provider value={urqlClient}>
      <SafeAreaProvider>
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
        >
          <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
            <Tab.Screen name="home" component={HomeContainer} />
            <Tab.Screen name="map" component={MapContainer} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
