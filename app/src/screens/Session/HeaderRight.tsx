import { IconMoreVertical } from "@/assets";
import { ContextMenuValue } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import type { ParamList, RouteName } from "@/screens/types";
import { useUIDispatch } from "@/ui-context";
import { useMeQuery, useSessionQuery } from "@auralous/api";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

const HeaderRight: FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<ParamList, RouteName.Session>>();

  const [{ data }] = useSessionQuery({
    variables: {
      id: params.id,
    },
  });

  const { t } = useTranslation();

  const uiDispatch = useUIDispatch();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const isCreator = data?.session?.creatorId === me?.user.id;

  return (
    <Button
      variant="text"
      icon={<IconMoreVertical width={21} height={21} />}
      accessibilityLabel={t("common.navigation.open_menu")}
      onPress={() => {
        data?.session &&
          uiDispatch({
            type: "contextMenu",
            value: ContextMenuValue.session(
              uiDispatch,
              navigation,
              data.session,
              isCreator
            ),
          });
      }}
    />
  );
};

export const headerRight = () => <HeaderRight />;
