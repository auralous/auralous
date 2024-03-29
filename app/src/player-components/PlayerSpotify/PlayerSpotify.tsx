import { Config } from "@/config";
import player from "@/player";
import { externalTrackIdFromTrackId } from "@/player/utils";
import type { FC } from "react";
import { memo, useCallback, useEffect, useState } from "react";
import type {
  ApiConfig,
  PlayerContext as SpotifyPlayerContext,
  PlayerState as SpotifyPlayerState,
} from "react-native-spotify-remote";
import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
} from "react-native-spotify-remote";
import PlayerSpotifyError from "./PlayerSpotifyError";

const spotifyConfig: ApiConfig = {
  clientID: Config.SPOTIFY_CLIENT_ID,
  redirectURL: `auralous://sign-in/spotify/callback`,
};

const isCorrectTrack = (
  v: SpotifyPlayerContext,
  expectedExternalTrackId: string | null
) => {
  // FIXME: need to handle case of alternative track (like web version)
  if (expectedExternalTrackId && !v) return false;
  const externalTrackId = v.uri.split(":")[2];
  return externalTrackId === expectedExternalTrackId;
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
    onError(e as Error);
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
    onError(e as Error);
  }
};

const PlayerSpotify: FC<{ accessToken: string | null }> = ({ accessToken }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
      SpotifyRemote.pause();
      SpotifyAuth.endSession();
      SpotifyRemote.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isConnected || !accessToken) return;

    let state: SpotifyPlayerState | undefined;

    const playByExternalId = async (externalId: string | null) => {
      if (!externalId) return SpotifyRemote.pause();
      await SpotifyRemote.playUri(`spotify:track:${externalId}`);
      player.emit("played_external", externalId);
      player.emit("play");
    };

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
        state?.track &&
        v.playbackPosition === 0 &&
        state?.isPaused === false &&
        v.isPaused
      ) {
        player.emit("ended");
      }

      state = v;
    };

    const playerStateChangedSub = SpotifyRemote.addListener(
      "playerStateChanged",
      onStateChange
    );

    const onContextChange = (v: SpotifyPlayerContext) => {
      const currentTrackId = player.getState().source.trackId;
      const expectedExternalTrackId = currentTrackId
        ? externalTrackIdFromTrackId(currentTrackId)
        : null;
      if (!isCorrectTrack(v, expectedExternalTrackId)) {
        // mismatch track id
        playByExternalId(expectedExternalTrackId);
        return;
      }
      player.emit("played_external", v.uri.split(":")[2]);
    };

    const playerContextChangedSub = SpotifyRemote.addListener(
      "playerContextChanged",
      onContextChange
    );

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

    return () => {
      playerStateChangedSub.remove();
      playerContextChangedSub.remove();
      clearInterval(durationInterval);
      player.unregisterPlayer();
    };
  }, [isConnected, accessToken]);

  if (error) {
    return (
      <PlayerSpotifyError
        error={error}
        onRetry={() => {
          setIsInitialized(false);
          setIsConnected(false);
          setError(null);
          doInitialize();
        }}
      />
    );
  }

  return null;
};

export default memo(PlayerSpotify);
