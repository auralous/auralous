import React, { useState, useEffect } from "react";
import { SvgPlay } from "~/assets/svg";
import { usePlayer } from "~/components/Player";
import { Story, useNowPlayingQuery, useTrackQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const ListenStoryView: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const {
    player,
    state: { fetching: fetchingPlayer, playerPlaying, playingStoryId },
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
  // otherwise, show playerPlaying (which is queue item)
  const track = story.isLive
    ? dataTrack?.track
    : !fetchingPlayer && playingStoryId === story.id
    ? playerPlaying
    : undefined;

  return (
    <div className="w-full h-full box-border overflow-hidden px-4 py-24 flex flex-col">
      <div className="p-2 flex-1 h-0 flex flex-col flex-center">
        <div className="relative mx-auto w-48 h-48 md:w-64 md:h-64 overflow-hidden mb-3">
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
        <div className="h-16 max-w-full">
          {track ? (
            <>
              <h4 className="w-full font-bold text-2xl text-center truncate leading-none mb-1">
                {track.title}
              </h4>
              <div className="w-full text-foreground-secondary text-center truncate leading-none">
                {track.artists.map((artist) => artist.name).join(", ")}
              </div>
            </>
          ) : (
            fetching && (
              <>
                <div className="block-skeleton rounded h-6 w-40 mb-1 mx-auto" />
                <div className="block-skeleton rounded h-4 w-24 mx-auto" />
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ListenStoryView;
