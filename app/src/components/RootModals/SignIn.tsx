import { IconGoogleColor, IconSpotify } from "@/assets";
import { Dialog } from "@/components/Dialog";
import { Spacer } from "@/components/Spacer";
import { Text, TextLink } from "@/components/Typography";
import { Config } from "@/config";
import { useAuthActions } from "@/gql/context";
import type { ThemeColorKey } from "@/styles/colors";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import { useUi, useUiDispatch } from "@/ui-context";
import { useMeQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import type {
  PressableStateCallbackType,
  TextStyle,
  ViewStyle,
} from "react-native";
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

const styles = StyleSheet.create({
  buttonsContainer: {
    paddingHorizontal: Size[4],
  },
  buttonsContainerLand: {
    flexDirection: "row",
  },
  smallText: {
    textAlign: "center",
  },
  smallTextLink: {
    textDecorationLine: "underline",
  },
});

const ContinueButton: FC<{
  name: string;
  platform: "google" | "spotify";
  icon: JSX.Element;
  listenOn: string;
  logIn(platform: "google" | "spotify"): void;
}> = ({ name, platform, icon, listenOn, logIn }) => {
  const buttonStyles = useMemo<{
    text: TextStyle;
    pressable: ViewStyle;
    rootLand: ViewStyle;
  }>(
    () => ({
      text: {
        marginLeft: Size[1],
        color: Colors[`${platform}Label` as ThemeColorKey],
      },
      pressable: {
        padding: Size[3],
        borderRadius: 9999,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: Size[1],
        backgroundColor: Colors[platform],
      },
      rootLand: {
        flex: 1,
      },
    }),
    [platform]
  );

  const { t } = useTranslation();
  const style = useCallback(
    ({ pressed }: PressableStateCallbackType) => [
      buttonStyles.pressable,
      { opacity: pressed ? 0.75 : 1 },
    ],
    [buttonStyles]
  );

  const { width: windowWidth } = useWindowDimensions();

  return (
    <View style={windowWidth >= LayoutSize.md && buttonStyles.rootLand}>
      <Text color="textSecondary" align="center" size="sm">
        {t("sign_in.listen_on", { name: listenOn })}
      </Text>
      <Spacer y={2} />
      <Pressable style={style} onPress={() => logIn(platform)}>
        {icon}
        <Text style={buttonStyles.text} bold>
          {t("sign_in.continue_with", { name })}
        </Text>
      </Pressable>
    </View>
  );
};

export const SignInModal: FC = () => {
  const { t } = useTranslation();

  const ui = useUi();
  const uiDispatch = useUiDispatch();

  const onDismiss = useCallback(
    () =>
      uiDispatch({
        type: "signIn",
        value: { visible: false },
      }),
    [uiDispatch]
  );

  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  useEffect(() => {
    if (me) onDismiss();
  }, [me, onDismiss]);

  const { signIn } = useAuthActions();

  const { width: windowWidth } = useWindowDimensions();

  const webWindowRef = useRef<Window | null>(null);
  const webIntervalRef = useRef<number | undefined>();

  useEffect(() => {
    if (Platform.OS === "web") return;
  }, []);

  const logIn = useCallback(
    (platform: "google" | "spotify") => {
      if (Platform.OS === "web") {
        webWindowRef.current?.close();
        webWindowRef.current = window.open(
          `${Config.API_URI}/auth/${platform}`,
          "",
          "width=800,height=600"
        );
        new Promise<string | null>((resolve) => {
          window.clearInterval(webIntervalRef.current);
          webIntervalRef.current = window.setInterval(() => {
            try {
              if (!webWindowRef.current || webWindowRef.current.closed)
                return resolve(null);
              if (webWindowRef.current.location.origin === Config.APP_URI) {
                const searchParams = new URLSearchParams(
                  webWindowRef.current.location.search
                );
                const accessToken = searchParams.get("access_token");
                webWindowRef.current.close();
                webWindowRef.current = null;
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
            window.clearInterval(webIntervalRef.current);
          });
      } else {
        Linking.openURL(`${Config.API_URI}/auth/${platform}?is_app_login=1`);
      }
    },
    [signIn]
  );

  return (
    <Dialog.Dialog visible={ui.signIn.visible}>
      <Dialog.Title>{t("sign_in.title")}</Dialog.Title>
      <Dialog.Content>
        <View
          style={[
            styles.buttonsContainer,
            windowWidth >= LayoutSize.md && styles.buttonsContainerLand,
          ]}
        >
          <ContinueButton
            platform="google"
            name="Google"
            icon={<IconGoogleColor width={21} height={21} />}
            listenOn="YouTube"
            logIn={logIn}
          />
          <Spacer y={4} x={4} />
          <ContinueButton
            platform="spotify"
            name="Spotify"
            icon={<IconSpotify width={21} height={21} fill="#ffffff" />}
            listenOn="Spotify"
            logIn={logIn}
          />
        </View>
      </Dialog.Content>
      <Dialog.Footer>
        <Text
          lineGapScale={0.75}
          size="sm"
          style={styles.smallText}
          color="textSecondary"
          align="center"
        >
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
                style={styles.smallTextLink}
              />,
              <TextLink
                size="sm"
                color="textSecondary"
                activeColor="text"
                key="youtube"
                href="https://www.youtube.com/t/terms"
                style={styles.smallTextLink}
              />,
              <TextLink
                size="sm"
                color="textSecondary"
                activeColor="text"
                key="spotify"
                href="https://www.spotify.com/us/legal/privacy-policy/"
                style={styles.smallTextLink}
              />,
            ]}
          />
        </Text>
      </Dialog.Footer>
    </Dialog.Dialog>
  );
};
