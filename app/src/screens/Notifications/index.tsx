import type { ParamList, RouteName } from "@/screens/types";
import { AuthPrompt } from "@/views/AuthPrompt";
import { useMeQuery } from "@auralous/api";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { NotificationsScreenContent } from "./NotificationsScreenContent";

const NotificationsScreen: FC<
  BottomTabScreenProps<ParamList, RouteName.Notifications>
> = () => {
  const [{ data: dataMe }] = useMeQuery();
  const { t } = useTranslation();
  if (!dataMe?.me)
    return <AuthPrompt prompt={t("notifications.auth_prompt")} />;
  return <NotificationsScreenContent />;
};

export default NotificationsScreen;
