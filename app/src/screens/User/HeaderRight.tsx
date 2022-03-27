import { IconMoreVertical } from "@/assets";
import { ContextMenuValue } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import type { ParamList, RouteName } from "@/screens/types";
import { useUIDispatch } from "@/ui-context";
import { useUserQuery } from "@auralous/api";
import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

const HeaderRight: FC = () => {
  const { params } = useRoute<RouteProp<ParamList, RouteName.User>>();

  const [{ data }] = useUserQuery({
    variables: { username: params.username },
  });

  const { t } = useTranslation();

  const uiDispatch = useUIDispatch();

  return (
    <Button
      variant="text"
      icon={<IconMoreVertical width={21} height={21} />}
      accessibilityLabel={t("common.navigation.open_menu")}
      onPress={() =>
        data?.user &&
        uiDispatch({
          type: "contextMenu",
          value: ContextMenuValue.user(uiDispatch, data.user),
        })
      }
    />
  );
};

export const headerRight = () => <HeaderRight />;
