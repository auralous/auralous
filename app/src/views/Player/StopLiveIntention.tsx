import { Dialog } from "@/components/Dialog";
import { useUi, useUiDispatch } from "@/context";
import player from "@/player";
import { useSessionEndMutation } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// A dialog to be shown if user try to play something else
// while having a live session

export const StopLiveIntention: FC = () => {
  const { t } = useTranslation();

  const { stopLiveOnPlay } = useUi();
  const uiDispatch = useUiDispatch();

  const onDismiss = useCallback(
    () => uiDispatch({ type: "stopLiveOnPlay", value: { visible: false } }),
    [uiDispatch]
  );

  const [{ fetching }, endSession] = useSessionEndMutation();

  const endAndContinue = useCallback(async () => {
    if (!stopLiveOnPlay.intention) return;
    player.playContext(stopLiveOnPlay.intention.nextPlaybackContext);
    const result = await endSession({
      id: stopLiveOnPlay.intention.sessionId,
    });
    if (!result.error) {
      onDismiss();
    }
  }, [stopLiveOnPlay.intention, onDismiss, endSession]);

  return (
    <Dialog.Dialog
      visible={stopLiveOnPlay.visible}
      onDismiss={!fetching ? onDismiss : undefined}
    >
      <Dialog.Content>
        <Dialog.Title>{t("session_edit.live.play_other_prompt")}</Dialog.Title>
        <Dialog.ContentText>
          {t("session_edit.live.end_prompt")}
        </Dialog.ContentText>
      </Dialog.Content>
      <Dialog.Footer>
        <Dialog.Button onPress={onDismiss} disabled={fetching}>
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
