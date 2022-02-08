import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    marginTop: Size[4],
  },
  root: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.5)",
    justifyContent: "center",
    zIndex: 10,
    ...StyleSheet.absoluteFillObject,
  },
});

export const RequireEndSessionModal: FC<{
  visible: boolean;
  sessionId?: string;
}> = ({ visible, sessionId }) => {
  const { t } = useTranslation();

  const navigation = useNavigation();
  if (!visible) return null;
  return (
    <View style={styles.root}>
      <View style={styles.root}>
        <Text bold>{t("session_edit.live.end_current_to_continue")}</Text>
        <View style={styles.buttons}>
          <Button
            onPress={() =>
              navigation.navigate(RouteName.SessionEdit, {
                id: sessionId || "",
                showEndModal: true,
              })
            }
          >
            {t("session_edit.live.end")}
          </Button>
          <Spacer x={2} />
          <Button
            variant="primary"
            onPress={() =>
              navigation.navigate(RouteName.Session, { id: sessionId || "" })
            }
          >
            {t("session.go_to_session")}
          </Button>
        </View>
      </View>
    </View>
  );
};
