import { useNavigation, useRoute } from "@react-navigation/core";
import { GoogleColor, Logo, Spotify } from "assets/svg";
import { Header } from "components/Header";
import { Spacer } from "components/Spacer";
import { Text } from "components/Typography";
import { useMe } from "gql/hooks";
import { useAuthActions } from "gql/store";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Size, useColors } from "styles";
import { useTranslation } from "utils/i18n";
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
    marginTop: Size[6],
    textAlign: "center",
  },
  top: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: Size[8],
  },
});

const Container: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
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
      <Header title={t("sign_in.title")} />
      <View style={styles.root}>
        <View style={styles.top}>
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
            icon={<GoogleColor width={21} height={21} />}
            listenOn="YouTube"
          />
          <Spacer y={4} />
          <ContinueButton
            platform="spotify"
            name="Spotify"
            icon={<Spotify width={21} height={21} fill="#ffffff" />}
            listenOn="YouTube"
          />
        </View>
        <Text style={styles.smallText} color="textSecondary">
          {t("sign_in.sign_up_note")}
        </Text>
      </View>
    </>
  );
};

export default Container;
