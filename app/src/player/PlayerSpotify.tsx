import {
  Dialog,
  DialogButton,
  DialogContent,
  DialogContentText,
  DialogFooter,
  DialogTitle,
} from "@/components/BottomSheet";
import player, { usePlaybackAuthentication } from "@auralous/player";
import { toast } from "@auralous/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import {
  ApiConfig,
  auth as SpotifyAuth,
  PlayerState as SpotifyPlayerState,
  remote as SpotifyRemote,
} from "react-native-spotify-remote";

const spotifyConfig: ApiConfig = {
  clientID: Config.SPOTIFY_CLIENT_ID,
  redirectURL: `auralous://sign-in/spotify/callback`,
};

const initialize = async (
  onSuccess: () => void,
  onError: (error: Error) => void
) => {
  try {
    // We don't use the result from this
    // but instead use the API provided access token
    // This is only to wake up Spotify App
    await SpotifyAuth.endSession();
    await SpotifyAuth.authorize(spotifyConfig);
    onSuccess();
  } catch (e) {
    onError(e);
  }
};

const connectWithAccessToken = async (
  accessToken: string | null | undefined,
  onError: (error: Error) => void
) => {
  try {
    await SpotifyRemote.disconnect();
    if (accessToken) await SpotifyRemote.connect(accessToken);
  } catch (e) {
    onError(e);
  }
};

const PlayerSpotify: FC = () => {
  const { t } = useTranslation();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [error]);

  useEffect(() => {
    const onRemoteConnected = () => setIsConnected(true);
    const onRemoteDisconnected = () => setIsConnected(false);
    SpotifyRemote.addListener("remoteConnected", onRemoteConnected);
    SpotifyRemote.addListener("remoteDisconnected", onRemoteDisconnected);
    return () => {
      SpotifyRemote.removeListener("remoteConnected", onRemoteConnected);
      SpotifyRemote.removeListener("remoteDisconnected", onRemoteDisconnected);
    };
  }, []);

  const { accessToken } = usePlaybackAuthentication();

  const doInitialize = useCallback(
    () => initialize(() => setIsInitialized(true), setError),
    []
  );

  useEffect(() => {
    if (!isInitialized) doInitialize();
  }, [isInitialized, doInitialize]);

  useEffect(() => {
    if (isInitialized) connectWithAccessToken(accessToken, setError);
  }, [isInitialized, accessToken]);

  useEffect(() => {
    return () => {
      SpotifyAuth.endSession();
      SpotifyRemote.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isConnected || !accessToken) return;

    const playByExternalId = async (externalId: string | null) => {
      if (!externalId) return SpotifyRemote.pause();
      await SpotifyRemote.playUri(`spotify:track:${externalId}`);
      player.play(); // this is just to confirm play status
    };
    let state: SpotifyPlayerState | undefined;

    const onStateChange = (v: SpotifyPlayerState) => {
      if (v.isPaused !== state?.isPaused) {
        if (v.isPaused) player.emit("paused");
        else player.emit("playing");
      }

      player.emit("time", v.playbackPosition || 0);

      // Guessing when the track has ended
      // since the SDK does not provide a way
      // to do so
      if (
        state &&
        v.isPaused &&
        v.playbackPosition === 0 &&
        state?.isPaused === false
      ) {
        player.emit("ended");
      }

      state = v;
    };

    player.registerPlayer({
      play: () => SpotifyRemote.resume(),
      seek: (ms) =>
        SpotifyRemote.seek(ms).then(
          () => player.emit("seeked"),
          () => undefined
        ),
      pause: () => SpotifyRemote.pause(),
      playByExternalId,
      setVolume: (p) => {
        // Remote SDK does not support setting volume so we rely on Web API
        return fetch(
          `https://api.spotify.com/v1/me/player/volume` +
            `?volume_percent=${p * 100}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      },
      // It is impossible to determine spotify without a promise so we rely on previous state
      isPlaying: () => !!state?.isPaused,
    });

    // Spotify SDK does not support subscribing to position
    // so we need polling to retrieve it, we poll every 1 sec
    const durationInterval = setInterval(async () => {
      const playerState = await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .catch(() => null);

      player.emit("time", playerState?.progress_ms || 0);
    }, 1000);

    SpotifyRemote.on("playerStateChanged", onStateChange);

    return () => {
      clearInterval(durationInterval);
      player.unregisterPlayer();
      SpotifyRemote.off("playerStateChanged", onStateChange);
    };
  }, [isConnected, accessToken]);

  if (error)
    return (
      <Dialog visible>
        <DialogTitle>{t("player.spotify.error_initialize_player")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("player.spotify.error_initialize_player_help")}
          </DialogContentText>
        </DialogContent>
        <DialogFooter>
          <DialogButton
            onPress={() => {
              setIsInitialized(false);
              setIsConnected(false);
              setError(null);
              doInitialize();
            }}
            variant="primary"
          >
            {t("common.action.retry")}
          </DialogButton>
        </DialogFooter>
      </Dialog>
    );

  return null;
};

export default PlayerSpotify;
