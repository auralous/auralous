import { IconChevronLeft } from "@/assets";
import { TextButton } from "@/components/Button";
import { Font, fontWithWeight } from "@/styles/fonts";
import type { StackNavigationOptions } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { routesFn } from "./routes";

const Stack = createStackNavigator();

const commonScreenOptions: StackNavigationOptions = {
  headerTitleStyle: { ...fontWithWeight(Font.Inter, "bold") },
  headerLeft({ onPress }) {
    return <TextButton onPress={onPress} icon={<IconChevronLeft />} />;
  },
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
