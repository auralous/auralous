import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "redaxios";
import { useToasts } from "~/components/Toast/index";
import { Modal } from "~/components/Modal/index";
import usePlayer from "./usePlayer";
import { sleep } from "~/lib/util";
import { verifyScript } from "~/lib/script-utils";
import { SvgSpotify } from "~/assets/svg";
import { useMAuth } from "~/hooks/user";
import { useI18n } from "~/i18n/index";
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
  const { t } = useI18n();
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
    let spotifyState: Spotify.PlaybackState | null = null;

    const onError = (e: Spotify.Error) => toasts.error(e.message);
    const onReady: Spotify.PlaybackInstanceListener = ({ device_id }) => {
      player.registerPlayer({
        play: () => spotifyPlayer?.resume(),
        seek: (ms) => spotifyPlayer?.seek(ms).then(() => player.emit("seeked")),
        pause: () => spotifyPlayer?.pause(),
        loadById: playById.bind(undefined, device_id),
        setVolume: (p) => spotifyPlayer?.setVolume(p),
        // Note: It is impossible to determine spotify without a promise
        isPlaying: () => !spotifyState?.paused,
      });
      // get duration
      // durationInterval = window.setInterval(async () => {
      //   player.emit(
      //     "time",
      //     (await spotifyPlayer?.getCurrentState())?.position || 0
      //   );
      // }, 1000);
      setStatus("OK");
    };
    const instance: typeof axios = axios.create({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const playById = async (device_id: string, externalId: string) => {
      if (externalId === spotifyState?.track_window.current_track.id) return;
      const resp = await instance.put(
        `${BASE_URL}/me/player/play`,
        { uris: [`spotify:track:${externalId}`] },
        {
          validateStatus: () => true,
          params: { device_id },
        }
      );
      if (resp.status !== 204 && resp.data?.error) {
        onError(resp.data.error);
        if (resp.data.error.reason === "PREMIUM_REQUIRED")
          return setStatus("NO_PREMIUM");
      }
      await sleep(500);
      spotifyPlayer?.resume();
    };
    const onState: Spotify.PlaybackStateListener = (state) => {
      if (!state) return;
      state.paused ? player.emit("paused") : player.emit("playing");
      // FIXME: Temporary workaround only https://github.com/spotify/web-playback-sdk/issues/35#issuecomment-509159445
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

    let durationInterval: number; // ID of setInterval

    async function init() {
      if (!window.Spotify?.Player) return;
      spotifyPlayer =
        spotifyPlayer ||
        new window.Spotify.Player({
          name: "Stereo Web Player",
          getOAuthToken: (cb) => accessToken && cb(accessToken),
        });
      // readiness
      spotifyPlayer.addListener("ready", onReady);
      // state handling
      spotifyPlayer.addListener("player_state_changed", onState);
      // error handling

      spotifyPlayer.addListener("authentication_error", onError);
      spotifyPlayer.addListener("initialization_error", () =>
        setStatus("NO_SUPPORT")
      );
      spotifyPlayer.addListener("account_error", onError);
      spotifyPlayer.addListener("playback_error", onError);
      // connect
      spotifyPlayer.connect();
    }

    window.onSpotifyWebPlaybackSDKReady = init;
    verifyScript("https://sdk.scdn.co/spotify-player.js").then(init);

    return function cleanup() {
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
  }, [accessToken, toasts, player]);

  return (
    <Modal.Modal active={status !== "OK"}>
      <Modal.Header className="brand-spotify">
        <Modal.Title>
          <SvgSpotify className="fill-current mr-2" width="24" height="24" />
          {t("player.spotify.playingOn")}
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
                {t("player.spotify.connectingText")}
              </p>
            </>
          )}
          {status === "AUTH_ASK" && (
            <>
              <p className="text-lg font-bold leading-tight">
                {t("player.spotify.authAskText")}
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
                {t("player.spotify.authAction")}
              </button>
            </>
          )}
          {status === "AUTH_ERROR" && (
            <>
              <p className="text-lg font-bold leading-tight">
                {t("player.spotify.errorText")}
              </p>
              <p className="text-white text-opacity-75">
                {t("player.spotify.errorHelpText")}{" "}
                <Link href="/contact">
                  <a className="underline">{t("player.contactSupportText")}</a>
                </Link>
                .
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
                {t("player.retryText")}
              </button>
            </>
          )}
          {status === "NO_PREMIUM" && (
            <p className="text-lg font-bold leading-tight">
              {t("player.spotify.premiumRequired")}.
            </p>
          )}
          {status === "NO_SUPPORT" && (
            <p className="text-lg font-bold leading-tight">
              {t("player.spotify.notSupported")}.
            </p>
          )}
          <button
            className="button text-sm my-2"
            onClick={() => {
              stopPlaying();
            }}
          >
            {t("player.stopPlaying")}
          </button>
          <p className="text-white text-xs text-opacity-50 border-t-2 border-opacity-25 border-white py-1 mt-2">
            {t("player.spotify.footerText")}{" "}
            <a
              className="opacity-75 hover:opacity-100"
              href="https://www.spotify.com/premium"
            >
              spotify.com/premium
            </a>{" "}
            {t("player.spotify.footerTextAfter")}.
          </p>
        </div>
      </Modal.Content>
    </Modal.Modal>
  );
}
