import { IconPlayListAdd, IconZap } from "@/assets";
import { BottomSheetActionMenu } from "@/components/BottomSheet";
import { RouteName } from "@/screens/types";
import { useUi, useUiDispatch } from "@/ui-context";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const CreateSessionModal: FC = () => {
  const { t } = useTranslation();
  const ui = useUi();
  const uiDispatch = useUiDispatch();
  const onDismiss = useCallback(
    () => uiDispatch({ type: "newSession", value: { visible: false } }),
    [uiDispatch]
  );
  const navigation = useNavigation();
  const navigateTo = useCallback(
    (path: RouteName) => {
      navigation.navigate(path);
      onDismiss();
    },
    [navigation, onDismiss]
  );

  return (
    <BottomSheetActionMenu
      title={t("new.title")}
      visible={ui.newSession.visible}
      onDismiss={onDismiss}
      items={[
        {
          icon: <IconPlayListAdd />,
          text: t("new.select_songs.title"),
          onPress: () => navigateTo(RouteName.NewSelectSongs),
        },
        {
          icon: <IconZap />,
          text: t("new.quick_share.title"),
          onPress: () => navigateTo(RouteName.NewQuickShare),
        },
      ]}
    />
  );
};
