import { useAuthActions } from "@/gql/context";
import { ParamList, RouteName } from "@/screens/types";
import { useMeQuery } from "@auralous/api";
import {
  Colors,
  IconGoogleColor,
  IconSpotify,
  Logo,
  Size,
  Spacer,
  Text,
  TextLink,
} from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Config from "react-native-config";
import ContinueButton from "./components/ContinueButton";

const styles = StyleSheet.create({
  buttonsContainer: {
    marginBottom: Size[4],
    paddingHorizontal: Size[4],
    paddingVertical: Size[2],
  },
  logo: {
    width: Size[8],
  },
  root: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: Size[4],
    paddingVertical: Size[12],
  },
  smallText: {
    marginTop: Size[1],
    textAlign: "center",
  },
  smallTextContainer: {
    marginTop: Size[6],
  },
  smallTextLinkFix: {
    textDecorationLine: "underline",
    transform: [{ translateY: 4 }],
  },
  top: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: Size[12],
  },
});

const SignInScreen: FC<NativeStackScreenProps<ParamList, RouteName.SignIn>> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();
  const { signIn } = useAuthActions();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  useEffect(() => {
    const accessToken = route.params?.access_token;
    if (accessToken) signIn(accessToken);
  }, [route, signIn]);

  useEffect(() => {
    if (me) navigation.goBack();
  }, [me, navigation]);

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <Logo style={styles.logo} width={256} height={64} fill={Colors.text} />
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
    </View>
  );
};

export default SignInScreen;
