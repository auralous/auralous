import { SvgGoogleColor, SvgSpotify } from "assets/svg";
import clsx from "clsx";
import { Modal, useModal } from "components/Modal/index";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { PlatformName } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import { useRouter } from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Welcome from "./Welcome";

const SignInContext = createContext<[boolean, () => void]>([
  false,
  () => undefined,
]);

enum AuthState {
  WAITING,
  CONNECTING,
  SUCCESS,
  FAIL,
}

const authBtnClassNames =
  "px-4 flex justify-center items-center h-12 focus:outline-none hover:opacity-75 transition-opacity rounded-full";

const LogInModal: React.FC<{ active: boolean; close: () => void }> = ({
  active,
  close: closeModal,
}) => {
  const { t } = useI18n();

  const windowRef = useRef<Window | null>();
  const [isAuth, setIsAuth] = useState<AuthState>(AuthState.WAITING);

  const [activeWelcome, openWelcome, closeWelcome] = useModal();

  const close = useCallback(() => {
    windowRef.current?.close();
    closeWelcome();
    closeModal();
  }, [closeModal, closeWelcome]);

  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeComplete", close);
    return () => router.events.off("routeChangeComplete", close);
  }, [router, close]);

  const logIn = useCallback(
    (provider: PlatformName) => {
      setIsAuth(AuthState.CONNECTING);
      windowRef.current = window.open(
        `${process.env.API_URI}/auth/${
          provider === PlatformName.Youtube ? "google" : provider
        }`,
        t("auth.label"),
        "width=800,height=600"
      );

      let interval: number;

      new Promise<0 | 1 | 2>((resolve) => {
        interval = window.setInterval(() => {
          try {
            if (!windowRef.current || windowRef.current.closed)
              return resolve(0);
            if (windowRef.current.location.origin === process.env.APP_URI) {
              windowRef.current.close();
              const url = new URL(windowRef.current.location.href);
              if (url.searchParams.get("isNew")) resolve(2);
              else resolve(1);
            }
          } catch (e) {
            // noop
          }
        }, 500);
      }).then((success) => {
        if (success) window.resetUrqlClient();
        window.clearInterval(interval);
        if (success) {
          window.resetUrqlClient();
          success === 1 ? close() : openWelcome();
        }
        setIsAuth(success ? AuthState.SUCCESS : AuthState.FAIL);
      });
    },
    [t, close, openWelcome]
  );

  useEffect(() => {
    if (isAuth === AuthState.SUCCESS) {
      setIsAuth(AuthState.WAITING);
    }
  }, [isAuth, close]);

  return (
    <>
      <Modal.Modal title={t("auth.label")} active={active} close={close}>
        <Box
          padding="md"
          backgroundColor="background-secondary"
          style={{
            background: `url("/images/topography.svg")`,
            backgroundRepeat: "repeat",
          }}
        >
          <Box alignItems="center" padding="md">
            <Typography.Title align="center">Hellooo!</Typography.Title>
            <Box row wrap justifyContent="center" alignItems="center">
              <Box padding="sm">
                <Typography.Text
                  size="xs"
                  align="center"
                  color="foreground-secondary"
                >
                  {t("auth.listenOn")}{" "}
                  <Typography.Text strong>YouTube</Typography.Text>
                </Typography.Text>
                <Spacer size={1} axis="vertical" />
                <button
                  onClick={() => logIn(PlatformName.Youtube)}
                  className={clsx(authBtnClassNames, "bg-white")}
                  style={{ color: "rgba(0, 0, 0, 0.5)" }}
                  disabled={isAuth === AuthState.CONNECTING}
                >
                  <SvgGoogleColor
                    className="fill-current"
                    width="24"
                    strokeWidth="0"
                  />
                  <Spacer size={4} />
                  <Typography.Text strong size="sm">
                    Continue with Google
                  </Typography.Text>
                </button>
              </Box>
              <Box padding="sm">
                <Typography.Text
                  size="xs"
                  align="center"
                  color="foreground-secondary"
                >
                  {t("auth.listenOn")}{" "}
                  <Typography.Text strong>Spotify</Typography.Text>
                </Typography.Text>
                <Spacer size={1} axis="vertical" />
                <button
                  onClick={() => logIn(PlatformName.Spotify)}
                  className={clsx(
                    authBtnClassNames,
                    "bg-spotify text-spotify-label"
                  )}
                  disabled={isAuth === AuthState.CONNECTING}
                >
                  <SvgSpotify width="24" className="fill-current stroke-0" />
                  <Spacer size={4} />
                  <Typography.Text size="sm">
                    Continue with Spotify
                  </Typography.Text>
                </button>
              </Box>
            </Box>
            <Spacer size={1} axis="vertical" />
            <Typography.Paragraph
              size="xs"
              color="foreground-tertiary"
              align="center"
            >
              {t("auth.createNotice")}
            </Typography.Paragraph>
            <Typography.Paragraph size="xs" align="center">
              <Typography.Link href="/faq/oauth-permissions" target="_blank">
                {`💡 ${t("auth.permissionLink")}`}
              </Typography.Link>
            </Typography.Paragraph>
          </Box>
          <Typography.Paragraph
            size="xs"
            color="foreground-tertiary"
            align="center"
          >
            {t("auth.footerText.pre")}{" "}
            <Typography.Link target="_blank" href="/privacy">
              {t("auth.footerText.privacyPolicy")}
            </Typography.Link>
            ,{" "}
            <Typography.Link
              target="_blank"
              href="https://www.youtube.com/t/terms"
            >
              {t("auth.footerText.youtubeTerm")}
            </Typography.Link>{" "}
            {t("auth.footerText.andOr")}{" "}
            <Typography.Link
              target="_blank"
              href="https://www.spotify.com/us/legal/privacy-policy/"
            >
              {t("auth.footerText.spotifyTerm")}
            </Typography.Link>{" "}
            {t("auth.footerText.whereApplicable")}.
          </Typography.Paragraph>
        </Box>
      </Modal.Modal>
      <Welcome active={activeWelcome} close={close} />
    </>
  );
};

export const LogInProvider: React.FC = ({ children }) => {
  const [active, open, close] = useModal();
  return (
    <>
      <SignInContext.Provider value={[active, open]}>
        {children}
        <LogInModal active={active} close={close} />
      </SignInContext.Provider>
    </>
  );
};

export const useLogin = () => {
  return useContext(SignInContext);
};
