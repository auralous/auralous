import { IconMusic, IconPlaylistAdd, IconPlus, IconX } from "@/assets/svg";
import { BottomSheetCustomBackground } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { Heading, Text } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { Size, useColors } from "@/styles";
import { useSharedValuePressed } from "@/utils/animation";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/core";
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

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
  newModal: {
    flex: 1,
    paddingVertical: Size[2],
    paddingHorizontal: Size[4],
  },
  header: {
    paddingBottom: Size[4],
    flexDirection: "row",
    justifyContent: "space-between",
  },
  choices: {
    height: 60,
    flexDirection: "row",
    width: "100%",
  },
  choice: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: 9999,
  },
});

const AddButton: React.FC = () => {
  const { t } = useTranslation();

  const ref = useRef<BottomSheetModal>(null);

  const [pressed, pressedProps] = useSharedValuePressed();

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    opacity: withSpring(pressed.value ? 0.5 : 1, { stiffness: 200 }),
  }));

  const navigation = useNavigation();

  const navigateTo = useCallback(
    (path: RouteName) => {
      navigation.navigate(path);
      ref.current?.dismiss();
    },
    [navigation]
  );

  const colors = useColors();

  return (
    <>
      <Pressable
        style={styles.root}
        onPress={() => ref.current?.present()}
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
      <BottomSheetModal
        backdropComponent={BottomSheetBackdrop}
        backgroundComponent={BottomSheetCustomBackground}
        handleHeight={0}
        ref={ref}
        snapPoints={[Size[32]]}
        style={styles.newModal}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Heading level={3}>{t("new.title")}</Heading>
            <Button
              icon={<IconX color={colors.text} />}
              onPress={() => ref.current?.dismiss()}
            />
          </View>
          <View style={styles.choices}>
            <TouchableOpacity
              style={[styles.choice, { backgroundColor: "#EB367F" }]}
              onPress={() => navigateTo(RouteName.NewSelectSongs)}
            >
              <IconPlaylistAdd color="#ffffff" />
              <Text bold style={{ color: "#ffffff" }}>
                {t("new.select_songs.title")}
              </Text>
            </TouchableOpacity>
            <Spacer x={2} />
            <TouchableOpacity
              style={[styles.choice, { backgroundColor: "#4C2889" }]}
              onPress={() => navigateTo(RouteName.NewQuickShare)}
            >
              <IconMusic color="#ffffff" />
              <Text bold style={{ color: "#ffffff" }}>
                {t("new.quick_share.title")}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </BottomSheetModal>
    </>
  );
};

export default AddButton;
