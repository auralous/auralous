import { useSessionEndMutation } from "@auralous/api";
import player from "@auralous/player";
import { Dialog } from "@auralous/ui";
import { FC, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { PlayerComponentInternalContext } from "./PlayerComponentInternalContext";

// A dialog to be shown if user try to play something else
// while having a live session

export const StopLiveIntention: FC = () => {
  const { t } = useTranslation();

  const { stopLiveIntention } = useContext(PlayerComponentInternalContext);

  const [{ fetching }, endSession] = useSessionEndMutation();

  const endAndContinue = useCallback(async () => {
    if (!stopLiveIntention) return;
    player.playContext(stopLiveIntention.intendedCurrentContext);
    const result = await endSession({
      id: stopLiveIntention.currentSessionId,
    });
    if (!result.error) {
      stopLiveIntention.dismiss();
    }
  }, [stopLiveIntention, endSession]);

  return (
    <Dialog.Dialog
      visible={!!stopLiveIntention}
      onDismiss={!fetching ? stopLiveIntention?.dismiss : undefined}
    >
      <Dialog.Content>
        <Dialog.Title>{t("session_edit.live.play_other_prompt")}</Dialog.Title>
        <Dialog.ContentText>
          {t("session_edit.live.end_prompt")}
        </Dialog.ContentText>
      </Dialog.Content>
      <Dialog.Footer>
        <Dialog.Button onPress={stopLiveIntention?.dismiss} disabled={fetching}>
          {t("common.action.cancel")}
        </Dialog.Button>
        <Dialog.Button
          variant="primary"
          onPress={endAndContinue}
          disabled={fetching}
        >
          {t("session_edit.live.end")}
        </Dialog.Button>
      </Dialog.Footer>
    </Dialog.Dialog>
  );
};
