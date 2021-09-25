import type {
  DraggableRecyclerRenderItem,
  DraggableRecyclerRenderItemInfo,
} from "@/components";
import {
  Button,
  DraggableRecyclerList,
  QueueTrackItem,
  Text,
  TextButton,
} from "@/components";
import { Colors, Font, fontWithWeight, Size } from "@/styles";
import { identityFn } from "@/utils";
import { useTrackQuery } from "@auralous/api";
import { reorder, shuffle } from "@auralous/player";
import type { Dispatch, FC, SetStateAction } from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.backgroundSecondary,
    height: Size[12],
    justifyContent: "center",
    paddingHorizontal: Size[3],
    width: "100%",
  },
  listView: {
    flex: 1,
    paddingBottom: Size[12],
    paddingHorizontal: Size[3],
  },
  selectOpts: {
    borderColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Size[2],
  },
  selectOptsText: {
    ...fontWithWeight(Font.Inter, "medium"),
    textTransform: "uppercase",
  },
  shuffleButtonContainer: {
    alignItems: "flex-start",
    marginBottom: Size[1],
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    height: Size[10],
    justifyContent: "space-between",
    paddingHorizontal: Size[1],
  },
});

const CheckedContext = createContext(
  {} as {
    setChecked: Dispatch<SetStateAction<Record<string, boolean | undefined>>>;
    checked: Record<string, undefined | boolean>;
  }
);

export const SelectedTracksListProvider: FC<{ expanded: boolean }> = ({
  children,
  expanded,
}) => {
  const [checked, setChecked] = useState<Record<string, undefined | boolean>>(
    {}
  );

  useEffect(() => {
    if (!expanded) {
      setChecked({});
    }
  }, [expanded]);

  return (
    <CheckedContext.Provider
      value={{
        checked,
        setChecked,
      }}
    >
      {children}
    </CheckedContext.Provider>
  );
};

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

    const { setChecked, checked } = useContext(CheckedContext);

    const onToggle = useCallback(
      () =>
        setChecked((checked) => ({
          ...checked,
          [params.item]: !checked[params.item],
        })),
      [setChecked, params.item]
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
  <SelectedQueueTrackItem
    params={params}
    key={`${params.index}${params.item}`}
  />
);

export const SelectedTracksListView: FC<{
  selectedTracks: string[];
  setSelectedTracks: Dispatch<SetStateAction<string[]>>;
}> = ({ selectedTracks, setSelectedTracks }) => {
  const { t } = useTranslation();

  const onShuffle = useCallback(() => {
    setSelectedTracks((selectedTracks) => shuffle([...selectedTracks]));
  }, [setSelectedTracks]);

  const onDragEnd = useCallback(
    (from: number, to: number) => {
      setSelectedTracks((prev) => reorder(prev, from, to));
    },
    [setSelectedTracks]
  );

  return (
    <View style={styles.listView}>
      <View style={styles.topBar}>
        <Text color="textSecondary">
          {t("new.select_songs.num_selected", {
            count: selectedTracks.length,
          })}
        </Text>
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
    </View>
  );
};

export const SelectedTracksListFooter: FC<{
  onFinish(): void;
  selectedTracks: string[];
  setSelectedTracks: Dispatch<SetStateAction<string[]>>;
}> = ({ selectedTracks, setSelectedTracks, onFinish }) => {
  const { t } = useTranslation();

  const { checked, setChecked } = useContext(CheckedContext);

  const hasChecked = useMemo(
    () => Object.values(checked).includes(true),
    [checked]
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
  }, [setSelectedTracks, setChecked, checked]);

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
  }, [setSelectedTracks, setChecked, checked]);

  return (
    <View style={styles.footer}>
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
          onPress={onFinish}
        >
          {t("new.select_songs.finish_add")}
        </Button>
      )}
    </View>
  );
};
