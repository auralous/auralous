import { Font, fontWithWeight } from "@auralous/ui";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { routesFn } from "./routes";

const Stack = createNativeStackNavigator();

const commonScreenOptions: NativeStackNavigationOptions = {
  headerShadowVisible: false,
  headerTitleStyle: { ...fontWithWeight(Font.Inter, "bold") },
};

const Navigator: FC = () => {
  const { t } = useTranslation();
  const rootRoutes = useMemo(() => routesFn(t), [t]);
  return (
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
  );
};

export default Navigator;
