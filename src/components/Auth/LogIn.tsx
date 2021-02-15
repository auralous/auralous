import { SvgGoogleColor, SvgSpotify, SvgX } from "assets/svg";
import { Modal, useModal } from "components/Modal/index";
import { Button } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
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
        <div
          className="p-4 bg-background-tertiary bg-opacity-50 bg-repeat"
          style={{
            background: `url("/images/topography.svg")`,
          }}
        >
          <div className="flex flex-col items-center p-4 space-y-2 max-w-full">
            <Typography.Title align="center">Hellooo!</Typography.Title>
            <div className="flex flex-wrap flex-center space-x-1 space-y-1">
              <div className="p-1 flex flex-col space-y-1">
                <Typography.Text
                  size="xs"
                  align="center"
                  color="foreground-secondary"
                >
                  {t("auth.listenOn")}{" "}
                  <Typography.Text strong>YouTube</Typography.Text>
                </Typography.Text>
                <button
                  onClick={() => logIn(PlatformName.Youtube)}
                  className="btn bg-white text-black text-opacity-50 h-12 hover:opacity-75 transition-opacity rounded-full"
                  disabled={isAuth === AuthState.CONNECTING}
                >
                  <SvgGoogleColor
                    className="fill-current"
                    width="24"
                    strokeWidth="0"
                  />
                  <Spacer size={4} />
                  <Typography.Text size="sm">
                    Continue with Google
                  </Typography.Text>
                </button>
              </div>
              <div className="p-1 flex flex-col space-y-1">
                <Typography.Text
                  size="xs"
                  align="center"
                  color="foreground-secondary"
                >
                  {t("auth.listenOn")}{" "}
                  <Typography.Text strong>Spotify</Typography.Text>
                </Typography.Text>
                <button
                  onClick={() => logIn(PlatformName.Spotify)}
                  className="btn bg-spotify text-spotify-label h-12 hover:opacity-75 transition-opacity rounded-full"
                  disabled={isAuth === AuthState.CONNECTING}
                >
                  <SvgSpotify width="24" className="fill-current stroke-0" />
                  <Spacer size={4} />
                  <Typography.Text size="sm">
                    Continue with Spotify
                  </Typography.Text>
                </button>
              </div>
            </div>
            <Typography.Paragraph
              size="xs"
              color="foreground-tertiary"
              align="center"
            >
              {t("auth.createNotice")}
            </Typography.Paragraph>
            <Typography.Paragraph size="xs" align="center">
              <a
                href="/support/permissions"
                target="_blank"
                className="hover:underline"
              >
                <span role="img" aria-label="Light Bulb">
                  💡
                </span>{" "}
                {t("auth.permissionLink")}
              </a>
            </Typography.Paragraph>
          </div>
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
        </div>
        <div className="absolute top-2 right-0">
          <Button
            accessibilityLabel={t("modal.close")}
            icon={<SvgX />}
            styling="link"
          />
        </div>
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
