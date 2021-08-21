import {
  Dialog,
  DialogButton,
  DialogContent,
  DialogContentText,
  DialogFooter,
  DialogTitle,
} from "@/components/BottomSheet";
import { useStoryUnliveMutation } from "@auralous/api";
import player from "@auralous/player";
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
    <Dialog
      visible={!!stopLiveIntention}
      onDismiss={stopLiveIntention?.dismiss}
    >
      <DialogContent>
        <DialogTitle>{t("story_edit.live.play_other_prompt")}</DialogTitle>
        <DialogContentText>
          {t("story_edit.live.unlive_prompt")}
        </DialogContentText>
      </DialogContent>
      <DialogFooter>
        <DialogButton onPress={stopLiveIntention?.dismiss}>
          {t("common.action.cancel")}
        </DialogButton>
        <DialogButton variant="primary" onPress={unliveAndContinue}>
          {t("story_edit.live.unlive")}
        </DialogButton>
      </DialogFooter>
    </Dialog>
  );
};
