import { Button, Container, Heading, Spacer } from "@/components";
import { useUiDispatch } from "@/context";
import { Colors, Size } from "@/styles";
import { useMeQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import LanguageUpdate from "./LanguageUpdate";
import UserEditor from "./UserEditor";

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  root: {
    flex: 1,
    padding: Size[4],
  },
  section: {
    borderColor: Colors.border,
    borderRadius: Size[4],
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

  return (
    <Container style={styles.container}>
      <ScrollView style={styles.root}>
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
    </Container>
  );
};
