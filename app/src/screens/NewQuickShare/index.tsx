import { useContainerStyle } from "@/components/Container";
import { LoadingScreen } from "@/components/Loading";
import { shuffle } from "@/player";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import type {
  Playlist,
  PlaylistTracksQuery,
  PlaylistTracksQueryVariables,
  Session,
  SessionTracksQuery,
  SessionTracksQueryVariables,
} from "@auralous/api";
import {
  PlaylistTracksDocument,
  SessionTracksDocument,
  useClient,
  useMyPlaylistsQuery,
  usePlaylistsFeaturedQuery,
  usePlaylistsFriendsQuery,
} from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import PlaylistsSection from "./components/PlaylistsSection";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: Size[3],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,.5)",
  },
});

const NewQuickShareScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.NewQuickShare>
> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [fetching, setFetching] = useState(false);

  const onFinish = useCallback(
    (selectedTracks: string[], text: string, navigationReplace?: boolean) => {
      navigation[navigationReplace ? "replace" : "navigate"](
        RouteName.NewFinal,
        {
          selectedTracks,
          text,
        }
      );
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
    async (playlist: Playlist, fromRoute?: boolean) => {
      setFetching(true);
      const result = await client
        .query<PlaylistTracksQuery, PlaylistTracksQueryVariables>(
          PlaylistTracksDocument,
          { id: playlist.id }
        )
        .toPromise();
      if (result.data) {
        onFinish(
          shuffle(
            result.data.playlistTracks.map((playlistTrack) => playlistTrack.id)
          ),
          playlist.name,
          fromRoute
        );
      }
      setFetching(false);
    },
    [client, onFinish]
  );

  const onSelectSession = useCallback(
    async (session: Session, fromRoute?: boolean) => {
      setFetching(true);
      const result = await client
        .query<SessionTracksQuery, SessionTracksQueryVariables>(
          SessionTracksDocument,
          { id: session.id }
        )
        .toPromise();
      if (result.data) {
        onFinish(
          shuffle(
            result.data.sessionTracks.map((sessionTrack) => sessionTrack.id)
          ),
          session.text,
          fromRoute
        );
      }
      setFetching(false);
    },
    [client, onFinish]
  );

  useEffect(() => {
    if (route.params?.playlist) {
      onSelectPlaylist(route.params.playlist, true);
    } else if (route.params?.session) {
      onSelectSession(route.params.session, true);
    }
  }, [route, onSelectPlaylist, onSelectSession]);

  const [{ data: dataFeatured }] = usePlaylistsFeaturedQuery();
  const [{ data: dataFriends }] = usePlaylistsFriendsQuery();
  const [{ data: dataMine }] = useMyPlaylistsQuery();

  const containerStyle = useContainerStyle();

  return (
    <>
      <ScrollView style={styles.content} contentContainerStyle={containerStyle}>
        <PlaylistsSection
          title={t("explore.featured_playlists.title")}
          playlists={dataFeatured?.playlistsFeatured || []}
          onSelect={onSelectPlaylist}
        />
        <PlaylistsSection
          title={t("explore.friends_playlists.title")}
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
    </>
  );
};

export default NewQuickShareScreen;
