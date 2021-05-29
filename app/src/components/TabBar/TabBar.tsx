import { IconHome, IconMapPin } from "@/assets/svg";
import { PlayerBar } from "@/player";
import { Size, useColors } from "@/styles";
import {
  BottomTabBarOptions,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Tab from "./Tab";

const styles = StyleSheet.create({
  root: {
    width: "100%",
    zIndex: 100,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  tabBars: {
    flex: 1,
    height: Size[16],
    alignItems: "center",
    flexDirection: "row",
  },
});

const TabBar: React.FC<BottomTabBarProps<BottomTabBarOptions>> = ({
  navigation,
  state,
}) => {
  const { t } = useTranslation();
  const colors = useColors();

  const currentRoute = state.routeNames[state.index];

  return (
    <>
      <View style={styles.root}>
        <PlayerBar />
        <View
          style={[
            styles.tabBars,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <Tab
            name="home"
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
