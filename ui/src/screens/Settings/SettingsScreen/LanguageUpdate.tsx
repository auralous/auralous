import { IconEdit } from "@/assets";
import {
  Button,
  Dialog,
  Spacer,
  Text,
  useBackHandlerDismiss,
  useDialog,
} from "@/components";
import { Colors, Size } from "@/styles";
import { supportedLanguages } from "@auralous/locales";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  option: {
    marginBottom: Size[2],
  },
  value: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    padding: Size[2],
  },
});

const LanguageUpdate: FC<{
  language: string | undefined;
  changeLanguage(language: string | undefined): void;
}> = ({ language, changeLanguage }) => {
  const { t, i18n } = useTranslation();
  i18n.languages;

  const [visible, present, dismiss] = useDialog();

  useBackHandlerDismiss(visible, dismiss);

  const updateLanguage = useCallback(
    (newLanguage: string | undefined) => {
      dismiss();
      changeLanguage(newLanguage || undefined);
    },
    [changeLanguage, dismiss]
  );

  return (
    <>
      <View>
        <Text color="textSecondary" bold align="center">
          {t("settings.language.title")}
        </Text>
        <Spacer y={4} />
        <TouchableOpacity style={styles.value} onPress={present}>
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
      <Dialog.Dialog visible={visible} onDismiss={dismiss}>
        <Dialog.Title>{t("settings.language.title_edit")}</Dialog.Title>
        <Dialog.Content>
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
        </Dialog.Content>
      </Dialog.Dialog>
    </>
  );
};

export default LanguageUpdate;
