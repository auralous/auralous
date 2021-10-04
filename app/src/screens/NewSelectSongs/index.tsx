import { Button, TextButton } from "@/components/Button";
import { useDialog } from "@/components/Dialog";
import type { InputRef } from "@/components/Input";
import { Input } from "@/components/Input";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { LayoutSize, Size } from "@/styles/spacing";
import { useMeQuery } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, useWindowDimensions, View } from "react-native";
import NewSelectSongs from "./NewSelectSongs";
import NewSelectSongsLandscape from "./NewSelectSongs.landscape";

const styles = StyleSheet.create({
  create: {
    backgroundColor: "rgba(0,0,0,.9)",
    flex: 1,
    justifyContent: "center",
    padding: Size[8],
  },
  root: {
    flex: 1,
  },
});

const NewSelectSongsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.NewSelectSongs>
> = ({ navigation }) => {
  const { t } = useTranslation();

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const [visibleFinal, presentFinal, dismissFinal] = useDialog();

  const textInputRef = useRef<InputRef>(null);

  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  const defaultSessionText = t("session.session_of_name", {
    name: me?.user.username,
  });

  const onSubmit = useCallback(() => {
    dismissFinal();
    navigation.navigate(RouteName.NewFinal, {
      selectedTracks,
      text: textInputRef.current?.value.trim() || defaultSessionText,
    });
  }, [selectedTracks, navigation, defaultSessionText, dismissFinal]);

  const { width: windowWidth } = useWindowDimensions();

  return (
    <View style={styles.root}>
      {windowWidth >= LayoutSize.md ? (
        <NewSelectSongsLandscape
          selectedTracks={selectedTracks}
          setSelectedTracks={setSelectedTracks}
          presentFinal={presentFinal}
        />
      ) : (
        <NewSelectSongs
          selectedTracks={selectedTracks}
          setSelectedTracks={setSelectedTracks}
          presentFinal={presentFinal}
        />
      )}
      <Modal
        visible={visibleFinal}
        animationType="slide"
        transparent
        onRequestClose={dismissFinal}
      >
        <View style={styles.create}>
          <Text align="center" bold>
            {t("session.text")}
          </Text>
          <Spacer y={2} />
          <Input
            ref={textInputRef}
            accessibilityLabel={t("session.text")}
            placeholder={defaultSessionText}
            variant="underline"
          />
          <Spacer y={4} />
          <Button variant="primary" onPress={onSubmit}>
            {t("new.select_songs.create_session")}
          </Button>
          <Spacer y={1} />
          <TextButton onPress={dismissFinal}>
            {t("common.action.cancel")}
          </TextButton>
        </View>
      </Modal>
    </View>
  );
};

export default NewSelectSongsScreen;
