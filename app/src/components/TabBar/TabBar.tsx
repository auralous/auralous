import { IconHome, IconMapPin } from "@/assets/svg";
import { Size, useColors } from "@/styles";
import {
  BottomTabBarOptions,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import AddButton from "./AddButton";
import Tab from "./Tab";

const styles = StyleSheet.create({
  root: {
    width: "100%",
    flexDirection: "row",
    zIndex: 100,
    position: "absolute",
    bottom: 0,
    left: 0,
    borderTopWidth: 1,
    alignItems: "center",
    height: Size[16],
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
      style={[
        styles.root,
        { backgroundColor: colors.background, borderTopColor: colors.outline },
      ]}
    >
      <Tab
        name="home"
        title={t("home.title")}
        Icon={IconHome}
        navigation={navigation}
        currentRoute={currentRoute}
      />
      <AddButton />
      <Tab
        name="map"
        title={t("map.title")}
        Icon={IconMapPin}
        navigation={navigation}
        currentRoute={currentRoute}
      />
    </View>
  );
};

export default TabBar;
