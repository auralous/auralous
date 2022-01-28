import { Dialog } from "@/components/Dialog";
import { Spacer } from "@/components/Spacer";
import { toast } from "@/components/Toast";
import type { FC } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const PlayerSpotifyError: FC<{
  error: Error | Spotify.Error;
  onRetry(): void;
}> = ({ error, onRetry }) => {
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const { t } = useTranslation();

  return (
    <Dialog.Dialog visible>
      <Dialog.Title>{t("player.spotify.error_initialize_player")}</Dialog.Title>
      <Dialog.Content>
        <Dialog.ContentText>
          {t("player.spotify.error_initialize_player_help")}
        </Dialog.ContentText>
        <Spacer y={2} />
        <Dialog.ContentText size="xs" color="textTertiary">
          {error.message}
        </Dialog.ContentText>
      </Dialog.Content>
      <Dialog.Footer>
        <Dialog.Button onPress={onRetry} variant="primary">
          {t("common.action.retry")}
        </Dialog.Button>
      </Dialog.Footer>
    </Dialog.Dialog>
  );
};

export default PlayerSpotifyError;
