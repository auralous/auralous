import React, { useState, useEffect } from "react";
import { SvgPlay } from "~/assets/svg";
import { usePlayer } from "~/components/Player";
import { Story, useNowPlayingQuery, useTrackQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const ListenStoryView: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const {
    player,
    state: { fetching: fetchingPlayer },
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
  ] = useNowPlayingQuery({ variables: { id: story.id } });

  const [
    { data: { track } = { track: undefined }, fetching: fetchingTrack },
  ] = useTrackQuery({
    variables: { id: nowPlaying?.currentTrack?.trackId || "" },
    pause: !nowPlaying?.currentTrack,
  });

  const fetching = fetchingTrack || fetchingPlayer;

  return (
    <div className="w-full h-full box-border overflow-hidden px-4 py-24 flex flex-col">
      <div className="p-2 flex-1 h-0 flex flex-col flex-center">
        {story.text}
        <div className="relative mx-auto w-48 h-48 md:w-64 md:h-64 rounded overflow-hidden mb-3">
          {track ? (
            <img
              alt={track.title}
              className="absolute inset-0 object-cover"
              src={track.image}
            />
          ) : (
            fetching && (
              <div className="absolute inset-0 object-cover bg-background-secondary animate-pulse" />
            )
          )}
          {!isPlaying && (
            <button
              aria-label={t("player.play")}
              onClick={() => player.play()}
              className="absolute inset-0 flex flex-center w-full bg-black bg-opacity-75 hover:bg-opacity-50 transition-colors"
            >
              <SvgPlay className="fill-current w-10 h-10" />
            </button>
          )}
        </div>
        <div className="h-16">
          {track && (
            <>
              <h4 className="w-full font-bold text-2xl text-center truncate">
                {track.title}
              </h4>
              <div className="w-full text-foreground-secondary text-center truncate">
                {track.artists.map((artist) => artist.name).join(", ")}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListenStoryView;
