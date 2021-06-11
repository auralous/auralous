import { IconPlus } from "@/assets/svg";
import { Button, GradientButton, TextButton } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { Heading } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { BlurView } from "@react-native-community/blur";
import { useNavigation } from "@react-navigation/core";
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  button: {
    width: Size[16],
    height: Size[12],
  },
  newModal: {
    ...StyleSheet.absoluteFillObject,
    padding: Size[6],
    justifyContent: "center",
    alignItems: "center",
  },
  choices: {
    flexDirection: "row",
  },
  choice: {
    padding: Size[4],
    height: 54,
    flex: 1,
  },
});

const AddButton: React.FC = () => {
  const { t } = useTranslation();

  const ref = useRef<BottomSheetModal>(null);

  const navigation = useNavigation();

  const navigateTo = useCallback(
    (path: RouteName) => {
      navigation.navigate(path);
      ref.current?.dismiss();
    },
    [navigation]
  );

  return (
    <>
      <GradientButton
        style={styles.button}
        onPress={() => ref.current?.present()}
        accessibilityLabel={t("new.title")}
        icon={
          <IconPlus
            width={Size[6]}
            height={Size[6]}
            strokeWidth={3}
            stroke="#ffffff"
          />
        }
      />
      <BottomSheetModal
        backdropComponent={BottomSheetBackdrop}
        backgroundComponent={null}
        handleComponent={null}
        ref={ref}
        snapPoints={["100%"]}
      >
        <BlurView
          style={StyleSheet.absoluteFillObject}
          blurType="dark"
          blurAmount={1}
        />
        <View style={styles.newModal}>
          <Heading level={2}>{t("new.title")}</Heading>
          <Spacer y={6} />
          <View style={styles.choices}>
            <Button
              variant="primary"
              onPress={() => navigateTo(RouteName.NewSelectSongs)}
              style={styles.choice}
            >
              {t("new.select_songs.title")}
            </Button>
            <Spacer x={3} />
            <GradientButton
              onPress={() => navigateTo(RouteName.NewQuickShare)}
              style={styles.choice}
            >
              {t("new.quick_share.title")}
            </GradientButton>
          </View>
          <Spacer y={6} />
          <TextButton onPress={() => ref.current?.dismiss()}>
            {t("common.navigation.go_back")}
          </TextButton>
        </View>
      </BottomSheetModal>
    </>
  );
};

export default AddButton;
