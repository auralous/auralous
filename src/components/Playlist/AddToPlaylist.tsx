import { SvgCheck, SvgLoadingAnimated, SvgPlus, SvgX } from "assets/svg";
import { AuthBanner } from "components/Auth";
import { Input } from "components/Form";
import { Modal } from "components/Modal/index";
import { Button, PressableHighlight } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import {
  PlatformName,
  Playlist,
  Track,
  useAddPlaylistTracksMutation,
  useCreatePlaylistMutation,
  useMyPlaylistsQuery,
  useTrackQuery,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import { useCallback, useRef, useState } from "react";
import { toast } from "utils/toast";
import PlaylistItem from "./PlaylistItem";

const CreatePlaylist: React.FC<{
  track: Track;
  done: () => void;
}> = ({ track, done }) => {
  const { t } = useI18n();
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [{ fetching }, createPlaylist] = useCreatePlaylistMutation();

  const handleCreatePlaylistAndAdd = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (fetching) return;

      const playlistTitle = inputRef.current?.value.trim();

      if (!playlistTitle) return;

      const result = await createPlaylist({
        name: playlistTitle,
        trackIds: [track.id],
      });

      if (result.data?.createPlaylist) {
        toast.success(t("playlist.new.success", { title: playlistTitle }));
        done();
      }
    },
    [t, fetching, done, track, createPlaylist]
  );

  return isCreatingPlaylist ? (
    <>
      <form
        className="flex p-2 h-16 space-x-1"
        onSubmit={handleCreatePlaylistAndAdd}
      >
        <Input
          placeholder={t("playlist.new.title")}
          ref={inputRef}
          required
          fullWidth
        />
        <Button
          accessibilityLabel={t("playlist.new.title")}
          type="submit"
          disabled={fetching}
          icon={<SvgCheck className="w-4 h-4" />}
          color="primary"
        />
        <Button
          accessibilityLabel={t("modal.close")}
          disabled={fetching}
          onPress={() => setIsCreatingPlaylist(false)}
          icon={<SvgX className="w-4 h-4" />}
        />
      </form>
      {track.platform === PlatformName.Youtube && (
        <Typography.Text size="xs" color="foreground-tertiary">
          {t("playlist.new.youtubeNotice")}.
        </Typography.Text>
      )}
    </>
  ) : (
    <Button
      icon={<SvgPlus />}
      title={t("playlist.new.title")}
      onPress={() => setIsCreatingPlaylist(true)}
      fullWidth
    />
  );
};

const AddToExistingPlaylist: React.FC<{
  track: Track;
  done: () => void;
}> = ({ track, done }) => {
  const { t } = useI18n();

  const [
    {
      data: { myPlaylists } = { myPlaylists: undefined },
      fetching: fetchingPlaylists,
    },
  ] = useMyPlaylistsQuery();

  const [{ fetching }, insertPlaylistTracks] = useAddPlaylistTracksMutation();

  const handleAdd = useCallback(
    async (playlist: Playlist) => {
      if (fetching) return;
      const result = await insertPlaylistTracks({
        id: playlist.id,
        trackIds: [track.id],
      });
      if (result.data?.addPlaylistTracks) {
        toast.success(
          t("playlist.add.success", {
            trackTitle: track.title,
            playlistTitle: playlist.name,
          })
        );
        done();
      }
    },
    [t, done, insertPlaylistTracks, fetching, track]
  );

  return (
    <div className={fetching ? "cursor-not-allowed opacity-50" : "space-y-1"}>
      {myPlaylists?.map((playlist) => (
        <PressableHighlight
          key={playlist.id}
          accessibilityLabel={t("playlist.add.title", { title: playlist.name })}
          onPress={() => handleAdd(playlist)}
          fullWidth
        >
          <PlaylistItem playlist={playlist} />
        </PressableHighlight>
      )) ||
        (fetchingPlaylists && <SvgLoadingAnimated className="mx-auto" />)}
    </div>
  );
};

const AddToPlaylist: React.FC<{
  trackId: string;
  close: () => void;
  active: boolean;
}> = ({ trackId, close, active }) => {
  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id: trackId },
  });
  const { t } = useI18n();
  const me = useMe();
  return (
    <Modal.Modal title={t("playlist.addTitle")} active={active} close={close}>
      <Modal.Header>
        <Modal.Title>
          <Typography.Paragraph noMargin>
            {track?.title}{" "}
            <Typography.Text color="foreground-tertiary">-</Typography.Text>{" "}
            <Typography.Text color="foreground-secondary">
              {track?.artists.map(({ name }) => name).join()}
            </Typography.Text>
          </Typography.Paragraph>
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {me ? (
          track?.platform === me.platform ? (
            <Box gap="xs">
              <CreatePlaylist track={track} done={close} />
              <AddToExistingPlaylist track={track} done={close} />
            </Box>
          ) : (
            <Typography.Paragraph color="foreground-secondary">
              Adding tracks from a different platform is not yet supported.{" "}
              {t("error.sorry")}.
            </Typography.Paragraph>
          )
        ) : (
          <Box row fullWidth justifyContent="center">
            <AuthBanner prompt={t("playlist.authPrompt")} />
          </Box>
        )}
      </Modal.Content>
    </Modal.Modal>
  );
};

export default AddToPlaylist;
