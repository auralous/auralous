import { useAuthActions } from "@/gql/context";
import { Config } from "@/utils/constants";
import { useMeQuery } from "@auralous/api";
import {
  Colors,
  Dialog,
  Heading,
  IconGoogleColor,
  IconSpotify,
  Size,
  Spacer,
  TextLink,
  useUi,
  useUiDispatch,
} from "@auralous/ui";
import { LayoutSize } from "@auralous/ui/src/styles/spacing";
import type { FC } from "react";
import { useCallback, useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import ContinueButton from "./ContinueButton";

const styles = StyleSheet.create({
  buttonsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Size[4],
    paddingHorizontal: Size[4],
    paddingVertical: Size[2],
  },
  buttonsContainerPor: {
    flexDirection: "column",
  },
});

export const SignIn: FC = () => {
  const { t } = useTranslation();
  const ui = useUi();
  const uiDispatch = useUiDispatch();
  const dismiss = useCallback(
    () => uiDispatch({ type: "signIn", value: { visible: false } }),
    [uiDispatch]
  );

  const { width: windowWidth } = useWindowDimensions();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  useEffect(() => {
    if (me) uiDispatch({ type: "signIn", value: { visible: false } });
  }, [me, uiDispatch]);

  const { signIn } = useAuthActions();

  const windowRef = useRef<Window | null>(null);
  const intervalRef = useRef<number | undefined>();
  const onSignIn = useCallback(
    (platform: "google" | "spotify") => {
      windowRef.current?.close();
      windowRef.current = window.open(
        `${Config.API_URI}/auth/${platform}`,
        "",
        "width=800,height=600"
      );
      new Promise<string | null>((resolve) => {
        window.clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
          try {
            if (!windowRef.current || windowRef.current.closed)
              return resolve(null);
            if (windowRef.current.location.origin === Config.APP_URI) {
              const searchParams = new URLSearchParams(
                windowRef.current.location.search
              );
              const accessToken = searchParams.get("access_token");
              windowRef.current.close();
              windowRef.current = null;
              return resolve(accessToken);
            }
          } catch (e) {
            // If location origin is different from allowed domains
            // (possibly when user is on 3rd party ones) this will throw
          }
        }, 500);
      })
        .then((accessToken) => {
          if (accessToken) signIn(accessToken);
        })
        .finally(() => {
          window.clearInterval(intervalRef.current);
        });
    },
    [signIn]
  );

  return (
    <Dialog.Dialog visible={ui.signIn.visible} onDismiss={dismiss}>
      <Dialog.Title>
        <Heading level={3}>{t("sign_in.title")}</Heading>
      </Dialog.Title>
      <Dialog.Content>
        <View
          style={[
            styles.buttonsContainer,
            windowWidth < LayoutSize.md && styles.buttonsContainerPor,
          ]}
        >
          <ContinueButton
            platform="google"
            name="Google"
            icon={<IconGoogleColor width={21} height={21} />}
            listenOn="YouTube"
            onSignIn={onSignIn}
          />
          <Spacer y={4} x={4} />
          <ContinueButton
            platform="spotify"
            name="Spotify"
            icon={
              <IconSpotify width={21} height={21} fill={Colors.spotifyLabel} />
            }
            listenOn="Spotify"
            onSignIn={onSignIn}
          />
        </View>
        <Dialog.ContentText lineGapScale={0.75} size="sm" color="textTertiary">
          <Trans
            t={t}
            i18nKey="legal.accept_continue_text"
            components={[
              <TextLink
                size="sm"
                color="textSecondary"
                activeColor="text"
                key="privacy"
                href={`${Config.APP_URI}/privacy`}
              />,
              <TextLink
                size="sm"
                color="textSecondary"
                activeColor="text"
                key="youtube"
                href="https://www.youtube.com/t/terms"
              />,
              <TextLink
                size="sm"
                color="textSecondary"
                activeColor="text"
                key="spotify"
                href="https://www.spotify.com/us/legal/privacy-policy/"
              />,
            ]}
          />
        </Dialog.ContentText>
      </Dialog.Content>
    </Dialog.Dialog>
  );
};
