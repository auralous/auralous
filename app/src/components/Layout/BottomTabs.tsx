import { IconHome, IconMapPin, IconSearch } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { RNLink } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { useNavigationState } from "@react-navigation/native";
import type { FC, NamedExoticComponent } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import type { SvgProps } from "react-native-svg";

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.backgroundSecondary,
    flexDirection: "row",
    height: 56,
    width: "100%",
  },
  tab: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
});

const hiddenRoutes = [
  RouteName.NewFinal,
  RouteName.NewQuickShare,
  RouteName.NewSelectSongs,
] as string[];

const Tab: FC<{
  Icon: NamedExoticComponent<SvgProps>;
  name: RouteName;
  navigationRouteName: string;
}> = ({ Icon, name, navigationRouteName }) => {
  const isActive = navigationRouteName === name;

  return (
    <RNLink to={{ screen: name }} style={styles.tab}>
      <Icon color={isActive ? Colors.text : Colors.textSecondary} />
    </RNLink>
  );
};

const BottomTabs: FC = () => {
  const { t } = useTranslation();

  const navigationRouteName = useNavigationState((state) =>
    state?.routes ? state.routes[state.routes.length - 1].name : ""
  );

  if (hiddenRoutes.includes(navigationRouteName)) return null;

  return (
    <View style={styles.root}>
      <Tab
        name={RouteName.Home}
        Icon={IconHome}
        navigationRouteName={navigationRouteName}
      >
        {t("home.title")}
      </Tab>
      <Spacer y={2} />
      <Tab
        name={RouteName.Search}
        Icon={IconSearch}
        navigationRouteName={navigationRouteName}
      >
        {t("search.title")}
      </Tab>
      <Spacer y={2} />
      <Tab
        name={RouteName.Map}
        Icon={IconMapPin}
        navigationRouteName={navigationRouteName}
      >
        {t("map.title")}
      </Tab>
    </View>
  );
};

export default BottomTabs;
