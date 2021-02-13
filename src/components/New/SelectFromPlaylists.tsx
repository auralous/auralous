import { SvgLoadingAnimated } from "assets/svg";
import { AuthBanner } from "components/Auth";
import { PlaylistItem } from "components/Playlist";
import { Track, useMyPlaylistsQuery } from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SelectingListItem } from "./common";

const SelectFromPlaylists: React.FC<{
  onSelected(tracks: Track[]): void;
}> = () => {
  const { t } = useI18n();

  const me = useMe();

  const [
    { data: { myPlaylists } = { myPlaylists: undefined }, fetching, error },
  ] = useMyPlaylistsQuery({
    pause: !me,
  });

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

  if (!me)
    return (
      <AuthBanner
        prompt={t("new.fromPlaylist.title")}
        hook={t("new.fromPlaylist.authPrompt")}
      />
    );

  if (myPlaylists?.length)
    return (
      <div className="h-full w-full overflow-auto bg-background-secondary rounded-lg shadow-lg">
        {myPlaylists.map((playlist) => (
          <SelectingListItem
            key={playlist.id}
            onClick={() => router.replace(`/new?playlist=${playlist.id}`)}
          >
            <PlaylistItem playlist={playlist} />
          </SelectingListItem>
        ))}
      </div>
    );

  if (fetching)
    return (
      <span className="text-xl font-black text-foreground-tertiary">
        <SvgLoadingAnimated />
      </span>
    );

  if (error) return <p className="text-danger-light">{t("error.unknown")}</p>;

  return (
    <p className="text-foreground-secondary font-bold">
      {t("new.fromPlaylist.empty")}
    </p>
  );
};

export default SelectFromPlaylists;
