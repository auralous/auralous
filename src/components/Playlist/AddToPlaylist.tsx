import { SvgCheck, SvgLoadingAnimated, SvgPlus, SvgX } from "assets/svg";
import { AuthBanner } from "components/Auth";
import { Button } from "components/Button";
import { Modal } from "components/Modal/index";
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
import React, { useCallback, useRef, useState } from "react";
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
        className="flex mb-1 p-2 h-16 space-x-1"
        onSubmit={handleCreatePlaylistAndAdd}
      >
        <input
          placeholder={t("playlist.new.title")}
          className="input w-full h-10"
          ref={inputRef}
          required
        />
        <Button
          accessibilityLabel={t("playlist.new.title")}
          type="submit"
          disabled={fetching}
          icon={<SvgCheck className="w-4 h-4" />}
          color="success"
        />
        <Button
          accessibilityLabel={t("modal.close")}
          disabled={fetching}
          onPress={() => setIsCreatingPlaylist(false)}
          icon={<SvgX className="w-4 h-4" />}
        />
      </form>
      {track.platform === PlatformName.Youtube && (
        <small className="text-foreground-tertiary">
          {t("playlist.new.youtubeNotice")}.
        </small>
      )}
    </>
  ) : (
    <button
      className="btn w-full justify-start font-normal mb-1 p-2"
      onClick={() => setIsCreatingPlaylist(true)}
    >
      <div className="w-12 h-12 border-2 border-foreground flex flex-center rounded-lg">
        <SvgPlus />
      </div>
      <span className="ml-2 font-bold">{t("playlist.new.title")}</span>
    </button>
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
        // TODO: react-window
        <button
          key={playlist.id}
          title={t("playlist.add.title", { title: playlist.name })}
          className="btn justify-start w-full p-2 bg-transparent hover:bg-background-secondary focus:bg-background-secondary"
          onClick={() => handleAdd(playlist)}
        >
          <PlaylistItem playlist={playlist} />
        </button>
      )) ||
        (fetchingPlaylists && <SvgLoadingAnimated className="m-4 mx-auto" />)}
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
          <div>
            {track?.title} <span className="text-foreground-tertiary">-</span>{" "}
            <span className="text-foreground-secondary">
              {track?.artists.map(({ name }) => name).join()}
            </span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {me ? (
          track?.platform === me.platform ? (
            <>
              <CreatePlaylist track={track} done={close} />
              <AddToExistingPlaylist track={track} done={close} />
            </>
          ) : (
            <div>
              <p className="text-foreground-secondary">
                Adding tracks from a different platform is not yet supported.{" "}
              </p>
              <p className="text-foreground-tertiary">{t("error.sorry")}.</p>
            </div>
          )
        ) : (
          <AuthBanner prompt={t("playlist.authPrompt")} />
        )}
      </Modal.Content>
    </Modal.Modal>
  );
};

export default AddToPlaylist;
