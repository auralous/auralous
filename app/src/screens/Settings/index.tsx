import { useAuthActions } from "@/gql/context";
import { getPreferredLanguage } from "@/i18n";
import type { ParamList, RouteName } from "@/screens/types";
import { STORAGE_KEY_SETTINGS_LANGUAGE } from "@/utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocales } from "react-native-localize";
import { SettingsScreenContent } from "./components";

export const SettingsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Settings>
> = () => {
  const authActions = useAuthActions();

  const { i18n } = useTranslation();

  const [language, setLanguage] = useState<string | undefined>();
  useEffect(() => {
    getPreferredLanguage().then(setLanguage);
  }, []);

  const changeLanguage = useCallback(
    (newLanguage: string | undefined) => {
      setLanguage(newLanguage);
      i18n.changeLanguage(newLanguage || getLocales()[0].languageCode);
      if (newLanguage)
        AsyncStorage.setItem(STORAGE_KEY_SETTINGS_LANGUAGE, newLanguage);
      else AsyncStorage.removeItem(STORAGE_KEY_SETTINGS_LANGUAGE);
    },
    [i18n]
  );

  return (
    <SettingsScreenContent
      onSignOut={authActions.signOut}
      language={language}
      changeLanguage={changeLanguage}
    />
  );
};
