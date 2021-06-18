import { IconCheck } from "@/assets/svg";
import { useColors } from "@/styles";
import { useSharedValuePressed } from "@/utils/animation";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface CheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onValueChange(checked: boolean): void;
}

const styles = StyleSheet.create({
  root: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  disabled,
  onValueChange,
}) => {
  const colors = useColors();
  const [pressed, pressedProps] = useSharedValuePressed();

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ scale: withTiming(pressed.value ? 0.8 : 1) }],
  }));

  const onPress = useCallback(
    () => onValueChange(!checked),
    [onValueChange, checked]
  );

  return (
    <AnimatedPressable
      accessibilityState={{
        checked,
        disabled,
      }}
      accessibilityRole="checkbox"
      style={[styles.root, animatedStyle]}
      onPress={onPress}
      {...pressedProps}
    >
      <View
        style={[
          styles.check,
          {
            borderColor: checked ? colors.text : colors.textTertiary,
            backgroundColor: checked ? colors.text : "transparent",
          },
        ]}
      >
        {checked && (
          <IconCheck color={colors.background} width={16} height={16} />
        )}
      </View>
    </AnimatedPressable>
  );
};

export default Checkbox;
