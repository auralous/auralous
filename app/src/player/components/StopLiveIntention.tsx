import { useStoryUnliveMutation } from "@auralous/api";
import player from "@auralous/player";
import { Dialog } from "@auralous/ui";
import { FC, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { PlayerComponentInternalContext } from "./PlayerComponentInternalContext";

// A dialog to be shown if user try to play something else
// while having a live story

export const StopLiveIntention: FC = () => {
  const { t } = useTranslation();

  const { stopLiveIntention } = useContext(PlayerComponentInternalContext);

  const [, unliveStory] = useStoryUnliveMutation();

  const unliveAndContinue = useCallback(async () => {
    if (!stopLiveIntention) return;
    stopLiveIntention.dismiss();
    player.playContext(stopLiveIntention.intendedCurrentContext);
    await unliveStory({
      id: stopLiveIntention.currentStoryId,
    });
    stopLiveIntention.dismiss();
  }, [stopLiveIntention, unliveStory]);

  return (
    <Dialog.Dialog
      visible={!!stopLiveIntention}
      onDismiss={stopLiveIntention?.dismiss}
    >
      <Dialog.Content>
        <Dialog.Title>{t("story_edit.live.play_other_prompt")}</Dialog.Title>
        <Dialog.ContentText>
          {t("story_edit.live.unlive_prompt")}
        </Dialog.ContentText>
      </Dialog.Content>
      <Dialog.Footer>
        <Dialog.Button onPress={stopLiveIntention?.dismiss}>
          {t("common.action.cancel")}
        </Dialog.Button>
        <Dialog.Button variant="primary" onPress={unliveAndContinue}>
          {t("story_edit.live.unlive")}
        </Dialog.Button>
      </Dialog.Footer>
    </Dialog.Dialog>
  );
};
