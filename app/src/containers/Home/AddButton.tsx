import { IconPlus } from "@/assets/svg";
import { Size, useColors } from "@/styles";
import { useSharedValuePressed } from "@/utils/animation";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import NewModal from "./NewModal";

const styles = StyleSheet.create({
  root: {
    width: Size[16],
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

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [pressed, pressedProps] = useSharedValuePressed();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    opacity: withSpring(pressed.value ? 0.5 : 1, { stiffness: 200 }),
  }));

  const colors = useColors();

  return (
    <>
      <Pressable
        style={styles.root}
        onPress={() => bottomSheetRef.current?.present()}
        accessibilityLabel={t("new.title")}
        {...pressedProps}
      >
        <Animated.View style={[styles.view, animatedStyles]}>
          <LinearGradient
            colors={colors.gradientRainbow.colors}
            locations={colors.gradientRainbow.locations}
            style={styles.gradient}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
          >
            <IconPlus
              width={Size[6]}
              height={Size[6]}
              strokeWidth={3}
              stroke="#ffffff"
            />
          </LinearGradient>
        </Animated.View>
      </Pressable>
      <NewModal ref={bottomSheetRef} />
    </>
  );
};

export default AddButton;
