import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { HomeContainer } from "containers/Home";
import { createUrqlClient } from "gql/urql";
import React, { useState } from "react";
import { useColors } from "styles";
import { Provider } from "urql";

const Tab = createBottomTabNavigator();

const App = () => {
  const colors = useColors();
  const [urqlClient] = useState(() => createUrqlClient());

  return (
    <Provider value={urqlClient}>
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
        <Tab.Navigator>
          <Tab.Screen name="home" component={HomeContainer} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
