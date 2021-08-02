import { PlayerBar } from "@/player";
import { RouteName } from "@/screens/types";
import { IconHome, IconMapPin, makeStyles, Size } from "@auralous/ui";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Tab from "./Tab";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    justifyContent: "flex-end",
    backgroundColor: theme.colors.backgroundSecondary,
  },
  tabBars: {
    width: "100%",
    height: Size[14],
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
}));

const TabBar: FC<BottomTabBarProps> = ({ navigation, state }) => {
  const { t } = useTranslation();

  const dstyles = useStyles();
  const currentRoute = state.routeNames[state.index];

  return (
    <>
      <View style={dstyles.root}>
        <PlayerBar />
        <View style={dstyles.tabBars}>
          <Tab
            name={RouteName.Main}
            title={t("home.title")}
            Icon={IconHome}
            navigation={navigation}
            currentRoute={currentRoute}
          />
          <Tab
            name="map"
            title={t("map.title")}
            Icon={IconMapPin}
            navigation={navigation}
            currentRoute={currentRoute}
          />
        </View>
      </View>
    </>
  );
};

export default TabBar;
