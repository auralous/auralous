import React, { useEffect, useState } from "react";
import { SvgPause, SvgPlay, SvgSkipBack, SvgSkipForward } from "~/assets/svg";
import { Track } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import usePlayer from "./usePlayer";
import { TrackMenu } from "~/components/Track";
import { useModal } from "~/components/Modal";

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
    <div className="my-2 gap-4 flex flex-center">
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

export const PlayerImage: React.FC<{
  track: Track | null | undefined;
}> = ({ track }) => {
  return (
    <div className="w-full my-6 flex-1 h-0">
      <div
        className="object-contain h-full"
        role="img"
        title={track?.title}
        style={{
          background: `url(${
            track?.image || EMPTYIMAGE
          }) center center / contain no-repeat`,
        }}
      />
    </div>
  );
};

export const PlayerMeta: React.FC<{
  fetching: boolean;
  track: Track | null | undefined;
}> = ({ fetching, track }) => {
  const { t } = useI18n();

  const [activeMenu, openMenu, closeMenu] = useModal();
  useEffect(closeMenu, [track, closeMenu]);

  return (
    // eslint-disable-next-line
    <div className="py-4 h-20 text-inline-link flex-shrink overflow-hidden" onClick={openMenu}>
      {fetching ? (
        <>
          <div className="block-skeleton rounded h-6 w-40 mb-1" />
          <div className="block-skeleton rounded h-4 w-24" />
        </>
      ) : (
        <>
          <h4 className="w-full font-bold text-2xl truncate leading-none mb-1">
            {track ? track.title : t("player.noneText")}
          </h4>
          <div className="w-full text-foreground-secondary truncate leading-none">
            {track
              ? track.artists.map((artist) => artist.name).join(", ")
              : t("player.noneHelpText")}
          </div>
          {track && (
            <TrackMenu active={activeMenu} close={closeMenu} id={track.id} />
          )}
        </>
      )}
    </div>
  );
};
