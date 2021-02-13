import { SvgPause, SvgPlay, SvgSkipBack, SvgSkipForward } from "assets/svg";
import { Button } from "components/Button";
import { useModal } from "components/Modal";
import { TrackMenu } from "components/Track";
import { Track } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import React, { useEffect, useState } from "react";
import usePlayer from "./usePlayer";

const EMPTYIMAGE = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP87wMAAlABTQluYBcAAAAASUVORK5CYII=
`;

export const PlayerControl: React.FC = () => {
  const { t } = useI18n();
  const {
    player,
    state: { playerPlaying, fetching },
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
    <div className="my-2 space-x-6 flex flex-center">
      <Button
        accessibilityLabel={t("player.skipBackward")}
        onPress={skipBackward}
        disabled={!skipBackward}
        icon={<SvgSkipBack className="w-6 h-6 fill-current stroke-current" />}
        styling="link"
      />
      <div className="relative">
        <Button
          accessibilityLabel={isPlaying ? t("player.pause") : t("player.play")}
          icon={
            isPlaying ? (
              <SvgPause className="w-6 h-6 fill-current" />
            ) : (
              <SvgPlay className="w-6 h-6 fill-current" />
            )
          }
          onPress={() => (isPlaying ? player.pause() : player.play())}
          disabled={!playerPlaying}
          color="foreground"
          size="large"
          shape="circle"
        />
        {fetching && <span className="spinning-border absolute inset-0" />}
      </div>
      <Button
        accessibilityLabel={t("player.skipForward")}
        onPress={skipForward}
        disabled={!skipForward}
        icon={
          <SvgSkipForward className="w-6 h-6 fill-current stroke-current" />
        }
        styling="link"
      />
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
    <div className="my-4 h-12 text-inline-link flex-shrink overflow-hidden" onClick={openMenu}>
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
