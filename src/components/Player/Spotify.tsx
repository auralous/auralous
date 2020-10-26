/* eslint-disable camelcase */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useToasts } from "~/components/Toast/index";
import { Modal } from "~/components/Modal/index";
import usePlayer from "./usePlayer";
import { sleep } from "~/lib/util";
import { verifyScript } from "~/lib/script-utils";
import { SvgSpotify } from "~/assets/svg";
import { useMAuth } from "~/hooks/user";
/// <reference path="spotify-web-playback-sdk" />

interface ImplicitAuthJson {
  expireAt: Date;
  accessToken: string;
}

const BASE_URL = "https://api.spotify.com/v1";
const SS_STORE_KEY = "spotify-token";

let expireTimer: number | undefined;
function getAuthViaImplicit(onExpire?: () => void): null | string {
  window.clearTimeout(expireTimer);
  const strToken = sessionStorage.getItem(SS_STORE_KEY);
  const authJson: ImplicitAuthJson | null = strToken
    ? JSON.parse(strToken)
    : null;
  if (!authJson) return null;
  const expireAt = new Date(authJson.expireAt);
  if (expireAt > new Date()) {
    // token is good, optionally register onExpired
    onExpire &&
      (expireTimer = window.setTimeout(
        onExpire,
        // 5000 delay just in case
        expireAt.getTime() - Date.now() + 5000
      ));
    return authJson.accessToken;
  }
  sessionStorage.removeItem(SS_STORE_KEY);
  return null;
}

let popup: Window | null;
const implicitRedirectUri = `${process.env.APP_URI}/auth/callback`;
function doAuthViaImplicit(): Promise<null | string> {
  // https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow
  if (!popup || popup.closed)
    popup = window.open(
      `https://accounts.spotify.com/authorize?client_id=${
        process.env.SPOTIFY_CLIENT_ID
      }&response_type=token&redirect_uri=${implicitRedirectUri}&scope=${encodeURIComponent(
        "streaming user-read-email user-read-private"
      )}`,
      "Login with Spotify",
      "width=800,height=600"
    );
  else popup.focus();
  let spotifyCbInterval: number;
  return new Promise<string | null>((resolve) => {
    spotifyCbInterval = window.setInterval(() => {
      try {
        if (!popup || popup.closed) return resolve(null);
        if (popup.location.origin === process.env.APP_URI) {
          popup.close();
          const hashObj = {} as ImplicitAuthJson | { error: string };
          // Parse location hash for expires_in, access_token and error
          popup.location.hash
            .substring(1)
            .split("&")
            .map((v) => v.split("="))
            .forEach(([key, value]) => {
              if (key === "error") (hashObj as { error: string }).error = value;
              else if (key === "access_token")
                (hashObj as ImplicitAuthJson).accessToken = value;
              else if (key === "expires_in")
                (hashObj as ImplicitAuthJson).expireAt = new Date(
                  Date.now() + parseInt(value, 10) * 1000
                );
            });
          if ("accessToken" in hashObj) {
            window.sessionStorage.setItem(
              SS_STORE_KEY,
              JSON.stringify(hashObj)
            );
            return resolve(hashObj.accessToken);
          }
          return resolve(null);
        }
      } catch (e) {
        // noop
      }
    }, 500);
  }).then((res) => {
    window.clearInterval(spotifyCbInterval);
    popup = null;
    return res;
  });
}

export type SpotifyPlayerStatus =
  | "AUTH_WAIT"
  | "AUTH_ASK"
  | "OK"
  | "NO_PREMIUM"
  | "AUTH_ERROR"
  | "NO_SUPPORT";

export default function SpotifyPlayer() {
  const {
    state: { playerPlaying },
    stopPlaying,
    player,
  } = usePlayer();
  const toasts = useToasts();
  const [accessToken, setAccessToken] = useState<null | string>(null);
  const { data: mAuth } = useMAuth();

  const [status, setStatus] = useState<SpotifyPlayerStatus>("AUTH_WAIT");

  useEffect(() => {
    // get access token
    setAccessToken(
      mAuth?.accessToken ||
        getAuthViaImplicit(() => setAccessToken(null)) ||
        null
    );
  }, [mAuth]);

  useEffect(() => {
    // FIXME: No reliable to way to determine AUTH_WAIT
    if (!accessToken)
      return setStatus((s) => (s !== "NO_SUPPORT" ? "AUTH_ASK" : s));

    let spotifyPlayer: Spotify.SpotifyPlayer | null = null;
    const spotifyData: {
      currentTrackId?: string;
      device_id?: string;
      state?: Spotify.PlaybackState;
    } = {};

    let durationInterval: number; // ID of setInterval

    async function playById(externalId: string) {
      if (!spotifyData.device_id) return;
      if (externalId === spotifyData.currentTrackId) return;
      await fetch(
        `${BASE_URL}/me/player/play?device_id=${spotifyData.device_id}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [`spotify:track:${externalId}`] }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await sleep(500);

      const json = await fetch(`${BASE_URL}/me/player/currently-playing`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((response) => response.json())
        .catch(() => null);
      if (!json) return;
      spotifyData.currentTrackId = json.item?.id;
      spotifyPlayer?.resume();
    }

    async function init() {
      if (!window.Spotify?.Player) return;
      if (spotifyPlayer) return;
      spotifyPlayer = new window.Spotify.Player({
        name: "Stereo Web Player",
        getOAuthToken: (cb) => accessToken && cb(accessToken),
      });
      // readiness
      spotifyPlayer.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          spotifyData.device_id = device_id;
          player.registerPlayer({
            play: () => spotifyPlayer?.resume(),
            seek: (ms) =>
              spotifyPlayer?.seek(ms).then(() => player.emit("seeked")),
            pause: () => spotifyPlayer?.pause(),
            loadById: playById,
            setVolume: (p) => spotifyPlayer?.setVolume(p),
            // Note: It is impossible to determine spotify without a promise
            isPlaying: () => !spotifyData.state?.paused,
          });
          // get duration
          durationInterval = window.setInterval(async () => {
            player.emit(
              "time",
              (await spotifyPlayer?.getCurrentState())?.position || 0
            );
          }, 1000);
          setStatus("OK");
        }
      );
      // state handling
      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;
        state.paused ? player.emit("paused") : player.emit("playing");
        // FIXME: Temporary workaround only https://github.com/spotify/web-playback-sdk/issues/35#issuecomment-509159445
        if (
          spotifyData.state &&
          state.track_window.previous_tracks[0]?.id ===
            state.track_window.current_track.id &&
          !spotifyData.state.paused &&
          state.paused
        ) {
          // track end
          player.emit("ended");
        }
        spotifyData.state = state;
      });
      // error handling
      spotifyPlayer.addListener("authentication_error", () =>
        setStatus((s) => (s !== "NO_SUPPORT" ? "AUTH_ERROR" : s))
      );
      spotifyPlayer.addListener("initialization_error", () =>
        setStatus("NO_SUPPORT")
      );
      spotifyPlayer.addListener("account_error", () => setStatus("NO_PREMIUM"));
      spotifyPlayer.addListener("playback_error", ({ message }) =>
        toasts.error(message)
      );
      // connect
      spotifyPlayer.connect();
    }

    window.onSpotifyWebPlaybackSDKReady = init;
    verifyScript("https://sdk.scdn.co/spotify-player.js").then(init);

    return function cleanup() {
      window.clearInterval(durationInterval);
      (window as any).onSpotifyWebPlaybackSDKReady = null;
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
    };
  }, [accessToken, toasts, player]);

  return (
    <Modal.Modal active={status !== "OK"}>
      <Modal.Header className="brand-spotify">
        <Modal.Title>
          <SvgSpotify className="fill-current mr-2" width="24" height="24" />
          Playing on Spotify
        </Modal.Title>
      </Modal.Header>
      <Modal.Content className="brand-spotify text-opacity-75 flex items-start">
        <div>
          <img
            className="w-0 sm:w-24 h-24 rounded"
            alt={playerPlaying?.title || ""}
            src={playerPlaying?.image}
          />
        </div>
        <div className="px-4 flex-1">
          {status === "AUTH_WAIT" && (
            <>
              <p className="text-lg font-bold leading-tight">
                We are connecting to Spotify to play this song.{" "}
              </p>
            </>
          )}
          {status === "AUTH_ASK" && (
            <>
              <p className="text-lg font-bold leading-tight">
                Let&apos;s connect to your Spotify account to play this song.{" "}
              </p>
              <button
                className="button button-light text-sm p-2 mt-1 mr-1"
                onClick={() =>
                  doAuthViaImplicit().then(() =>
                    setAccessToken(
                      getAuthViaImplicit(() => setAccessToken(null))
                    )
                  )
                }
              >
                Connect to Spotify
              </button>
            </>
          )}
          {status === "AUTH_ERROR" && (
            <>
              <p className="text-lg font-bold leading-tight">
                Could not connect to Spotify
              </p>
              <p className="text-white text-opacity-75">
                We cannot connect your Spotify account.{" "}
                <Link href="/contact">
                  <a className="underline">Contact support</a>
                </Link>{" "}
                if you need help .
              </p>
              <button
                className="button button-light text-sm p-2 mt-1 mr-1"
                onClick={() =>
                  doAuthViaImplicit().then(() =>
                    setAccessToken(
                      getAuthViaImplicit(() => setAccessToken(null))
                    )
                  )
                }
              >
                Try again
              </button>
            </>
          )}
          {status === "NO_PREMIUM" && (
            <p className="bg-black p-2 rounded-lg font-bold bg-opacity-50">
              Spotify Premium subscription required.
            </p>
          )}
          {status === "NO_SUPPORT" && (
            <p className="text-lg font-bold leading-tight">
              This browser may not be supported.
            </p>
          )}
          <button
            className="button text-sm my-2"
            onClick={() => {
              stopPlaying();
            }}
          >
            Stop Playing
          </button>
          <p className="text-white text-xs text-opacity-50 border-t-2 border-opacity-25 border-white py-1 mt-2">
            A Spotify subscription is required to play any track, ad-free. Go to{" "}
            <a
              className="opacity-75 hover:opacity-100"
              href="https://www.spotify.com/premium"
            >
              spotify.com/premium
            </a>{" "}
            to try it for free.
          </p>
        </div>
      </Modal.Content>
    </Modal.Modal>
  );
}
