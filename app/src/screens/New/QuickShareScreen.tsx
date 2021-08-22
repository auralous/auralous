import { ParamList, RouteName } from "@/screens/types";
import {
  Playlist,
  PlaylistTracksDocument,
  PlaylistTracksQuery,
  PlaylistTracksQueryVariables,
  Session,
  SessionTracksDocument,
  SessionTracksQuery,
  SessionTracksQueryVariables,
  useMyPlaylistsQuery,
  usePlaylistsFeaturedQuery,
  usePlaylistsFriendsQuery,
} from "@auralous/api";
import { LoadingScreen, shuffle, Size } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { useClient } from "urql";
import PlaylistsSection from "./components/PlaylistsSection";
import { useRedirectOnUnauthenticated } from "./components/useRedirectOnUnauthenticated";

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
  useRedirectOnUnauthenticated(navigation);

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
