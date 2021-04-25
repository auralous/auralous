import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Spacer } from "@/components/Spacer";
import { TrackItem } from "@/components/Track";
import { Text } from "@/components/Typography";
import { useStoryCreateMutation, useTrackQuery } from "@/gql/gql.gen";
import { usePlayer } from "@/player";
import { Size } from "@/styles";
import { RouteProp, useNavigation } from "@react-navigation/core";
import React, { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import { RootStackParamListNew } from "./types";

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: Size[4],
    paddingVertical: Size[4],
    flex: 1,
  },
  selectedTracks: {
    flex: 1,
    paddingVertical: Size[1],
  },
  selectedTrackItem: {
    padding: Size[2],
  },
  meta: {
    paddingVertical: Size[4],
  },
});

const LoadableTrackItem: React.FC<{ trackId: string }> = ({ trackId }) => {
  const [{ data, fetching }] = useTrackQuery({ variables: { id: trackId } });
  return (
    <View style={styles.selectedTrackItem}>
      <TrackItem track={data?.track || null} fetching={fetching} />
    </View>
  );
};

const renderItem: ListRenderItem<string> = ({ item }) => {
  return <LoadableTrackItem key={item} trackId={item} />;
};

interface FormValues {
  text: string;
}

const Create: React.FC<{
  route: RouteProp<RootStackParamListNew, "new/final">;
}> = ({ route }) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<FormValues>();

  const [{ fetching }, createStory] = useStoryCreateMutation();

  const navigation = useNavigation();

  const player = usePlayer();

  const onCreate = useCallback<SubmitHandler<FormValues>>(
    async (data) => {
      const result = await createStory({
        text: data.text,
        isPublic: true,
        tracks: route.params.selectedTracks,
      });
      if (result.data?.storyCreate) {
        player.playContext(`story:${result.data.storyCreate.id}`);
        navigation.navigate(`home`);
      }
    },
    [route, createStory, navigation, player]
  );

  return (
    <>
      <Header title="" leftText={route.params.modeTitle} />
      <View style={styles.root}>
        <View style={styles.meta}>
          <Text bold align="center">
            {t("new.final.text_label")}
          </Text>
          <Spacer y={2} />
          <Input control={control} name="text" />
          <Text color="textTertiary" align="center" size="xs">
            {t("common.input.max_x_characters", { max: 60 })}
          </Text>
        </View>
        <Text align="center" color="textSecondary">
          {t("new.select_songs.num_selected", {
            count: route.params.selectedTracks.length,
          })}
        </Text>
        <View style={styles.selectedTracks}>
          <FlatList
            data={route.params.selectedTracks}
            renderItem={renderItem}
            keyExtractor={(item) => item}
          />
        </View>
        <Button
          onPress={handleSubmit(onCreate)}
          disabled={fetching}
          color="primary"
        >
          {t("new.final.start")}
        </Button>
      </View>
    </>
  );
};

export default Create;
