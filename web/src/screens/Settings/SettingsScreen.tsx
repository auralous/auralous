import { NavPlaceholder } from "@/components/Layout";
import { useAuthActions } from "@/gql/context";
import { SettingsScreenContent } from "@auralous/ui";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { RouteComponentProps } from "react-router";

export const SettingsScreen: FC<RouteComponentProps> = () => {
  const authActions = useAuthActions();

  const { i18n } = useTranslation();

  const changeLanguage = useCallback(
    (lang: string) => i18n.changeLanguage(lang),
    [i18n]
  );

  return (
    <>
      <NavPlaceholder />
      <SettingsScreenContent
        onSignOut={authActions.signOut}
        language={i18n.language.split("-")[0]}
        changeLanguage={changeLanguage}
      />
    </>
  );
};
