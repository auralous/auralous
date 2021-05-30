import { HeaderBackable } from "@/components/Header";
import { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "./SearchInput";
import SelectByPlaylists from "./SelectByPlaylists";
import SelectBySongs from "./SelectBySongs";
import SelectedTrackListView from "./SelectedTrackListView";
import Tabs from "./Tabs";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: Size[3],
    paddingBottom: 0,
    flex: 1,
  },
});

const SelectSongs: React.FC<
  StackScreenProps<ParamList, RouteName.NewSelectSongs>
> = ({ navigation }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"songs" | "playlists">("songs");
  const [search, setSearch] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const title = t("new.select_songs.title");

  const onFinish = useCallback(
    (selectedTracks: string[]) => {
      navigation.navigate(RouteName.NewFinal, {
        selectedTracks,
        modeTitle: title,
      });
    },
    [navigation, title]
  );

  useEffect(() => {
    setSearch("");
  }, [tab]);

  const addTracks = useCallback(
    (trackIds: string[]) => setSelectedTracks((prev) => [...prev, ...trackIds]),
    []
  );

  const removeTrack = useCallback(
    (trackId: string) =>
      setSelectedTracks((prev) => prev.filter((t) => t !== trackId)),
    []
  );

  return (
    <>
      <SafeAreaView style={styles.root}>
        <HeaderBackable title={title} />
        <Tabs tab={tab} setTab={setTab} />
        <SearchInput value={search} onSubmit={setSearch} />
        <View style={styles.content}>
          {tab === "songs" ? (
            <SelectBySongs
              search={search}
              selectedTracks={selectedTracks}
              addTracks={addTracks}
              removeTrack={removeTrack}
            />
          ) : (
            <SelectByPlaylists
              search={search}
              selectedTracks={selectedTracks}
              addTracks={addTracks}
              removeTrack={removeTrack}
            />
          )}
        </View>
        <SelectedTrackListView
          addTracks={addTracks}
          removeTrack={removeTrack}
          selectedTracks={selectedTracks}
          setSelectedTracks={setSelectedTracks}
          onFinish={onFinish}
        />
      </SafeAreaView>
    </>
  );
};

export default SelectSongs;
