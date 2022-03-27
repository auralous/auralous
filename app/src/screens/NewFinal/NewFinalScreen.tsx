import { Button } from "@/components/Button";
import { useBackHandlerDismiss } from "@/components/Dialog";
import { Spacer } from "@/components/Spacer";
import { Heading, Text } from "@/components/Typography";
import player from "@/player";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { Font, fontPropsFn } from "@/styles/fonts";
import { Size } from "@/styles/spacing";
import { useSessionCreateMutation } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  StyleSheet,
  Text as RNText,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.5)",
    justifyContent: "center",
  },
  number: {
    color: Colors.white,
    ...fontPropsFn(Font.NotoSans, "bold"),
    fontSize: 144,
  },
  root: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Size[1],
    paddingVertical: Size[4],
  },
  textColor: {
    color: Colors.white,
  },
});

const NewFinalScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.NewFinal>
> = ({ route, navigation }) => {
  const { t } = useTranslation();

  const [{ fetching }, createSession] = useSessionCreateMutation();

  const onCreate = useCallback(async () => {
    const result = await createSession({
      text: route.params.text,
      tracks: route.params.selectedTracks,
    });
    if (result.error) {
      navigation.goBack();
    } else if (result.data?.sessionCreate) {
      const id = result.data.sessionCreate.id;
      player.playContext({
        id: ["session", id],
        isLive: true,
        shuffle: false,
      });
      navigation.popToTop();
      setTimeout(() => {
        navigation.navigate(RouteName.Session, {
          id,
          isNew: true,
        });
      }, 0);
    }
  }, [route, createSession, navigation]);

  useBackHandlerDismiss(fetching);

  const [sec, setSec] = useState(4);
  useEffect(() => {
    if (sec <= 0) {
      onCreate();
      return;
    }
    const intv = setTimeout(() => setSec(sec - 1), 1000);
    return () => clearTimeout(intv);
  }, [sec, onCreate]);

  return (
    <LinearGradient
      colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,.5)"]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={styles.root}>
        <View style={styles.root}>
          <RNText style={styles.number}>{sec}</RNText>
          <Heading level={3} style={styles.textColor}>
            {t("new.final.title")}
          </Heading>
          <Spacer y={4} />
          <Text align="center" color="textSecondary">
            {t("new.final.subtitle")}
          </Text>
          <Spacer y={12} />
          <Button onPress={navigation.goBack}>
            {t("common.action.cancel")}
          </Button>
        </View>
      </SafeAreaView>
      {fetching && (
        <View style={styles.loading}>
          <ActivityIndicator animating color="#ffffff" size="large" />
        </View>
      )}
    </LinearGradient>
  );
};

export default NewFinalScreen;
