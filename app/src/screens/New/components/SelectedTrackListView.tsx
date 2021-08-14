import {
  Dialog,
  DialogButton,
  DialogContent,
  DialogContentText,
  DialogFooter,
  useDialog,
} from "@/components/BottomSheet";
import { RouteName } from "@/screens/types";
import { useMeQuery, useTrackQuery } from "@auralous/api";
import {
  Button,
  Colors,
  DraggableRecyclerList,
  DraggableRecyclerRenderItem,
  DraggableRecyclerRenderItemInfo,
  Font,
  IconChevronDown,
  IconChevronUp,
  identityFn,
  Input,
  InputRef,
  QueueTrackItem,
  reorder,
  shuffle,
  Size,
  Spacer,
  Text,
  TextButton,
} from "@auralous/ui";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import {
  createContext,
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const cascadedHeight = 112;

const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: Colors.backgroundSecondary,
    bottom: 0,
    height: Size[16],
    justifyContent: "center",
    left: 0,
    paddingHorizontal: Size[3],
    position: "absolute",
    width: "100%",
  },
  metaBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Size[4],
    paddingHorizontal: Size[1],
  },
  placeholder: {
    height: cascadedHeight,
  },
  root: {
    backgroundColor: Colors.backgroundSecondary,
    paddingBottom: Size[16],
    paddingHorizontal: Size[3],
    paddingTop: Size[4],
  },
  selectOpts: {
    borderColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Size[2],
  },
  selectOptsText: {
    fontFamily: Font.Medium,
    textTransform: "uppercase",
  },
  shuffleButtonContainer: {
    alignItems: "flex-start",
    marginBottom: Size[1],
  },
  toggleExpand: {
    padding: Size[1],
  },
});

const snapPoints = [cascadedHeight, "95%"];

const CheckedContext = createContext(
  {} as {
    toggleChecked(uid: string): void;
    checked: Record<string, undefined | boolean>;
  }
);

const SelectedQueueTrackItem = memo<{
  params: DraggableRecyclerRenderItemInfo<string>;
}>(
  function SelectedQueueTrackItem({ params }) {
    const [{ data: dataTrack, fetching: fetchingTrack }] = useTrackQuery({
      variables: { id: params.item },
      // We know for sure that the track has been loaded
      // before being added as an queue item
      requestPolicy: "cache-only",
    });

    const { toggleChecked, checked } = useContext(CheckedContext);

    const onToggle = useCallback(
      () => toggleChecked(params.item),
      [toggleChecked, params.item]
    );

    return (
      <QueueTrackItem
        checked={!!checked[params.item]}
        drag={params.drag}
        onToggle={onToggle}
        track={dataTrack?.track || null}
        fetching={fetchingTrack}
        uid={params.item} // not uid but not important
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.params.drag === nextProps.params.drag &&
      prevProps.params.item === prevProps.params.item
    );
  }
);

const renderItem: DraggableRecyclerRenderItem<string> = (params) => (
  <SelectedQueueTrackItem params={params} />
);

const SelectedTrackListView: FC<{
  selectedTracks: string[];
  setSelectedTracks: Dispatch<SetStateAction<string[]>>;
}> = ({ selectedTracks, setSelectedTracks }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [expanded, setExpanded] = useState(false);

  const handleSheetChanges = useCallback((index: number) => {
    setExpanded(!!index);
  }, []);

  const { t } = useTranslation();

  const toggle = useCallback(
    () => bottomSheetRef.current?.snapTo(expanded ? 0 : 1),
    [expanded]
  );

  const [checked, setChecked] = useState<Record<string, undefined | boolean>>(
    {}
  );

  useEffect(() => {
    if (!expanded) setChecked({});
  }, [expanded]);

  const toggleChecked = useCallback(
    (uid: string) =>
      setChecked((checked) => ({ ...checked, [uid]: !checked[uid] })),
    []
  );

  const hasChecked = useMemo(
    () => expanded && Object.values(checked).includes(true),
    [checked, expanded]
  );

  const removeChecked = useCallback(() => {
    const checkedClone = { ...checked };

    const removingUids = Object.keys(checked).filter((checkedKey) => {
      if (checked[checkedKey]) {
        delete checkedClone[checkedKey];
        return true;
      }
      return false;
    });

    setChecked(checkedClone);
    setSelectedTracks((prev) => prev.filter((t) => !removingUids.includes(t)));
  }, [setSelectedTracks, checked]);

  const moveToTopChecked = useCallback(() => {
    const checkedClone = { ...checked };

    const toTopUids = Object.keys(checked).filter((checkedKey) => {
      if (checked[checkedKey]) {
        delete checkedClone[checkedKey];
        return true;
      }
      return false;
    });

    setChecked(checkedClone);
    setSelectedTracks((prev) => [
      ...toTopUids,
      ...prev.filter((t) => !toTopUids.includes(t)),
    ]);
  }, [setSelectedTracks, checked]);

  const onDragEnd = useCallback(
    (from: number, to: number) => {
      setSelectedTracks((prev) => reorder(prev, from, to));
    },
    [setSelectedTracks]
  );

  useEffect(() => {
    if (!expanded) return;
    const onBackPress = () => {
      bottomSheetRef.current?.collapse();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [expanded]);

  const [visibleFinal, presentFinal, dismissFinal] = useDialog();
  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const textInputRef = useRef<InputRef>(null);

  const navigation = useNavigation();

  const defaultStoryText = t("story.story_of_name", {
    name: me?.user.username,
  });

  const onShuffle = useCallback(() => {
    setSelectedTracks((selectedTracks) => shuffle([...selectedTracks]));
  }, [setSelectedTracks]);

  const onSubmit = useCallback(() => {
    dismissFinal();
    navigation.navigate(RouteName.NewFinal, {
      selectedTracks,
      text: textInputRef.current?.value.trim() || defaultStoryText,
    });
  }, [defaultStoryText, navigation, selectedTracks, dismissFinal]);

  return (
    <CheckedContext.Provider value={{ toggleChecked, checked }}>
      <View style={styles.placeholder} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleComponent={null}
        style={styles.root}
        backgroundComponent={null}
        backdropComponent={BottomSheetBackdrop}
      >
        <View style={styles.metaBar}>
          <Text color="textSecondary">
            {t("new.select_songs.num_selected", {
              count: selectedTracks.length,
            })}
          </Text>
          <TouchableOpacity onPress={toggle} style={styles.toggleExpand}>
            {expanded ? <IconChevronDown /> : <IconChevronUp />}
          </TouchableOpacity>
        </View>
        <View style={styles.shuffleButtonContainer}>
          <Button onPress={onShuffle}>{t("new.select_songs.shuffle")}</Button>
        </View>
        <DraggableRecyclerList
          data={selectedTracks}
          renderItem={renderItem}
          onDragEnd={onDragEnd}
          height={Size[12] + Size[2] + Size[3]} // height + 2 * padding + seperator
          keyExtractor={identityFn}
        />
      </BottomSheet>
      <View style={styles.bottomContainer}>
        {hasChecked ? (
          <View style={styles.selectOpts}>
            <TextButton
              onPress={removeChecked}
              textProps={{ style: styles.selectOptsText }}
            >
              {t("queue.remove")}
            </TextButton>
            <TextButton
              onPress={moveToTopChecked}
              textProps={{ style: styles.selectOptsText }}
            >
              {t("queue.move_to_top")}
            </TextButton>
          </View>
        ) : (
          <Button
            disabled={selectedTracks.length === 0}
            variant="filled"
            onPress={presentFinal}
          >
            {t("new.select_songs.finish_add")}
          </Button>
        )}
      </View>
      <Dialog visible={visibleFinal} onDismiss={dismissFinal}>
        <DialogContent>
          <DialogContentText>{t("story.text")}</DialogContentText>
          <Spacer y={2} />
          <Input
            ref={textInputRef}
            accessibilityLabel={t("story.text")}
            placeholder={defaultStoryText}
          />
        </DialogContent>
        <DialogFooter>
          <DialogButton onPress={dismissFinal}>
            {t("common.action.cancel")}
          </DialogButton>
          <DialogButton variant="primary" onPress={onSubmit}>
            {t("new.select_songs.create_story")}
          </DialogButton>
        </DialogFooter>
      </Dialog>
    </CheckedContext.Provider>
  );
};

export default SelectedTrackListView;
