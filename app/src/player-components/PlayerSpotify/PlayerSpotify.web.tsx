import player, { usePlaybackAuthentication } from "@/player";
import { injectScript } from "@/utils/scripts";
import type { FC } from "react";
import { useEffect, useState } from "react";
import PlayerSpotifyError from "./PlayerSpotifyError";

const isCorrectTrack = (
  currentTrack: Spotify.Track | undefined | null,
  expectedExternalTrackId: string | null
) => {
  if (expectedExternalTrackId && !currentTrack) return false;
  // @ts-ignore: sometimes spotify play an alternative track (due to eg region-lock)
  if (currentTrack.linked_from.id === expectedExternalTrackId) return true;
  return currentTrack?.id === expectedExternalTrackId;
};

/// <reference path="spotify-web-playback-sdk" />
const PlayerSpotify: FC = () => {
  const [error, setError] = useState<Spotify.Error | null>(null);
  const [loaded, setLoaded] = useState(false);

  const { accessToken } = usePlaybackAuthentication();

  useEffect(() => {
    if (!loaded || !accessToken) return;

    const spotifyPlayer = new window.Spotify.Player({
      name: "Auralous Web Player",
      getOAuthToken: (cb) => cb(accessToken),
      volume: 1,
    });

    let spotifyState: Spotify.PlaybackState | null = null;
    let playByExternalId:
      | undefined
      | ((externalId: string | null) => Promise<void>) = undefined;
    const onReady: Spotify.PlaybackInstanceListener = ({ device_id }) => {
      player.registerPlayer({
        play: () => spotifyPlayer.resume(),
        seek: (ms) =>
          spotifyPlayer.seek(ms).then(
            () => player.emit("seeked"),
            () => undefined
          ),
        pause: () => spotifyPlayer.pause(),
        playByExternalId: (playByExternalId = async (
          externalId: string | null
        ) => {
          if (!externalId) {
            player.emit("played_external", null);
            return spotifyPlayer.pause();
          }
          await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
            {
              method: "PUT",
              body: JSON.stringify({ uris: [`spotify:track:${externalId}`] }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        }),
        setVolume: (p) => spotifyPlayer.setVolume(p),
        // It is impossible to determine spotify without a promise so we rely on previous state
        isPlaying: () => !!spotifyState?.paused,
      });
    };

    let durationInterval: number;
    const onStateChange: Spotify.PlaybackStateListener = (state) => {
      if (!state) return;

      if (
        state.track_window.current_track.id !==
        spotifyState?.track_window.current_track.id
      ) {
        const expectedExternalTrackId =
          player.getCurrentPlayback().externalTrackId;
        if (
          !isCorrectTrack(
            state.track_window.current_track,
            expectedExternalTrackId
          )
        ) {
          // mismatch track id
          playByExternalId?.(expectedExternalTrackId);
          return;
        }

        player.emit("played_external", state.track_window.current_track.id);
        player.emit("play");
      }

      if (state.paused !== spotifyState?.paused) {
        if (state.paused) player.emit("paused");
        else player.emit("playing");
      }
      player.emit("time", state.position);
      // FIXME: Temporary workaround for END state
      // https://github.com/spotify/web-playback-sdk/issues/35#issuecomment-509159445
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

      window.clearInterval(durationInterval);
      if (!spotifyState.paused) {
        durationInterval = window.setInterval(() => {
          if (!spotifyState) return window.clearInterval(durationInterval);
          spotifyState.position += 1000;
          player.emit("time", spotifyState.position);
        }, 1000);
      }
    };

    spotifyPlayer.addListener("ready", onReady);

    spotifyPlayer.addListener("player_state_changed", onStateChange);

    spotifyPlayer.addListener("authentication_error", setError);
    spotifyPlayer.addListener("initialization_error", setError);
    spotifyPlayer.addListener("account_error", setError);
    spotifyPlayer.addListener("playback_error", (e) => console.error(e));

    // connect
    spotifyPlayer.connect();

    return () => {
      player.unregisterPlayer();

      spotifyPlayer.removeListener("ready");
      spotifyPlayer.removeListener("player_state_changed");

      spotifyPlayer.removeListener("authentication_error");
      spotifyPlayer.removeListener("initialization_error");
      spotifyPlayer.removeListener("account_error");
      spotifyPlayer.removeListener("playback_error");

      spotifyPlayer.disconnect();

      window.clearInterval(durationInterval);
    };
  }, [loaded, accessToken]);

  useEffect(() => {
    if (loaded) return;
    if (window.Spotify) {
      setLoaded(true);
    }

    window.onSpotifyWebPlaybackSDKReady = () => setLoaded(true);
    injectScript("https://sdk.scdn.co/spotify-player.js");

    return () => {
      // @ts-expect-error: DT defines this as non null
      window.onSpotifyWebPlaybackSDKReady = null;
    };
  }, [loaded]);

  if (error) {
    return (
      <PlayerSpotifyError
        error={error}
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  return null;
};

export default PlayerSpotify;
