import { SvgChevronsRight } from "assets/svg";
import { PlatformName } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import { animated, config as springConfig, useTrail } from "react-spring";
import {
  IndexParagraph,
  IndexSection,
  IndexTitle,
  useFadeInOnScroll,
} from "./common";

const playlistData = [
  {
    title: "Alone Again",
    description: "When everything is lonely, I can be my best friend.",
    image: "https://i.scdn.co/image/ab67706f0000000365af49474d91827160b56b27",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWX83CujKHHOn",
    platform: PlatformName.Spotify,
  },
  {
    title: "ChilledCow - Albums",
    description: "The chillest cow in the world.",
    image: "https://i.ytimg.com/vi/Mu3BfD6wmPg/hqdefault.jpg",
    url:
      "https://www.youtube.com/playlist?list=PL6NdkXsPL07IOu1AZ2Y2lGNYfjDStyT6O",
    platform: PlatformName.Youtube,
  },
];

const IndexPlaylistShowcase: React.FC<{
  image: string;
  title: string;
  description: string;
  url: string;
  platform: PlatformName;
}> = ({ title, description, image, url, platform }) => {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <>
      <img alt={title} src={image} className="w-0 sm:w-36 h-36 rounded-lg" />
      <div className="px-4 flex-1 w-0 overflow-hidden">
        <span className="text-foreground-tertiary text-xs uppercase font-bold">
          Playlist
        </span>
        <div className="text-3xl md:text-5xl mb-1 font-bold truncate">
          {title}
        </div>
        <div className="text-foreground-secondary md:text-lg truncate">
          {description}
        </div>
        <a
          className={`block text-${platform} truncate italic text-sm opacity-50 hover:opacity-75 transition-opacity`}
          target="_blank"
          rel="noreferrer nofollow"
          href={url}
        >
          {new URL(url).hostname}
        </a>
        <button
          onClick={() => router.push(`/new?search=${url}`)}
          className="btn btn-transparent p-1 absolute right-2 bottom-2"
        >
          {t("intro.playlist.action")} <SvgChevronsRight />
        </button>
      </div>
    </>
  );
};

const IndexPlaylist: React.FC = () => {
  const router = useRouter();
  const { t } = useI18n();

  const [value, setValue] = useState("");

  const [ref, style] = useFadeInOnScroll();

  const [refPl, inViewPl] = useInView();
  const trail = useTrail(playlistData.length, {
    opacity: inViewPl ? 1 : 0,
    transform: inViewPl ? "translateY(0)" : "translateY(40px)",
    from: { opacity: 0, transform: "translateY(40px)" },
    config: springConfig.slow,
  });

  return (
    <IndexSection>
      <div className="flex flex-col md:flex-row">
        <animated.div
          ref={ref}
          style={style}
          className="py-4 px-2 md:px-8 text-center md:text-left md:w-5/12"
        >
          <IndexTitle>{t("intro.playlist.title")}</IndexTitle>
          <IndexParagraph>{t("intro.playlist.p1")}</IndexParagraph>
          <IndexParagraph>{t("intro.playlist.p2")}</IndexParagraph>
          <form
            className="relative"
            onSubmit={(event) => {
              event.preventDefault();
              const val = event.currentTarget.playlistLink.value.trim();
              val && router.push(`/new?search=${val}`);
            }}
          >
            <input
              name="playlistLink"
              className="input w-full pl-0 pr-8 rounded-none border-0 border-b-2 text-foreground-secondary border-foreground-secondary focus:text-foreground focus:border-primary transition-colors duration-300"
              placeholder={t("new.fromSearch.altText")}
              aria-label={t("new.fromSearch.altText")}
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
              type="url"
              required
            />
            <button
              className="absolute px-1 top-0 right-0 btn btn-transparent rounded-none flex-none"
              aria-label={t("intro.playlist.action")}
            >
              <SvgChevronsRight />
            </button>
          </form>
        </animated.div>
        <animated.div ref={refPl} className="relative flex-1 md:w-0">
          {trail.map((style, index) => (
            <animated.div
              key={playlistData[index].title}
              style={style}
              className="flex mb-2 w-full bordered-box rounded-lg p-2"
            >
              <IndexPlaylistShowcase {...playlistData[index]} />
            </animated.div>
          ))}
        </animated.div>
      </div>
    </IndexSection>
  );
};

export default IndexPlaylist;
