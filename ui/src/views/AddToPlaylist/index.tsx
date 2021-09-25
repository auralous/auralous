import { IconChevronLeft } from "@/assets";
import type { InputRef } from "@/components";
import {
  Button,
  Header,
  Heading,
  Input,
  LoadingScreen,
  PlaylistListItem,
  Spacer,
  TextButton,
} from "@/components";
import { toast } from "@/components/Toast";
import { Size } from "@/styles";
import type { Playlist, Track } from "@auralous/api";
import {
  useMyPlaylistsQuery,
  usePlaylistAddTracksMutation,
  usePlaylistCreateMutation,
} from "@auralous/api";
import type { FC } from "react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Size[4],
  },
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
        t("playlist.add_to_playlist.added_to_playlist", {
          playlist: name,
        })
      );
      onDismiss();
    }
  }, [onDismiss, playlistCreate, t, track.id, track.title]);

  return (
    <View style={styles.create}>
      <Heading level={6} align="center">
        {t("playlist.add_to_playlist.create_playlist.name_prompt")}
      </Heading>
      <Spacer y={6} />
      <Input ref={inputRef} variant="underline" />
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
        toast.success(
          t("playlist.add_to_playlist.added_to_playlist", {
            playlist: playlist.name,
          })
        );
        onDismiss();
      }
    },
    [playlistAddTracks, track, t, onDismiss]
  );

  return (
    <>
      <Button style={styles.playlist} onPress={showIsCreate}>
        {t("playlist.add_to_playlist.create_playlist.title")}
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
    </>
  );
};

export const AddToPlaylist: FC<AddToPlaylistProps> = ({ track, onDismiss }) => {
  const { t } = useTranslation();

  const [isCreate, setIsCreate] = useState(false);
  const showIsCreate = useCallback(() => setIsCreate(true), []);
  const hideIsCreate = useCallback(() => setIsCreate(false), []);

  return (
    <View style={styles.root}>
      <Header
        left={
          <TextButton
            accessibilityLabel={t("common.naviation.go_back")}
            icon={<IconChevronLeft />}
            onPress={onDismiss}
          />
        }
        title={t("playlist.add_to_playlist.title")}
      />
      <View style={styles.content}>
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
    </View>
  );
};
