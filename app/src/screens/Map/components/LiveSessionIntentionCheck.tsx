import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { useSessionCurrentLiveQuery } from "@auralous/api";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    marginTop: Size[4],
  },
  root: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.8)",
    flex: 1,
    justifyContent: "center",
  },
});

// check if there is an ongoing and prompt the user
//  to end that session
const LiveSessionIntentionCheck: FC = () => {
  const { t } = useTranslation();

  const [{ data: dataSessionCurrentLive }] = useSessionCurrentLiveQuery({
    variables: { mine: true },
  });

  const navigation = useNavigation();

  const isFocused = useIsFocused();

  if (isFocused && dataSessionCurrentLive?.sessionCurrentLive) {
    return (
      <Modal transparent>
        <View style={styles.root}>
          <Text bold>{t("session_edit.live.end_current_to_continue")}</Text>
          <View style={styles.buttons}>
            <Button
              onPress={() =>
                navigation.navigate(RouteName.SessionEdit, {
                  id: dataSessionCurrentLive.sessionCurrentLive
                    ?.sessionId as string,
                  showEndModal: true,
                })
              }
            >
              {t("session_edit.live.end")}
            </Button>
            <Spacer x={2} />
            <Button variant="primary" onPress={navigation.goBack}>
              {t("common.navigation.go_back")}
            </Button>
          </View>
        </View>
      </Modal>
    );
  }

  return null;
};

export default LiveSessionIntentionCheck;
