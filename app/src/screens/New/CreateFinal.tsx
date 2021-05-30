import { Button } from "@/components/Button";
import { HeaderBackable } from "@/components/Header";
import { Input } from "@/components/Input";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { useStoryCreateMutation } from "@/gql/gql.gen";
import { usePlayer } from "@/player";
import { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SelectableTrackList } from "./SelectableTrackList";
import { SelectableTrackListProvider } from "./SelectableTrackList/Context";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    padding: Size[3],
    flex: 1,
  },
  meta: {
    paddingHorizontal: Size[8],
    paddingVertical: Size[4],
  },
  buttonContainer: {
    padding: Size[3],
  },
});

interface FormValues {
  text: string;
}

const Create: React.FC<StackScreenProps<ParamList, RouteName.NewFinal>> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<FormValues>();

  const [{ fetching }, createStory] = useStoryCreateMutation();

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
        navigation.navigate(RouteName.Home);
      }
    },
    [route, createStory, navigation, player]
  );

  return (
    <SelectableTrackListProvider noChange>
      <HeaderBackable title="" backText={route.params.modeTitle} />
      <View style={styles.root}>
        <View style={styles.meta}>
          <Text bold align="center">
            {t("new.final.text_label")}
          </Text>
          <Spacer y={2} />
          <Input control={control} name="text" />
          <Spacer y={1} />
          <Text color="textTertiary" align="center" size="xs">
            {t("common.input.max_x_characters", { max: 60 })}
          </Text>
        </View>
        <View style={styles.list}>
          <SelectableTrackList
            fetching={false}
            data={route.params.selectedTracks}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSubmit(onCreate)}
            disabled={fetching}
            variant="primary"
          >
            {t("new.final.start", {
              count: route.params.selectedTracks.length,
            })}
          </Button>
        </View>
      </View>
    </SelectableTrackListProvider>
  );
};

export default Create;
