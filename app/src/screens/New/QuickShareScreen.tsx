import { ParamList, RouteName } from "@/screens/types";
import {
  Playlist,
  PlaylistTracksDocument,
  PlaylistTracksQuery,
  PlaylistTracksQueryVariables,
  Story,
  StoryTracksDocument,
  StoryTracksQuery,
  StoryTracksQueryVariables,
  useMyPlaylistsQuery,
  usePlaylistsFeaturedQuery,
  usePlaylistsFriendsQuery,
} from "@auralous/api";
import { LoadingScreen, Size } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { useClient } from "urql";
import PlaylistsSection from "./components/PlaylistsSection";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Size[6],
    paddingVertical: Size[3],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,.5)",
  },
  root: {
    flex: 1,
  },
});

const QuickShareScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.NewQuickShare>
> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [fetching, setFetching] = useState(false);

  const onFinish = useCallback(
    (selectedTracks: string[], text: string) => {
      navigation.navigate(RouteName.NewFinal, {
        selectedTracks,
        text,
      });
    },
    [navigation]
  );

  const client = useClient();

  useEffect(() => {
    if (!fetching) return;
    const onBack = () => true;
    BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => BackHandler.removeEventListener("hardwareBackPress", onBack);
  }, [fetching]);

  const onSelectPlaylist = useCallback(
    async (playlist: Playlist) => {
      setFetching(true);
      const result = await client
        .query<PlaylistTracksQuery, PlaylistTracksQueryVariables>(
          PlaylistTracksDocument,
          { id: playlist.id }
        )
        .toPromise();
      if (result.data) {
        onFinish(
          result.data.playlistTracks.map((playlistTrack) => playlistTrack.id),
          playlist.name
        );
      }
      setFetching(false);
    },
    [client, onFinish]
  );

  const onSelectStory = useCallback(
    async (story: Story) => {
      setFetching(true);
      const result = await client
        .query<StoryTracksQuery, StoryTracksQueryVariables>(
          StoryTracksDocument,
          {
            id: story.id,
          }
        )
        .toPromise();
      if (result.data) {
        onFinish(
          result.data.storyTracks.map((storyTrack) => storyTrack.id),
          story.text
        );
      }
      setFetching(false);
    },
    [client, onFinish]
  );

  useEffect(() => {
    if (route.params?.playlist) {
      onSelectPlaylist(route.params.playlist);
    } else if (route.params?.story) {
      onSelectStory(route.params.story);
    }
  }, [route, onSelectPlaylist, onSelectStory]);

  const [{ data: dataFeatured }] = usePlaylistsFeaturedQuery();
  const [{ data: dataFriends }] = usePlaylistsFriendsQuery();
  const [{ data: dataMine }] = useMyPlaylistsQuery();

  return (
    <View style={styles.root}>
      <ScrollView style={styles.content}>
        <PlaylistsSection
          title={t("home.featured_playlists.title")}
          playlists={dataFeatured?.playlistsFeatured || []}
          onSelect={onSelectPlaylist}
        />
        <PlaylistsSection
          title={t("home.friends_playlists.title")}
          playlists={dataFriends?.playlistsFriends || []}
          onSelect={onSelectPlaylist}
        />
        <PlaylistsSection
          title={t("playlist.my_playlists")}
          playlists={dataMine?.myPlaylists || []}
          onSelect={onSelectPlaylist}
        />
      </ScrollView>
      {fetching && (
        <View style={styles.overlay}>
          <LoadingScreen />
        </View>
      )}
    </View>
  );
};

export default QuickShareScreen;
