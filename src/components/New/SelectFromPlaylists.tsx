import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { SelectingListItem } from "./common";
import { useLogin } from "~/components/Auth";
import { PlaylistItem } from "~/components/Playlist";
import { useMe } from "~/hooks/user";
import { Track, useMyPlaylistsQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgLoadingAnimated } from "~/assets/svg";

const SelectFromPlaylists: React.FC<{
  onSelected(tracks: Track[]): void;
}> = () => {
  const { t } = useI18n();

  const me = useMe();
  const [, logIn] = useLogin();

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
      <div className="flex flex-col items-center p-4 rounded-lg bg-background-tertiary">
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
