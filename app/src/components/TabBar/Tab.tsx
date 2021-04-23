import { Text } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import { commonStyles } from "@/styles/common";
import { useSharedValuePressed } from "@/utils/animation";
import {
  BottomTabBarOptions,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const styles = StyleSheet.create({
  content: {
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

  const [pressed, pressedProps] = useSharedValuePressed();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    transform: [
      { scale: withSpring(pressed.value ? 0.9 : 1, { stiffness: 200 }) },
    ],
  }));

  return (
    <Pressable
      style={[
        commonStyles.fillAndCentered,
        currentRoute !== name && { opacity: 0.5 },
      ]}
      onPress={() => navigation.navigate(name)}
      {...pressedProps}
    >
      <Animated.View style={[styles.content, animatedStyles]}>
        <Icon stroke={colors.control} style={styles.icon} />
        <Text size="sm" bold>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default Tab;
