import { ParamList, RouteName } from "@/screens/types";
import { useMeQuery, useStoryCreateMutation } from "@auralous/api";
import player from "@auralous/player";
import {
  Button,
  Colors,
  Font,
  GradientColors,
  Heading,
  Size,
  Spacer,
  Text,
  TextButton,
} from "@auralous/ui";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  BackHandler,
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
    fontFamily: Font.Bold,
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

const CreateFinalScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.NewFinal>
> = ({ route, navigation }) => {
  const { t } = useTranslation();

  const [{ fetching }, createStory] = useStoryCreateMutation();

  const [{ data: dataMe }] = useMeQuery();

  const onCreate = useCallback(async () => {
    const result = await createStory({
      text: route.params.text,
      tracks: route.params.selectedTracks,
    });
    if (result.data?.storyCreate) {
      player.playContext({
        type: "story",
        id: result.data.storyCreate.id,
        shuffle: false,
      });
      navigation.popToTop();
      navigation.navigate(RouteName.Story, {
        id: result.data.storyCreate.id,
        isNew: true,
      });
    }
  }, [route, createStory, navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Prevent going back while creating story
        return fetching;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [fetching])
  );

  const [sec, setSec] = useState(4);
  useEffect(() => {
    if (!dataMe?.me) return;
    if (sec <= 0) {
      onCreate();
      return;
    }
    const intv = setTimeout(() => setSec(sec - 1), 1000);
    return () => clearTimeout(intv);
  }, [sec, onCreate, dataMe?.me]);

  if (!dataMe?.me)
    return (
      <SafeAreaView style={styles.root}>
        <Heading level={6}>{t("new.final.not_auth_prompt")}</Heading>
        <Spacer y={8} />
        <Button
          variant="primary"
          onPress={() => navigation.navigate(RouteName.SignIn)}
        >
          {t("sign_in.title")}
        </Button>
        <Spacer y={2} />
        <TextButton onPress={navigation.goBack}>
          {t("common.action.cancel")}
        </TextButton>
      </SafeAreaView>
    );

  return (
    <LinearGradient
      colors={GradientColors.rainbow.colors}
      locations={GradientColors.rainbow.locations}
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

export default CreateFinalScreen;
