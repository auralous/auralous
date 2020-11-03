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
import { SvgCheck, SvgPlus } from "~/assets/svg";
import { SvgByPlatformName } from "~/lib/constants";

const PlaylistItem: React.FC<{
  playlist: Playlist;
  handleAdd: (pl: Playlist) => void;
  added: boolean;
  track: Track;
}> = ({ playlist, handleAdd, added, track }) => {
  if (playlist.platform !== track.platform) return null;
  const SvgPlatformName = SvgByPlatformName[playlist.platform];
  return (
    <div
      role="button"
      title={`Add to ${playlist.title}`}
      onKeyDown={({ keyCode }) => keyCode === 13 && handleAdd(playlist)}
      tabIndex={0}
      className={`flex items-center mb-1 hover:bg-background-secondary p-2 rounded-lg w-full`}
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
              className="inline"
              fill="currentColor"
              width="18"
              stroke="0"
            />
          </span>
          {playlist.title}
        </p>
        <p className="text-foreground-tertiary text-sm">
          {playlist.tracks.length} tracks
          {added && "(Added)"}
        </p>
      </div>
    </div>
  );
};

const CreatePlaylist: React.FC<{
  track: Track;
  done: () => void;
}> = ({ track, done }) => {
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

      if (!playlistTitle)
        return toasts.error("Enter a playlist name to continue");

      const ok = await insertPlaylistTracks({
        name: playlistTitle,
        tracks: [track.id],
      });

      if (!ok) {
        toasts.error("Cannot create new playlist");
        return;
      }

      toasts.success(`Create playlist ${playlistTitle}`);
      done();
    },
    [fetching, done, toasts, track, insertPlaylistTracks]
  );

  return isCreatingPlaylist ? (
    <>
      <form className="flex mb-1 p-2" onSubmit={handleCreatePlaylistAndAdd}>
        <input
          placeholder="New playlist title"
          className="input w-full"
          ref={inputRef}
          required
        />
        <button
          aria-label="Create playlist"
          type="submit"
          className="button button-success ml-2 flex-none"
          disabled={fetching}
        >
          <SvgCheck width="16" height="16" />
        </button>
      </form>
      {track.platform === PlatformName.Youtube && (
        <small className="text-foreground-tertiary">
          You may need to have a YouTube channel <i>or</i> sign up for YouTube
          Music to create a playlist.
        </small>
      )}
    </>
  ) : (
    <button
      type="button"
      className="flex items-center mb-1 hover:bg-background-secondary p-2 rounded-lg w-full"
      onClick={() => setIsCreatingPlaylist(true)}
    >
      <div className="w-12 h-12 bg-white text-black flex flex-center rounded-lg">
        <SvgPlus />
      </div>
      <span className="ml-2 font-bold">New Playlist</span>
    </button>
  );
};

const AddToExistingPlaylist: React.FC<{
  track: Track;
  done: () => void;
}> = ({ track, done }) => {
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
        toasts.success(`Added ${track.title} to ${playlist.title}`);
        done();
      }
    },
    [done, toasts, insertPlaylistTracks, fetching, track]
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
  const user = useCurrentUser();
  return (
    <Modal.Modal title="Add to Playlist" active={active} onOutsideClick={close}>
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
          <AuthBanner prompt="Join Stereo to Add Songs to Playlists" />
        )}
      </Modal.Content>
    </Modal.Modal>
  );
};

export default AddToPlaylist;
