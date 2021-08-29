import { IconCheck } from "@/assets";
import { Colors } from "@/styles";
import { useSharedValuePressed } from "@/utils";
import type { FC } from "react";
import { useCallback } from "react";
import type { ViewStyle } from "react-native";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface CheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onValueChange(checked: boolean): void;
  accessibilityLabel?: string;
}

const styles = StyleSheet.create({
  check: {
    alignItems: "center",
    backgroundColor: Colors.none,
    borderColor: Colors.textTertiary,
    borderRadius: 9999,
    borderWidth: 1,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  checkChecked: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
});

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Checkbox: FC<CheckboxProps> = ({
  checked,
  disabled,
  onValueChange,
  accessibilityLabel,
}) => {
  const [pressed, pressedProps] = useSharedValuePressed();

  const stylesRoot = useAnimatedStyle<ViewStyle>(() => ({
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
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
      style={stylesRoot}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      {...pressedProps}
    >
      <View style={[styles.check, checked && styles.checkChecked]}>
        {checked && (
          <IconCheck color={Colors.background} width={16} height={16} />
        )}
      </View>
    </AnimatedPressable>
  );
};

export default Checkbox;
