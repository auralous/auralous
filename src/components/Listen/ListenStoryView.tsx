import React, { useState, useEffect } from "react";
import { SvgPlay } from "~/assets/svg";
import { usePlayer } from "~/components/Player";
import { Story, useNowPlayingQuery, useTrackQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const ListenStoryView: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const { player } = usePlayer();

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

  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id: nowPlaying?.currentTrack?.trackId || "" },
    pause: !nowPlaying?.currentTrack,
  });

  return (
    <div className="w-full h-full box-border overflow-hidden px-4 py-24 flex flex-col">
      <div className="p-2 flex-1 h-0 flex flex-col flex-center">
        <div className="relative mx-auto w-48 h-48 md:w-64 md:h-64 rounded overflow-hidden mb-1">
          {track && (
            <>
              <img
                alt={track.title}
                className="absolute inset-0 object-cover"
                src={track.image}
              />
            </>
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
        {track && (
          <>
            <h4 className="font-bold text-2xl text-center">{track.title}</h4>
            <div className="text-foreground-secondary text-center">
              {track.artists.map((artist) => artist.name).join(", ")}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListenStoryView;
