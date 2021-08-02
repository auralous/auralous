import { TrackDocument, TrackQuery, TrackQueryVariables } from "@auralous/api";
import {
  Button,
  DraggableRecyclerList,
  DraggableRecyclerRenderItem,
  DraggableRecyclerRenderItemInfo,
  Font,
  IconChevronDown,
  IconChevronUp,
  identityFn,
  makeStyles,
  QueueTrackItem,
  reorder,
  Size,
  Text,
  TextButton,
} from "@auralous/ui";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
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
import { useClient } from "urql";

const cascadedHeight = 112;

const styles = StyleSheet.create({
  placeholder: {
    height: cascadedHeight,
  },
  metaBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Size[4],
    paddingHorizontal: Size[1],
  },
  toggleExpand: {
    padding: Size[1],
  },
  selectOptsText: {
    fontFamily: Font.Medium,
    textTransform: "uppercase",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    paddingHorizontal: Size[3],
    paddingTop: Size[4],
    paddingBottom: Size[16],
    backgroundColor: theme.colors.backgroundSecondary,
  },
  selectOpts: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Size[2],
    borderColor: theme.colors.border,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingHorizontal: Size[3],
    height: Size[16],
    justifyContent: "center",
    width: "100%",
    backgroundColor: theme.colors.backgroundSecondary,
  },
}));

const snapPoints = [cascadedHeight, "75%"];

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
    const client = useClient();
    // We know for sure that the track has been loaded
    // before being added as an queue item
    const track = useMemo(
      () =>
        client.readQuery<TrackQuery, TrackQueryVariables>(TrackDocument, {
          id: params.item,
        })?.data?.track || null,
      [client, params.item]
    );

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
        track={track}
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
  onFinish(selectedTracks: string[]): void;
  selectedTracks: string[];
  setSelectedTracks: Dispatch<SetStateAction<string[]>>;
}> = ({ onFinish, selectedTracks, setSelectedTracks }) => {
  const dstyles = useStyles();
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

  return (
    <CheckedContext.Provider value={{ toggleChecked, checked }}>
      <View style={styles.placeholder} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleComponent={null}
        style={dstyles.root}
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
        <DraggableRecyclerList
          data={selectedTracks}
          renderItem={renderItem}
          onDragEnd={onDragEnd}
          height={Size[12] + Size[2] + Size[3]} // height + 2 * padding + seperator
          keyExtractor={identityFn}
        />
      </BottomSheet>
      <View style={dstyles.bottomContainer}>
        {hasChecked ? (
          <View style={dstyles.selectOpts}>
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
            onPress={() => onFinish(selectedTracks)}
            disabled={selectedTracks.length === 0}
            variant="filled"
          >
            {t("new.select_songs.finish_add")}
          </Button>
        )}
      </View>
    </CheckedContext.Provider>
  );
};

export default SelectedTrackListView;
