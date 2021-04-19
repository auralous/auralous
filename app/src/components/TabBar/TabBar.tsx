import {
  BottomTabBarOptions,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { Home, MapPin } from "assets/svg";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Size, useColors } from "styles";
import AddButton from "./AddButton";
import Tab from "./Tab";

const styles = StyleSheet.create({
  root: {
    height: 52,
    width: "100%",
    flexDirection: "row",
  },
  add: {
    padding: Size[6],
    borderRadius: 9999,
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
    <View
      style={[styles.root, { backgroundColor: colors.backgroundSecondary }]}
    >
      <Tab
        name="home"
        title={t("home.title")}
        Icon={Home}
        navigation={navigation}
        currentRoute={currentRoute}
      />
      <AddButton />
      <Tab
        name="map"
        title={t("map.title")}
        Icon={MapPin}
        navigation={navigation}
        currentRoute={currentRoute}
      />
    </View>
  );
};

export default TabBar;
