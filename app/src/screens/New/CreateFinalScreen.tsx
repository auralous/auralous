import { ParamList, RouteName } from "@/screens/types";
import { useStoryCreateMutation } from "@auralous/api";
import player from "@auralous/player";
import {
  Button,
  GradientColors,
  Heading,
  Size,
  Spacer,
  Text,
} from "@auralous/ui";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, BackHandler, StyleSheet, View } from "react-native";
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
    color: "#ffffff",
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
    color: "#ffffff",
  },
});

const CreateFinalScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.NewFinal>
> = ({ route, navigation }) => {
  const { t } = useTranslation();

  const [{ fetching }, createStory] = useStoryCreateMutation();

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
    if (sec <= 0) {
      onCreate();
      return;
    }
    const intv = setTimeout(() => setSec(sec - 1), 1000);
    return () => clearTimeout(intv);
  }, [sec, onCreate]);

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
          <Text bold style={styles.number}>
            {sec}
          </Text>
          <Heading level={3} style={styles.textColor}>
            {t("new.final.title")}
          </Heading>
          <Spacer y={2} />
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
