import { IconMusic, IconPlaylistAdd, IconX } from "@/assets/svg";
import {
  BottomSheetCustomBackdrop,
  BottomSheetCustomBackground,
} from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { Heading, Text } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/core";
import React, { forwardRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteName } from "../types";

const styles = StyleSheet.create({
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
  },
  choice: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: 9999,
  },
});

const snapPoints = [Size[32]];

const NewModal = forwardRef<BottomSheetModal>(function NewModal(props, ref) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const colors = useColors();

  // @ts-ignore
  const dismiss = useCallback(() => ref.current.dismiss(), [ref]);

  const navigateTo = useCallback(
    (path: RouteName) => {
      navigation.navigate(path);
      dismiss();
    },
    [navigation, dismiss]
  );

  useCallback(() => {
    return () => {
      console.log("bye");
    };
  }, []);

  return (
    <BottomSheetModal
      backdropComponent={BottomSheetCustomBackdrop}
      backgroundComponent={BottomSheetCustomBackground}
      handleHeight={0}
      ref={ref}
      snapPoints={snapPoints}
      style={styles.newModal}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Heading level={3}>{t("new.title")}</Heading>
          <Button icon={<IconX color={colors.text} />} onPress={dismiss} />
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
  );
});

export default NewModal;
