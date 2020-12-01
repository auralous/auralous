import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { LoadingDots, SelectingListItem } from "./common";
import { useLogin } from "~/components/Auth";
import { useMyPlaylistsQuery } from "~/hooks/playlist";
import { useCurrentUser } from "~/hooks/user";
import { SvgByPlatformName } from "~/lib/constants";
import { Track } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { Playlist } from "~/types/index";

const PlaylistItem: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  const SvgPlatformName = SvgByPlatformName[playlist.platform];
  const { t } = useI18n();
  const router = useRouter();

  return (
    <SelectingListItem
      onClick={() => router.replace(`/new?playlist=${playlist.id}`)}
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
        </p>
      </div>
    </SelectingListItem>
  );
};

const SelectFromPlaylists: React.FC<{
  onSelected(tracks: Track[]): void;
}> = () => {
  const { t } = useI18n();

  const user = useCurrentUser();
  const [, logIn] = useLogin();

  const { data: myPlaylists, isLoading, isError } = useMyPlaylistsQuery();

  const router = useRouter();

  useEffect(() => {
    const selectedPlaylistId = router.query.playlist as string | undefined;
    if (selectedPlaylistId) {
      const playlist = myPlaylists?.find((pl) => pl.id === selectedPlaylistId);
      if (playlist) {
        // TODO: Currently, we are redirecting to the search functionality
        // However, it is better to implement real select from playlist
        // in the future
        router.replace(`/new?search=${playlist.url}`);
      }
    }
  }, [router, myPlaylists]);

  if (!user)
    return (
      <div className="flex flex-col items-center p-4 rounded-lg bg-blue-tertiary">
        <p className="text-foreground-secondary mb-2cd ">
          {t("new.fromPlaylist.authPrompt")}
        </p>
        <button onClick={logIn} className="btn btn-primary">
          {t("common.signIn")}
        </button>
      </div>
    );

  if (myPlaylists?.length)
    return (
      <div className="h-full w-full overflow-auto bg-background-secondary rounded-lg shadow-lg">
        {myPlaylists.map((playlist) => (
          <PlaylistItem key={playlist.id} playlist={playlist} />
        ))}
      </div>
    );

  if (isLoading)
    return (
      <span className="text-xl font-black text-foreground-tertiary">
        <LoadingDots />
      </span>
    );

  if (isError)
    return <p className="text-danger-light">{t("playlist.error.load")}</p>;

  return (
    <p className="text-foreground-secondary font-bold">
      {t("new.fromPlaylist.empty")}
    </p>
  );
};

export default SelectFromPlaylists;
