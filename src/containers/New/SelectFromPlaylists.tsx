import { SvgSpinnerAlt } from "assets/svg";
import { AuthBanner } from "components/Auth";
import { PlaylistItem } from "components/Playlist";
import { PressableHighlight } from "components/Pressable";
import { Typography } from "components/Typography";
import { Track, useMyPlaylistsQuery } from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
      <div className="h-full w-full overflow-auto border-2 border-background-secondary p-2 rounded-lg shadow-lg">
        {myPlaylists.map((playlist) => (
          <PressableHighlight
            key={playlist.id}
            onPress={() => router.replace(`/new?playlist=${playlist.id}`)}
            fullWidth
          >
            <PlaylistItem playlist={playlist} />
          </PressableHighlight>
        ))}
      </div>
    );

  if (fetching)
    return (
      <Typography.Text size="xl" color="foreground-tertiary">
        <SvgSpinnerAlt className="animate-spin" />
      </Typography.Text>
    );

  if (error)
    return (
      <Typography.Paragraph color="danger">
        {t("error.unknown")}
      </Typography.Paragraph>
    );

  return (
    <Typography.Paragraph strong color="foreground-secondary">
      {t("new.fromPlaylist.empty")}
    </Typography.Paragraph>
  );
};

export default SelectFromPlaylists;
