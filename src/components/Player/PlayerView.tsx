import React, { useEffect, useState } from "react";
import { SvgPause, SvgPlay, SvgSkipBack, SvgSkipForward } from "~/assets/svg";
import { Track } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import usePlayer from "./usePlayer";

const EMPTYIMAGE = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP87wMAAlABTQluYBcAAAAASUVORK5CYII=
`;

export const PlayerControl: React.FC = () => {
  const { t } = useI18n();
  const {
    player,
    state: { playerPlaying },
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
  const { skipForward, skipBackward } = usePlayer();

  return (
    <div className="my-4 gap-4 flex flex-center">
      <button
        className="btn btn-transparent p-3"
        title={t("player.skipBackward")}
        onClick={skipBackward}
        disabled={!skipBackward}
      >
        <SvgSkipBack className="w-6 h-6 fill-current stroke-current" />
      </button>
      <button
        aria-label={isPlaying ? t("player.pause") : t("player.play")}
        className="btn btn-primary w-14 h-14 rounded-full"
        onClick={() => (isPlaying ? player.pause() : player.play())}
        disabled={!playerPlaying}
      >
        {isPlaying ? (
          <SvgPause className="w-6 h-6 fill-current" />
        ) : (
          <SvgPlay className="w-6 h-6 fill-current" />
        )}
      </button>
      <button
        className="btn btn-transparent p-3"
        title={t("player.skipForward")}
        onClick={skipForward}
        disabled={!skipForward}
      >
        <SvgSkipForward className="w-6 h-6 fill-current stroke-current" />
      </button>
    </div>
  );
};

const PlayerMeta: React.FC<{
  fetching: boolean;
  track: Track | null | undefined;
}> = ({ fetching, track }) => {
  return (
    <>
      {track ? (
        <>
          <h4 className="w-full font-bold text-3xl truncate leading-none mb-1">
            {track.title}
          </h4>
          <div className="w-full text-lg text-foreground-secondary truncate leading-none">
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
    </>
  );
};

const PlayerView: React.FC<{
  fetching: boolean;
  track: Track | null | undefined;
  hideControl?: boolean;
  Header?: JSX.Element;
}> = ({ track, fetching, hideControl, Header }) => {
  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="w-full h-16 overflow-hidden">{Header}</div>
      <div className="w-full h-0 flex-1 flex flex-col justify-center">
        <div className="w-full my-6 flex-1 h-0 mx-auto sm:flex-none sm:h-48 sm:w-48">
          <div
            className="object-contain h-full"
            role="img"
            title={track?.title}
            style={{
              background: `url(${
                track?.image || EMPTYIMAGE
              }) center center / contain no-repeat`,
              filter:
                "drop-shadow(rgba(0, 0, 0, 0.1) 0px 0px 1px) drop-shadow(rgba(0, 0, 0, 0.1) 0px 0px 10px)",
            }}
          />
        </div>
        <div className="w-full py-4">
          <PlayerMeta track={track} fetching={fetching} />
        </div>
      </div>
      <div className={hideControl ? "opacity-0 pointer-events-none" : ""}>
        <PlayerControl />
      </div>
    </div>
  );
};

export default PlayerView;
