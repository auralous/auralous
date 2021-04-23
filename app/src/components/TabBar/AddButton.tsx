import { IconPlus } from "@/assets/svg";
import { Size } from "@/styles";
import { useSharedValuePressed } from "@/utils/animation";
import { useNavigation } from "@react-navigation/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const styles = StyleSheet.create({
  root: {
    width: Size[12],
    height: Size[12],
    borderRadius: 9999,
    overflow: "hidden",
  },
  view: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

const AddButton: React.FC = () => {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const [pressed, pressedProps] = useSharedValuePressed();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    opacity: withSpring(pressed.value ? 0.5 : 1, { stiffness: 200 }),
  }));

  return (
    <Pressable
      style={styles.root}
      onPress={() => navigation.navigate("new")}
      accessibilityLabel={t("new.title")}
      {...pressedProps}
    >
      <Animated.View style={[styles.view, animatedStyles]}>
        <LinearGradient colors={["#ff2e54", "#f5a524"]} style={styles.gradient}>
          <IconPlus
            width={Size[6]}
            height={Size[6]}
            strokeWidth={3}
            stroke="#ffffff"
          />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

export default AddButton;
