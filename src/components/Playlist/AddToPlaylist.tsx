import React, { useState, useRef, useCallback } from "react";
import { Modal } from "~/components/Modal/index";
import { toast } from "~/lib/toast";
import { AuthBanner } from "~/components/Auth";
import { useCurrentUser } from "~/hooks/user";
import {
  useMyPlaylistsQuery,
  useInsertPlaylistTracksMutation,
} from "~/hooks/playlist/index";
import { Track, PlatformName, useTrackQuery } from "~/graphql/gql.gen";
import { Playlist } from "~/types/index";
import { SvgCheck, SvgPlus, SvgX } from "~/assets/svg";
import { useI18n } from "~/i18n/index";
import PlaylistItem from "./PlaylistItem";

const CreatePlaylist: React.FC<{
  track: Track;
  done: () => void;
}> = ({ track, done }) => {
  const { t } = useI18n();
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [
    insertPlaylistTracks,
    { isLoading: fetching },
  ] = useInsertPlaylistTracksMutation();

  const handleCreatePlaylistAndAdd = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (fetching) return;

      const playlistTitle = inputRef.current?.value.trim();

      if (!playlistTitle) return;

      const ok = await insertPlaylistTracks({
        name: playlistTitle,
        tracks: [track.id],
      });

      if (!ok) {
        toast.error(t("playlist.error.unknown"));
        return;
      }

      toast.success(t("playlist.new.success", { title: playlistTitle }));
      done();
    },
    [t, fetching, done, track.id, insertPlaylistTracks]
  );

  return isCreatingPlaylist ? (
    <>
      <form
        className="flex mb-1 p-2 h-16"
        onSubmit={handleCreatePlaylistAndAdd}
      >
        <input
          placeholder={t("playlist.new.title")}
          className="input w-full"
          ref={inputRef}
          required
        />
        <button
          aria-label={t("playlist.new.title")}
          type="submit"
          className="btn btn-success ml-2 flex-none"
          disabled={fetching}
        >
          <SvgCheck width="16" height="16" />
        </button>
        <button
          aria-label={t("modal.close")}
          type="submit"
          className="btn ml-1 flex-none"
          disabled={fetching}
          onClick={() => setIsCreatingPlaylist(false)}
        >
          <SvgX width="16" height="16" />
        </button>
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

  const { data: myPlaylists } = useMyPlaylistsQuery();

  const [
    insertPlaylistTracks,
    { isLoading: fetching },
  ] = useInsertPlaylistTracksMutation();

  const handleAdd = useCallback(
    async (playlist: Playlist) => {
      if (fetching) return;
      const ok = await insertPlaylistTracks({
        id: playlist.id,
        tracks: [track.id],
      });
      if (ok) {
        toast.success(
          t("playlist.add.success", {
            trackTitle: track.title,
            playlistTitle: playlist.title,
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
          title={t("playlist.add.title", { title: playlist.title })}
          className="btn justify-start w-full p-2 bg-transparent hover:bg-background-secondary focus:bg-background-secondary"
          onClick={() => handleAdd(playlist)}
          disabled={playlist.platform !== track.platform}
        >
          <PlaylistItem playlist={playlist} />
        </button>
      ))}
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
  const user = useCurrentUser();
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
        {user ? (
          track && (
            <>
              <CreatePlaylist track={track} done={close} />
              <AddToExistingPlaylist track={track} done={close} />
            </>
          )
        ) : (
          <AuthBanner prompt={t("playlist.authPrompt")} />
        )}
      </Modal.Content>
    </Modal.Modal>
  );
};

export default AddToPlaylist;
