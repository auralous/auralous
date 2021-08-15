import { supportedLanguages } from "@/i18n";
import {
  Button,
  Colors,
  Heading,
  IconEdit,
  IconX,
  Size,
  Spacer,
  Text,
  TextButton,
} from "@auralous/ui";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const snapPoints = [240];

const styles = StyleSheet.create({
  option: {
    marginBottom: Size[2],
  },
  sheet: {
    backgroundColor: Colors.background,
    padding: Size[4],
  },
  sheetHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sheetOptions: {
    flex: 1,
  },
  value: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    padding: Size[2],
  },
});

const LanguageUpdate: FC = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string | undefined>();
  useEffect(() => {
    // initial value
    AsyncStorage.getItem("settings/language").then((value) =>
      setLanguage(value || undefined)
    );
  }, []);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const open = useCallback(() => bottomSheetRef.current?.present(), []);
  const close = useCallback(() => bottomSheetRef.current?.dismiss(), []);
  useEffect(() => {
    if (bottomSheetIndex === -1) return;
    const bhl = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });
    return bhl.remove;
  }, [bottomSheetIndex, close]);

  const updateLanguage = useCallback(
    (newLanguage: string | undefined) => {
      close();
      setLanguage(newLanguage);
      i18n.changeLanguage(newLanguage);
      if (newLanguage) AsyncStorage.setItem("settings/language", newLanguage);
      else AsyncStorage.removeItem("settings/language");
    },
    [i18n, close]
  );

  return (
    <>
      <View>
        <Text color="textSecondary" bold align="center">
          {t("settings.language.title")}
        </Text>
        <Spacer y={4} />
        <TouchableOpacity style={styles.value} onPress={open}>
          <Text align="center" color="textSecondary">
            {t(`settings.language.${language || "_"}`)}
          </Text>
          <Spacer x={2} />
          <IconEdit
            color={Colors.textSecondary}
            width={14}
            height={14}
            accessibilityLabel={t("settings.language.title_edit")}
          />
        </TouchableOpacity>
      </View>
      <BottomSheetModal
        backdropComponent={BottomSheetBackdrop}
        backgroundComponent={null}
        handleComponent={null}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        style={styles.sheet}
        onChange={setBottomSheetIndex}
      >
        <View style={styles.sheetHeading}>
          <Heading level={6}>{t("settings.language.title_edit")}</Heading>
          <GestureHandlerRootView>
            <TextButton
              icon={<IconX />}
              onPress={close}
              accessibilityLabel={t("common.navigation.go_back")}
            />
          </GestureHandlerRootView>
        </View>
        <Spacer y={2} />
        <BottomSheetScrollView style={styles.sheetOptions}>
          {supportedLanguages.map((languageOpt) => (
            <Button
              key={languageOpt}
              style={styles.option}
              onPress={() => updateLanguage(languageOpt)}
            >
              {t(`settings.language.${languageOpt}`)}
            </Button>
          ))}
          <Button
            style={styles.option}
            onPress={() => updateLanguage(undefined)}
          >
            {t(`settings.language._`)}
          </Button>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
};

export default LanguageUpdate;
