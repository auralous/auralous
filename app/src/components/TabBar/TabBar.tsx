import {
  BottomTabBarOptions,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { MapPin, PlayCircle } from "assets/svg";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useColors } from "styles";

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

interface TabProps {
  Icon: React.FC<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  name: string;
}

const Tab: React.FC<TabProps> = ({ Icon }) => {
  const colors = useColors();
  return (
    <Pressable style={styles.tab}>
      <Icon stroke={colors.text} />
    </Pressable>
  );
};

const TabBar: React.FC<BottomTabBarProps<BottomTabBarOptions>> = (props) => {
  const colors = useColors();
  return (
    <View
      style={{
        backgroundColor: colors.backgroundSecondary,
        height: 52,
        flexDirection: "row",
      }}
    >
      <Tab name="listen" Icon={PlayCircle} />
      <Tab name="map" Icon={MapPin} />
    </View>
  );
};

export default TabBar;
