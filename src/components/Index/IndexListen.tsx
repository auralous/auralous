import React, { useEffect, useState } from "react";
import { useTransition, animated } from "react-spring";
import { SvgUser } from "~/assets/svg";
import { PlatformName, Track } from "~/graphql/gql.gen";
import { useCrossTracks } from "~/hooks/track";
import { useI18n } from "~/i18n/index";
import { PLATFORM_FULLNAMES, SvgByPlatformName } from "~/lib/constants";
import { parseMs } from "~/lib/editor-utils";
import { defaultAvatar } from "~/lib/util";
import {
  IndexParagraph,
  IndexSection,
  IndexTitle,
  useFadeInOnScroll,
} from "./common";

const IndexListenFakePlayerContent: React.FC<{ track: Track }> = ({
  track,
}) => {
  const PlatformSvg = SvgByPlatformName[track.platform];
  return (
    <>
      <div className="font-bold text-lg leading-tight truncate max-w-full">
        <a target="_blank" rel="noreferrer nofollow" href={track.url}>
          {track.title}
        </a>
      </div>
      <div className="mb-1 truncate text-foreground-secondary text-sm max-w-full">
        {track.artists.map(({ name }) => name).join(", ")}
      </div>
      <p className="text-foreground-tertiary text-xs">
        Playing on <PlatformSvg className="inline w-4 h-4 fill-current" />{" "}
        <b>{PLATFORM_FULLNAMES[track.platform]}</b>
      </p>
    </>
  );
};

const IndexListenUser: React.FC<{
  platform: PlatformName;
  name: string;
  currPlatform: PlatformName;
  setCurrPlatform: (p: PlatformName) => void;
}> = ({ name, platform, currPlatform, setCurrPlatform }) => {
  const PlatformSvg = SvgByPlatformName[platform];

  return (
    <button
      className={`p-2 ${
        platform === currPlatform ? "opactiy-100" : "opacity-25"
      } transition-opacity duration-500 focus:outline-none`}
      onClick={() => setCurrPlatform(platform)}
    >
      <div
        className="relative bg-cover shadow-lg mb-1 w-10 h-10 mx-auto rounded-full flex flex-col flex-center"
        style={{ background: `url(${defaultAvatar(name)})` }}
      >
        <SvgUser className="w-4 h-4" />
        <span className="absolute overflow-visible shadow-lg -bottom-1 -right-1 bg-white h-5 w-5 flex flex-center rounded-full">
          <PlatformSvg className={`w-3 h-3 text-${platform} fill-current`} />
        </span>
      </div>
      <div className="text-center text-xs text-foreground-secondary">
        {name}
      </div>
    </button>
  );
};

const IndexListenFakePlayer: React.FC<{ trackId: string }> = ({ trackId }) => {
  const { t } = useI18n();
  const [platform, setPlatform] = useState<PlatformName>(PlatformName.Spotify);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (platform === PlatformName.Youtube) setPlatform(PlatformName.Spotify);
      else if (platform === PlatformName.Spotify)
        setPlatform(PlatformName.Youtube);
    }, 5000);
    return () => window.clearTimeout(timeout);
  }, [platform]);

  const [crossTracks] = useCrossTracks(trackId);
  const track = crossTracks?.[platform];

  const transitions = useTransition(track, track?.id || "", {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(20px)" },
  });

  const [ms, setMs] = useState(0);

  useEffect(() => {
    if (crossTracks?.original && ms > crossTracks.original.duration)
      return setMs(0);
    const timeout = window.setTimeout(() => setMs(ms + 1000), 1000);
    return () => window.clearTimeout(timeout);
  }, [ms, crossTracks]);

  const timeNow = parseMs(ms, true);
  const timeTill = parseMs(
    crossTracks?.original ? crossTracks.original.duration - ms : 0,
    true
  );

  return (
    <div className="relative overflow-hidden w-full h-60 rounded-lg bg-blue shadow-lg">
      <img
        className="absolute w-full h-full object-cover transform scale-125"
        alt={`${t("nowPlaying.title")}: ${crossTracks?.original?.title}`}
        src={crossTracks?.original?.image}
        style={{ filter: "blur(20px) brightness(.7)" }}
      />
      <div className="p-4 relative w-full">
        <p className="text-foreground-tertiary font-bold text-xs mb-2">
          Now Playing
        </p>
        <div className="relative h-20">
          {transitions.map(
            ({ item, key, props }) =>
              item && (
                <animated.div
                  key={key}
                  className="flex flex-col items-start w-full absolute"
                  style={props}
                >
                  <IndexListenFakePlayerContent track={item} />
                </animated.div>
              )
          )}
        </div>
        <div className="relative mb-6 w-full bg-background-secondary h-2 rounded-lg">
          <div
            className="absolute top-0 left-0 h-2 bg-background-tertiary rounded-lg"
            style={{
              width: `${(ms / (crossTracks?.original?.duration || 1)) * 100}%`,
            }}
          />
          <span className="text-xs text-foreground-tertiary absolute top-2 left-0">
            {timeNow[1]}:{timeNow[0]}
          </span>
          <span className="text-xs text-foreground-tertiary absolute top-2 right-0">
            -{timeTill[1]}:{timeTill[0]}
          </span>
        </div>
        <div className="flex">
          <IndexListenUser
            name="mikouwu"
            platform={PlatformName.Spotify}
            currPlatform={platform}
            setCurrPlatform={setPlatform}
          />
          <IndexListenUser
            name="johnny570"
            platform={PlatformName.Youtube}
            currPlatform={platform}
            setCurrPlatform={setPlatform}
          />
        </div>
      </div>
    </div>
  );
};

const IndexListen: React.FC = () => {
  const { t } = useI18n();

  const [ref1, style1] = useFadeInOnScroll();
  const [ref2, style2] = useFadeInOnScroll();

  return (
    <IndexSection>
      <div className="flex flex-col-reverse md:flex-row">
        <animated.div
          ref={ref1}
          style={style1}
          className="relative flex-1 md:w-0"
        >
          <IndexListenFakePlayer trackId="spotify:6dGnYIeXmHdcikdzNNDMm2" />
        </animated.div>
        <animated.div
          ref={ref2}
          style={style2}
          className="py-2 px-2 md:px-8 text-center md:text-left md:w-5/12"
        >
          <IndexTitle>{t("intro.listen.title")}</IndexTitle>
          <IndexParagraph>{t("intro.listen.description")}</IndexParagraph>
          <IndexParagraph>{t("intro.listen.p")}</IndexParagraph>
        </animated.div>
      </div>
    </IndexSection>
  );
};

export default IndexListen;
