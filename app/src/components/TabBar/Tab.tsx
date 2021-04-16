import {
  BottomTabBarOptions,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { Text } from "components/Typography";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Size, useColors } from "styles";

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: Size[4],
    height: Size[4],
  },
});

interface TabProps {
  name: string;
  title: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  navigation: BottomTabBarProps<BottomTabBarOptions>["navigation"];
  currentRoute: string;
}

const Tab: React.FC<TabProps> = ({
  Icon,
  navigation,
  name,
  title,
  currentRoute,
}) => {
  const colors = useColors();
  return (
    <Pressable
      style={[styles.tab, currentRoute !== name && { opacity: 0.5 }]}
      onPress={() => navigation.navigate(name)}
    >
      <Icon stroke={colors.control} style={styles.icon} />
      <Text size="sm" bold>
        {title}
      </Text>
    </Pressable>
  );
};

export default Tab;
