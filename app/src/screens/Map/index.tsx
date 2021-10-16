import { IconX } from "@/assets";
import { Button } from "@/components/Button";
import { SlideModal } from "@/components/Dialog";
import player from "@/player";
import type { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { SessionPager } from "@/views/SessionPager";
import type { Session } from "@auralous/api";
import { useSessionCurrentLiveQuery } from "@auralous/api";
import { useIsFocused } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { RequireEndSessionModal } from "../_commonContent/RequireEndSessionModal";
import MapController from "./components/MapController";

const styles = StyleSheet.create({
  closeBtn: {
    position: "absolute",
    right: Size[4],
    top: Size[4],
  },
  root: {
    flex: 1,
  },
  wrapper: {
    backgroundColor: "rgba(0,0,0,.5)",
    flex: 1,
  },
});

const MapScreen: FC<NativeStackScreenProps<ParamList, RouteName.Map>> = () => {
  const { t } = useTranslation();

  const pageInteracted = useRef(false);

  const [sessions, setSessions] = useState<Session[]>([]);

  const onClose = useCallback(() => {
    // in the case there is current session, closing the page
    // ny clicking go back on "you must end current session"
    // prompt will stop the playback)
    if (!pageInteracted.current) return;
    player.playContext(null);
    setSessions([]);
  }, []);

  const onSelected = useCallback(
    (index: number) => {
      pageInteracted.current = true;
      player.playContext({
        id: sessions[index].id,
        shuffle: false,
        type: "session",
      });
    },
    [sessions]
  );

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) {
      // remove if navigate away
      onClose();
    }
  }, [isFocused, onClose]);

  const [{ data: dataSessionCurrentLive }] = useSessionCurrentLiveQuery({
    variables: { mine: true },
  });

  return (
    <View style={styles.root}>
      <RequireEndSessionModal
        visible={!!dataSessionCurrentLive?.sessionCurrentLive}
        sessionId={dataSessionCurrentLive?.sessionCurrentLive?.sessionId}
      />
      <MapController setSessions={setSessions} />
      <SlideModal
        visible={isFocused && sessions.length > 0}
        onDismiss={onClose}
      >
        <View style={styles.wrapper}>
          <Button
            accessibilityLabel={t("common.navigation.close")}
            style={styles.closeBtn}
            icon={<IconX />}
            onPress={onClose}
          />
          <SessionPager sessions={sessions} onSelected={onSelected} />
        </View>
      </SlideModal>
    </View>
  );
};

export default MapScreen;
