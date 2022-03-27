import { IconHeadphones, IconSettings } from "@/assets";
import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useUIDispatch } from "@/ui-context";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  headerBtn: {
    height: Size[8],
    paddingHorizontal: Size[2],
  },
  headerBtns: {
    flexDirection: "row",
  },
});

const HeaderRight: FC = () => {
  const { t } = useTranslation();
  const uiDispatch = useUIDispatch();
  const navigation = useNavigation();
  return (
    <View style={styles.headerBtns}>
      <Button
        onPress={() => navigation.navigate(RouteName.Settings)}
        style={styles.headerBtn}
        accessibilityLabel={t("settings.title")}
        icon={<IconSettings width={20} height={20} />}
      />
      <Spacer x={2} />
      <Button
        variant="primary"
        onPress={() =>
          uiDispatch({ type: "newSession", value: { visible: true } })
        }
        style={styles.headerBtn}
        accessibilityLabel={t("new.title")}
        icon={<IconHeadphones width={20} height={20} />}
      >
        {t("common.action.create")}
      </Button>
    </View>
  );
};

export const headerRight = () => <HeaderRight />;
