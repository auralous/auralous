import React, { useState, useEffect } from "react";
import { SvgPlay } from "~/assets/svg";
import { usePlayer } from "~/components/Player";
import { Story, useNowPlayingQuery, useTrackQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const ListenStoryView: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const {
    player,
    state: { fetching: fetchingPlayer, crossTracks, playingStoryId },
  } = usePlayer();

  const [isPlaying, setIsPlaying] = useState(() => player.isPlaying);

  useEffect(() => {
    const onPlaying = () => setIsPlaying(true);
    const onPaused = () => setIsPlaying(false);
    player.on("playing", onPlaying);
    player.on("paused", onPaused);
    return () => {
      player.off("playing", onPlaying);
      player.off("paused", onPaused);
    };
  }, [player]);

  const [
    { data: { nowPlaying } = { nowPlaying: undefined } },
  ] = useNowPlayingQuery({ variables: { id: story.id }, pause: !story.isLive });

  const [{ data: dataTrack, fetching: fetchingTrack }] = useTrackQuery({
    variables: { id: nowPlaying?.currentTrack?.trackId || "" },
    pause: !nowPlaying?.currentTrack,
  });

  // story.isLive === false means fetching because
  // we do not know what is the current track unless
  // user start tuning in (allowing us to know the queue item)
  const fetching = fetchingTrack || fetchingPlayer || story.isLive === false;

  // if story.isLive, show current nowPlaying track
  // otherwise, show playerPlaying/crossTracks (which is queue item)
  const track = story.isLive
    ? dataTrack?.track
    : !fetchingPlayer && playingStoryId === story.id
    ? crossTracks?.original
    : undefined;

  return (
    <div className="w-full max-w-xl mx-auto h-full box-border px-8 pt-16 pb-28">
      <div className="p-2 w-full h-full flex flex-col sm:flex-row justify-center sm:justify-start sm:items-center">
        <div className="w-full p-4 max-w-64 max-w-xs mx-auto sm:w-48 flex-none">
          <div
            className="relative shadow-xl w-full h-0 overflow-hidden"
            style={{ paddingBottom: "100%" }}
          >
            {track ? (
              <>
                <img
                  alt={track.title}
                  className="absolute rounded inset-0 object-cover"
                  src={track.image}
                />
                {!isPlaying && (
                  <button
                    aria-label={t("player.play")}
                    onClick={() => player.play()}
                    className="absolute inset-0 flex flex-center w-full bg-black bg-opacity-75 hover:bg-opacity-50 transition-colors"
                  >
                    <SvgPlay className="fill-current w-10 h-10" />
                  </button>
                )}
              </>
            ) : (
              fetching && (
                <div className="block-skeleton rounded absolute inset-0 object-cover" />
              )
            )}
          </div>
        </div>
        <div className="w-full sm:w-0 sm:flex-1 py-4">
          {track ? (
            <>
              <h4 className="w-full font-bold text-2xl truncate leading-none mb-1">
                {track.title}
              </h4>
              <div className="w-full text-foreground-secondary truncate leading-none">
                {track.artists.map((artist) => artist.name).join(", ")}
              </div>
            </>
          ) : (
            fetching && (
              <>
                <div className="block-skeleton rounded h-6 w-40 mb-1" />
                <div className="block-skeleton rounded h-4 w-24" />
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ListenStoryView;
