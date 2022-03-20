import { Button } from "@/components/Button";
import { useContainerStyle } from "@/components/Container";
import { Spacer } from "@/components/Spacer";
import { Heading } from "@/components/Typography";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import { useMeQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import LanguageUpdate from "./LanguageUpdate";
import UserEditor from "./UserEditor";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: Size[4],
  },
  section: {
    borderColor: Colors.border,
    borderRadius: Size[1],
    borderWidth: StyleSheet.hairlineWidth,
    padding: Size[4],
  },
});

export const SettingsScreenContent: FC<{
  onSignOut(): void;
  language: string | undefined;
  changeLanguage(language: string | undefined): void;
}> = ({ onSignOut, language, changeLanguage }) => {
  const { t } = useTranslation();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  const uiDispatch = useUiDispatch();
  const gotoSignIn = useCallback(() => {
    uiDispatch({ type: "signIn", value: { visible: true } });
  }, [uiDispatch]);

  const containerStyle = useContainerStyle();

  return (
    <ScrollView style={styles.root} contentContainerStyle={containerStyle}>
      <View style={styles.section}>
        <Heading level={5} align="center">
          {t("settings.app")}
        </Heading>
        <Spacer y={4} />
        <LanguageUpdate language={language} changeLanguage={changeLanguage} />
      </View>
      <Spacer y={2} />
      <View style={styles.section}>
        <Heading level={5} align="center">
          {t("settings.me")}
        </Heading>
        <Spacer y={4} />
        {me ? (
          <>
            <UserEditor user={me.user} platform={me.platform} />
            <Spacer y={2} />
            <Button onPress={onSignOut}>{t("settings.sign_out")}</Button>
          </>
        ) : (
          <>
            <Button onPress={gotoSignIn}>{t("sign_in.title")}</Button>
          </>
        )}
      </View>
    </ScrollView>
  );
};
