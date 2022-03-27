import { IconMoreVertical } from "@/assets";
import { ContextMenuValue } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import type { ParamList, RouteName } from "@/screens/types";
import { useUIDispatch } from "@/ui-context";
import { usePlaylistQuery } from "@auralous/api";
import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

const HeaderRight: FC = () => {
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<ParamList, RouteName.Playlist>>();

  const [{ data }] = usePlaylistQuery({
    variables: {
      id: params.id,
    },
  });

  const uiDispatch = useUIDispatch();

  return (
    <Button
      variant="text"
      icon={<IconMoreVertical width={21} height={21} />}
      accessibilityLabel={t("common.navigation.open_menu")}
      onPress={() => {
        data?.playlist &&
          uiDispatch({
            type: "contextMenu",
            value: ContextMenuValue.playlist(uiDispatch, data.playlist),
          });
      }}
    />
  );
};

export const headerRight = () => <HeaderRight />;
