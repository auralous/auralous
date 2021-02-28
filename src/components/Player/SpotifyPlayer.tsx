import { useMe } from "hooks/user";
import { t } from "i18n/index";
import { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "redaxios";
import { verifyScript } from "utils/script-utils";
import usePlayer from "./usePlayer";
/// <reference path="spotify-web-playback-sdk" />

const BASE_URL = "https://api.spotify.com/v1";

const onError = (e: Spotify.Error) => toast.error(e.message);

export default function SpotifyPlayer() {
  const { player } = usePlayer();
  const me = useMe();

  useEffect(() => {
    let spotifyPlayer: Spotify.SpotifyPlayer | null = null;
    let spotifyState: Spotify.PlaybackState | null = null;
    let deviceId: string | null = null;

    let durationInterval: number; // setInterval

    const playByExternalId = async (externalId: string | null) => {
      if (!externalId)
        return (
          spotifyState?.track_window.current_track && spotifyPlayer?.pause()
        );

      const resp = await instance.put(
        `${BASE_URL}/me/player/play`,
        { uris: [`spotify:track:${externalId}`] },
        {
          validateStatus: () => true,
          params: { device_id: deviceId },
        }
      );

      if (resp.status !== 204 && resp.data?.error) {
        if (resp.data.error.reason === "PREMIUM_REQUIRED")
          return toast.error(t("player.spotify.premiumRequired"), {
            duration: 25 * 1000,
          });
        else onError(resp.data.error);
      }
    };

    const onReady: Spotify.PlaybackInstanceListener = ({ device_id }) => {
      deviceId = device_id;
      player.registerPlayer({
        play: () => spotifyPlayer?.resume(),
        seek: (ms) => spotifyPlayer?.seek(ms).then(() => player.emit("seeked")),
        pause: () => spotifyPlayer?.pause(),
        playByExternalId: playByExternalId,
        setVolume: (p) => spotifyPlayer?.setVolume(p),
        // Note: It is impossible to determine spotify without a promise
        isPlaying: () => !spotifyState?.paused,
      });
      durationInterval = window.setInterval(async () => {
        player.emit(
          "time",
          (await spotifyPlayer?.getCurrentState())?.position || 0
        );
      }, 1000);
    };

    const instance: typeof axios = axios.create({
      headers: { Authorization: `Bearer ${me?.accessToken}` },
    });

    const onState: Spotify.PlaybackStateListener = (state) => {
      if (!state) return;
      state.paused ? player.emit("paused") : player.emit("playing");
      // FIXME: Temporary workaround for END state https://github.com/spotify/web-playback-sdk/issues/35#issuecomment-509159445
      if (
        spotifyState &&
        state.track_window.previous_tracks[0]?.id ===
          state.track_window.current_track.id &&
        !spotifyState.paused &&
        state.paused
      ) {
        // track end
        player.emit("ended");
      }
      spotifyState = state;
    };

    async function init() {
      if (!window.Spotify?.Player || spotifyPlayer || !me?.accessToken) return;
      spotifyPlayer = new window.Spotify.Player({
        name: "Auralous Web Player",
        getOAuthToken: (cb) => me?.accessToken && cb(me.accessToken),
      });
      // readiness
      spotifyPlayer.addListener("ready", onReady);
      // state handling
      spotifyPlayer.addListener("player_state_changed", onState);
      // error handling

      spotifyPlayer.addListener("authentication_error", onError);
      spotifyPlayer.addListener("initialization_error", () =>
        toast.error(t("player.spotify.notSupported"), {
          duration: 25 * 1000,
        })
      );
      spotifyPlayer.addListener("account_error", onError);
      spotifyPlayer.addListener("playback_error", onError);
      // connect
      spotifyPlayer.connect();
    }

    window.onSpotifyWebPlaybackSDKReady = init;
    verifyScript("https://sdk.scdn.co/spotify-player.js").then(init);

    return function cleanupSpotifyPlayer() {
      window.clearInterval(durationInterval);
      // @ts-expect-error: DT defines this as non null
      window.onSpotifyWebPlaybackSDKReady = null;
      player.unregisterPlayer();
      if (!spotifyPlayer) return;
      spotifyPlayer.removeListener("ready");
      spotifyPlayer.removeListener("player_state_changed");
      spotifyPlayer.removeListener("authentication_error");
      spotifyPlayer.removeListener("initialization_error");
      spotifyPlayer.removeListener("account_error");
      spotifyPlayer.removeListener("playback_error");
      spotifyPlayer.disconnect();
      spotifyPlayer = null;
      spotifyState = null;
    };
  }, [me?.accessToken, player]);
  return null;
}
