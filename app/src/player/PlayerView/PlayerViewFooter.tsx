import { Size } from "@/styles";
import { commonStyles } from "@/styles/common";
import { useSharedValuePressed } from "@/utils/animation";
import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface Item {
  icon: React.ReactNode;
  title: string;
  onPress(): void;
}

interface PlayerViewFooterProps {
  items: Item[];
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    height: Size[16],
    alignItems: "center",
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
  },
});

const Tab: React.FC<{ item: Item }> = ({ item }) => {
  const [pressed, pressedProps] = useSharedValuePressed();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    transform: [
      { scale: withSpring(pressed.value ? 0.9 : 1, { stiffness: 200 }) },
    ],
  }));

  return (
    <Pressable
      style={commonStyles.fillAndCentered}
      onPress={item.onPress}
      key={item.title}
      accessibilityLabel={item.title}
      {...pressedProps}
    >
      <Animated.View style={[styles.tab, animatedStyles]}>
        {item.icon}
      </Animated.View>
    </Pressable>
  );
};

const PlayerViewFooter: React.FC<PlayerViewFooterProps> = ({ items }) => {
  return (
    <View style={styles.root}>
      {items.map((item) => (
        <Tab key={item.title} item={item} />
      ))}
    </View>
  );
};

export default PlayerViewFooter;
