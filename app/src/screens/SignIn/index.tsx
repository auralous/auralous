import { IconGoogleColor, IconSpotify, Logo } from "@/assets/svg";
import { HeaderBackable } from "@/components/Header";
import { Spacer } from "@/components/Spacer";
import { Text, TextLink } from "@/components/Typography";
import { useMe } from "@/gql/hooks";
import { useAuthActions } from "@/gql/store";
import { ParamList, RouteName } from "@/screens/types";
import { Size, useColors } from "@/styles";
import { commonStyles } from "@/styles/common";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Config from "react-native-config";
import { SafeAreaView } from "react-native-safe-area-context";
import ContinueButton from "./ContinueButton";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: Size[4],
    paddingVertical: Size[12],
    justifyContent: "flex-end",
  },
  buttonsContainer: {
    paddingVertical: Size[2],
    paddingHorizontal: Size[4],
    marginBottom: Size[4],
  },
  smallText: {
    textAlign: "center",
  },
  smallTextContainer: {
    marginTop: Size[6],
  },
  smallTextLinkFix: {
    transform: [{ translateY: 4 }],
    textDecorationLine: "underline",
  },
  top: {
    paddingBottom: Size[12],
  },
  logo: {
    width: Size[8],
  },
});

const SignInScreen: React.FC<StackScreenProps<ParamList, RouteName.SignIn>> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();
  const { signIn } = useAuthActions();

  const me = useMe();

  useEffect(() => {
    const accessToken = (route.params as Record<string, string> | undefined)?.[
      "access_token"
    ];
    if (accessToken) signIn(accessToken);
  }, [route, signIn]);

  useEffect(() => {
    if (me) navigation.goBack();
  }, [me, navigation]);

  const colors = useColors();

  return (
    <>
      <HeaderBackable title={t("sign_in.title")} />
      <SafeAreaView style={styles.root}>
        <View style={[commonStyles.fillAndCentered, styles.top]}>
          <Logo
            style={styles.logo}
            width={256}
            height={64}
            fill={colors.text}
          />
          <Text size="lg" bold color="textSecondary">
            Music Together
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <ContinueButton
            platform="google"
            name="Google"
            icon={<IconGoogleColor width={21} height={21} />}
            listenOn="YouTube"
          />
          <Spacer y={4} />
          <ContinueButton
            platform="spotify"
            name="Spotify"
            icon={<IconSpotify width={21} height={21} fill="#ffffff" />}
            listenOn="YouTube"
          />
        </View>
        <View style={styles.smallTextContainer}>
          <Text size="sm" style={styles.smallText} color="textSecondary">
            {t("sign_in.sign_up_note")}
          </Text>
          <Text
            size="sm"
            style={[styles.smallText, { marginTop: Size[1] }]}
            color="textSecondary"
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
                  href={`${Config.WEB_URI}/privacy`}
                  style={styles.smallTextLinkFix}
                />,
                <TextLink
                  size="sm"
                  color="textSecondary"
                  activeColor="text"
                  key="youtube"
                  href="https://www.youtube.com/t/terms"
                  style={styles.smallTextLinkFix}
                />,
                <TextLink
                  size="sm"
                  color="textSecondary"
                  activeColor="text"
                  key="spotify"
                  href="https://www.spotify.com/us/legal/privacy-policy/"
                  style={styles.smallTextLinkFix}
                />,
              ]}
            />
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SignInScreen;
