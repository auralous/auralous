import React, { useState, useRef, useCallback } from "react";
import { Modal } from "~/components/Modal/index";
import { useToasts } from "~/components/Toast/index";
import { AuthBanner } from "~/components/Auth";
import { useCurrentUser } from "~/hooks/user";
import {
  useMyPlaylistsQuery,
  useInsertPlaylistTracksMutation,
} from "~/hooks/playlist/index";
import { Track, PlatformName } from "~/graphql/gql.gen";
import { Playlist } from "~/types/index";
import { SvgCheck, SvgPlus, SvgX } from "~/assets/svg";
import { SvgByPlatformName } from "~/lib/constants";
import { useI18n } from "~/i18n/index";

const PlaylistItem: React.FC<{
  playlist: Playlist;
  handleAdd: (pl: Playlist) => void;
  added: boolean;
  track: Track;
}> = ({ playlist, handleAdd, added, track }) => {
  const { t } = useI18n();
  if (playlist.platform !== track.platform) return null;
  const SvgPlatformName = SvgByPlatformName[playlist.platform];
  return (
    <div
      role="button"
      title={t("playlist.add.title", { title: playlist.title })}
      onKeyDown={({ key }) => key === "Enter" && handleAdd(playlist)}
      tabIndex={0}
      className={`button w-full justify-start font-normal mb-1 p-2 bg-transparent hover:bg-background-secondary focus:bg-background-secondary`}
      onClick={() => handleAdd(playlist)}
    >
      <img
        className="w-12 h-12 rounded-lg object-cover"
        src={playlist.image}
        alt={playlist.title}
      />
      <div className="ml-2 text-left">
        <p>
          <span className="mr-1 align-middle rounded-lg text-white text-opacity-50">
            <SvgPlatformName
              className="inline fill-current stroke-0"
              width="18"
            />
          </span>
          {playlist.title}
        </p>
        <p className="text-foreground-tertiary text-sm">
          {playlist.tracks.length} {t("common.tracks")}
          {added && `(${t("playlist.add.addedText")})`}
        </p>
      </div>
    </div>
  );
};

const CreatePlaylist: React.FC<{
  track: Track;
  done: () => void;
}> = ({ track, done }) => {
  const { t } = useI18n();
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const toasts = useToasts();

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

      if (!playlistTitle) return toasts.error(t("playlist.new.nameRequired"));

      const ok = await insertPlaylistTracks({
        name: playlistTitle,
        tracks: [track.id],
      });

      if (!ok) {
        toasts.error(t("playlist.new.errorText"));
        return;
      }

      toasts.success(t("playlist.new.okText", { title: playlistTitle }));
      done();
    },
    [t, fetching, done, toasts, track.id, insertPlaylistTracks]
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
          className="button button-success ml-2 flex-none"
          disabled={fetching}
        >
          <SvgCheck width="16" height="16" />
        </button>
        <button
          aria-label={t("track.close")}
          type="submit"
          className="button ml-1 flex-none"
          disabled={fetching}
          onClick={() => setIsCreatingPlaylist(false)}
        >
          <SvgX width="16" height="16" />
        </button>
      </form>
      {track.platform === PlatformName.Youtube && (
        <small className="text-foreground-tertiary">
          {t("playlist.new.youtubeHelpText")}.
        </small>
      )}
    </>
  ) : (
    <button
      className="button w-full justify-start font-normal mb-1 p-2 bg-transparent hover:bg-background-secondary focus:bg-background-secondary"
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
  const toasts = useToasts();

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
        toasts.success(
          t("playlist.add.okText", {
            trackTitle: track.title,
            playlistTitle: playlist.title,
          })
        );
        done();
      }
    },
    [t, done, toasts, insertPlaylistTracks, fetching, track]
  );

  return (
    <div className={fetching ? "cursor-not-allowed opacity-50" : ""}>
      {myPlaylists?.map((playlist) => (
        // TODO: react-window
        <PlaylistItem
          key={playlist.id}
          playlist={playlist}
          handleAdd={handleAdd}
          track={track}
          added={playlist.tracks.some((plTrackId) => plTrackId === track.id)}
        />
      ))}
    </div>
  );
};

const AddToPlaylist: React.FC<{
  track: Track;
  close: () => void;
  active: boolean;
}> = ({ track, close, active }) => {
  const { t } = useI18n();
  const user = useCurrentUser();
  return (
    <Modal.Modal
      title={t("playlist.addTitle")}
      active={active}
      onOutsideClick={close}
    >
      <Modal.Header>
        <Modal.Title>
          <div>
            {track.title} <span className="text-foreground-tertiary">-</span>{" "}
            <span className="text-foreground-secondary">
              {track.artists.map(({ name }) => name).join()}
            </span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {user ? (
          <>
            <CreatePlaylist track={track} done={close} />
            <AddToExistingPlaylist track={track} done={close} />
          </>
        ) : (
          <AuthBanner prompt={t("playlist.authPrompt")} />
        )}
      </Modal.Content>
    </Modal.Modal>
  );
};

export default AddToPlaylist;
