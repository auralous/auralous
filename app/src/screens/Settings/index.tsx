import { useAuthActions } from "@/gql/context";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { useMeQuery } from "@auralous/api";
import { Button, Colors, Heading, Size, Spacer } from "@auralous/ui";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LanguageUpdate from "./components/LanguageUpdate";
import UserEditor from "./components/UserEditor";

const styles = StyleSheet.create({
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

export const SettingsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Settings>
> = ({ navigation }) => {
  const { t } = useTranslation();
  const authActions = useAuthActions();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  const gotoSignIn = useCallback(() => {
    navigation.navigate(RouteName.SignIn);
  }, [navigation]);

  return (
    <ScrollView style={styles.root}>
      <View style={styles.section}>
        <Heading level={5} align="center">
          {t("settings.app")}
        </Heading>
        <Spacer y={4} />
        <LanguageUpdate />
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
            <Button onPress={authActions.signOut}>
              {t("settings.sign_out")}
            </Button>
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
