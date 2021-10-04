import { IconChevronLeft } from "@/assets";
import { TextButton } from "@/components/Button";
import { Font, fontWithWeight } from "@/styles/fonts";
import { useNavigation } from "@react-navigation/core";
import type { StackNavigationOptions } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { routesFn } from "./routes";
import { RouteName } from "./types";

const Stack = createStackNavigator();

const HeaderLeft: FC<{ onPress?(): void; canGoBack: boolean }> = ({
  onPress,
  canGoBack,
}) => {
  const navigation = useNavigation();
  return (
    <TextButton
      onPress={canGoBack ? onPress : () => navigation.navigate(RouteName.Home)}
      icon={<IconChevronLeft />}
    />
  );
};

const commonScreenOptions: StackNavigationOptions = {
  headerTitleStyle: { ...fontWithWeight(Font.Inter, "bold") },
  headerLeft({ onPress, canGoBack }) {
    return <HeaderLeft onPress={onPress} canGoBack={canGoBack || false} />;
  },
  cardStyle: {
    minHeight: undefined,
    flex: 1,
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
