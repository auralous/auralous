import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { LoadingDots } from "./common";
import { Track } from "~/graphql/gql.gen";
import { useMyPlaylistsQuery } from "~/hooks/playlist";
import { useCurrentUser } from "~/hooks/user";
import { useI18n } from "~/i18n/index";
import { AuthBanner } from "~/components/Auth/index";
import { Playlist } from "~/types/index";
import { SvgByPlatformName } from "~/lib/constants";

const PlaylistItem: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  const SvgPlatformName = SvgByPlatformName[playlist.platform];
  const { t } = useI18n();
  const router = useRouter();

  return (
    <button
      onClick={() => router.replace(`/new?playlist=${playlist.id}`)}
      className="btn w-full justify-start font-normal mb-1 p-2 bg-transparent hover:bg-background-secondary focus:bg-background-secondary"
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
    </button>
  );
};

const SelectFromPlaylistsContent: React.FC<{
  onSelected(tracks: Track[]): void;
}> = () => {
  const { t } = useI18n();

  const user = useCurrentUser();
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

  if (!user) return <AuthBanner prompt={t("new.fromPlaylist.authPrompt")} />;

  if (myPlaylists?.length)
    return (
      <div className="h-full w-full overflow-auto">
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

const SelectFromPlaylists: React.FC<{
  onSelected(tracks: Track[]): void;
}> = ({ onSelected }) => {
  return (
    <div className="flex flex-col flex-center h-32">
      <SelectFromPlaylistsContent onSelected={onSelected} />
    </div>
  );
};

export default SelectFromPlaylists;
