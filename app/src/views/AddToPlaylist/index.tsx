import { Button } from "@/components/Button";
import type { InputRef } from "@/components/Input";
import { Input } from "@/components/Input";
import { LoadingScreen } from "@/components/Loading";
import { PlaylistListItem } from "@/components/Playlist";
import { Spacer } from "@/components/Spacer";
import { toast } from "@/components/Toast";
import { Heading } from "@/components/Typography";
import { Size } from "@/styles/spacing";
import type { Playlist, Track } from "@auralous/api";
import {
  useMeQuery,
  useMyPlaylistsQuery,
  usePlaylistAddTracksMutation,
  usePlaylistCreateMutation,
} from "@auralous/api";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthPrompt } from "../AuthPrompt";

const styles = StyleSheet.create({
  create: {
    flex: 1,
    justifyContent: "center",
  },
  createButton: {
    flex: 1,
  },
  createButtons: { flexDirection: "row" },
  playlist: {
    marginBottom: Size[4],
  },
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});

interface AddToPlaylistProps {
  track: Track;
  onDismiss(): void;
}

const CreatePlaylist: FC<AddToPlaylistProps & { hideIsCreate(): void }> = ({
  track,
  onDismiss,
  hideIsCreate,
}) => {
  const { t } = useTranslation();

  const inputRef = useRef<InputRef>(null);
  const [{ fetching }, playlistCreate] = usePlaylistCreateMutation();

  const createAction = useCallback(async () => {
    const name = inputRef.current?.value.trim() || track.title;

    const result = await playlistCreate({
      name,
      trackIds: [track.id],
    });
    if (!result.error) {
      toast.success(
        t("playlist_adder.added_to_playlist", {
          playlist: name,
        })
      );
      onDismiss();
    }
  }, [onDismiss, playlistCreate, t, track.id, track.title]);

  const [keyboardPadding, setKeyboardPadding] = useState(0);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardPadding(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardPadding(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View style={[styles.create, { paddingBottom: keyboardPadding }]}>
      <Heading level={6} align="center">
        {t("playlist_adder.create_playlist.name_prompt")}
      </Heading>
      <Spacer y={6} />
      <Input autoFocus ref={inputRef} variant="underline" />
      <Spacer y={6} />
      <View style={styles.createButtons}>
        <Button
          style={styles.createButton}
          onPress={hideIsCreate}
          disabled={fetching}
        >
          {t("common.action.cancel")}
        </Button>
        <Spacer x={2} />
        <Button
          style={styles.createButton}
          onPress={createAction}
          variant="primary"
          disabled={fetching}
        >
          {t("common.action.create")}
        </Button>
      </View>
    </View>
  );
};

const AddToExisted: FC<AddToPlaylistProps & { showIsCreate(): void }> = ({
  track,
  onDismiss,
  showIsCreate,
}) => {
  const { t } = useTranslation();

  const [{ data, fetching }] = useMyPlaylistsQuery();

  const [{ fetching: fetchingAdd }, playlistAddTracks] =
    usePlaylistAddTracksMutation();

  const addAction = useCallback(
    async (playlist: Playlist) => {
      const result = await playlistAddTracks({
        id: playlist.id,
        trackIds: [track.id],
      });
      if (!result.error) {
        setTimeout(() => {
          // show after the modal is closed
          toast.success(
            t("playlist_adder.added_to_playlist", {
              playlist: playlist.name,
            })
          );
        }, 1000);
        onDismiss();
      }
    },
    [playlistAddTracks, track, t, onDismiss]
  );

  return (
    <ScrollView style={styles.scroll}>
      <Button style={styles.playlist} onPress={showIsCreate}>
        {t("playlist_adder.create_playlist.title")}
      </Button>
      {fetching ? (
        <LoadingScreen />
      ) : (
        data?.myPlaylists?.map((playlist) => (
          <TouchableOpacity
            key={playlist.id}
            style={styles.playlist}
            onPress={() => addAction(playlist)}
            disabled={fetchingAdd}
          >
            <PlaylistListItem playlist={playlist} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export const AddToPlaylist: FC<AddToPlaylistProps> = ({ track, onDismiss }) => {
  const [isCreate, setIsCreate] = useState(false);
  const showIsCreate = useCallback(() => setIsCreate(true), []);
  const hideIsCreate = useCallback(() => setIsCreate(false), []);

  const { t } = useTranslation();
  const [{ data: dataMe }] = useMeQuery();
  if (!dataMe?.me)
    return <AuthPrompt prompt={t("playlist_adder.auth_prompt")} />;

  return (
    <View style={styles.root}>
      {isCreate ? (
        <CreatePlaylist
          onDismiss={onDismiss}
          track={track}
          hideIsCreate={hideIsCreate}
        />
      ) : (
        <AddToExisted
          onDismiss={onDismiss}
          track={track}
          showIsCreate={showIsCreate}
        />
      )}
    </View>
  );
};
