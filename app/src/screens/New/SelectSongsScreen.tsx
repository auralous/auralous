import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { useMeQuery } from "@auralous/api";
import type { InputRef } from "@auralous/ui";
import {
  Button,
  Colors,
  Input,
  NewSelectSongsContent,
  Size,
  SongSelector,
  Spacer,
  Text,
  TextButton,
  useDialog,
} from "@auralous/ui";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, View } from "react-native";
import { useRedirectOnUnauthenticated } from "./components/useRedirectOnUnauthenticated";

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
  sheet: {
    backgroundColor: Colors.backgroundSecondary,
  },
});

// topBar + footer heights + handleHeight
const snapPoints = [Size[10] + Size[12] + 24, "95%"];

const SelectSongsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.NewSelectSongs>
> = ({ navigation }) => {
  useRedirectOnUnauthenticated(navigation);

  const { t } = useTranslation();

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const addTracks = useCallback((trackIds: string[]) => {
    setSelectedTracks((prev) => [...prev, ...trackIds]);
  }, []);

  const removeTracks = useCallback((trackIds: string[]) => {
    setSelectedTracks((prev) => prev.filter((t) => !trackIds.includes(t)));
  }, []);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [expanded, setExpanded] = useState(false);

  const handleSheetChanges = useCallback((index: number) => {
    setExpanded(!!index);
  }, []);

  const [visibleFinal, presentFinal, dismissFinal] = useDialog();

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props}>
        <NewSelectSongsContent.SelectedTracksListFooter
          selectedTracks={selectedTracks}
          setSelectedTracks={setSelectedTracks}
          onFinish={presentFinal}
        />
      </BottomSheetFooter>
    ),
    [presentFinal, selectedTracks, setSelectedTracks]
  );

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

  return (
    <View style={styles.root}>
      <SongSelector
        selectedTracks={selectedTracks}
        addTracks={addTracks}
        removeTracks={removeTracks}
      />
      <NewSelectSongsContent.SelectedTracksListProvider expanded={expanded}>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          style={styles.sheet}
          handleIndicatorStyle={{ backgroundColor: Colors.textSecondary }}
          backgroundComponent={null}
          backdropComponent={BottomSheetBackdrop}
          footerComponent={renderFooter}
        >
          <NewSelectSongsContent.SelectedTracksListView
            selectedTracks={selectedTracks}
            setSelectedTracks={setSelectedTracks}
          />
        </BottomSheet>
      </NewSelectSongsContent.SelectedTracksListProvider>
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

export default SelectSongsScreen;
