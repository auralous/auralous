import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import Router from "next/router";
import {
  IndexParagraph,
  IndexSection,
  IndexTitle,
  useFadeInOnScroll,
} from "./common";
import { useI18n } from "~/i18n/index";
import { PlatformName } from "~/graphql/gql.gen";
import { useInView } from "react-intersection-observer";
import { useTrail, animated, config as springConfig } from "react-spring";
import { SvgChevronsRight } from "~/assets/svg";

const playlistData = [
  {
    title: "Alone Again",
    description: "When everything is lonely, I can be my best friend.",
    image: "https://i.scdn.co/image/ab67706f0000000365af49474d91827160b56b27",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWX83CujKHHOn",
    platform: PlatformName.Spotify,
  },
  {
    title: "Hip Hop Essentials",
    description:
      "The most popular and most lit hip hop tracks from the last 5 years.",
    image: "https://i.imgur.com/ZII5uar.png",
    url:
      "https://www.youtube.com/playlist?list=RDCLAK5uy_mVRuj5egfh21e-pXyA3ymx_0p4Xlg-c0I",
    platform: PlatformName.Youtube,
  },
];

const IndexPlaylistShowcase: React.FC<{
  image: string;
  title: string;
  description: string;
  url: string;
  platform: PlatformName;
  onSelected(url: string): void;
}> = ({ title, description, image, url, platform, onSelected }) => {
  const { t } = useI18n();
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
          onClick={() => onSelected(url)}
          className="btn btn-transparent p-1 absolute right-2 bottom-2"
          aria-label={title}
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

  const onSelected = useCallback((url: string) => {
    setValue(url);
    window.setTimeout(() => Router.push(`/new?search=${url}`), 3000);
  }, []);

  const [ref, style] = useFadeInOnScroll();

  const [refPl, inViewPl] = useInView({ delay: 1500 });
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
            className="relative mt-2"
            onSubmit={(event) => {
              event.preventDefault();
              const val = event.currentTarget.playlistLink.value.trim();
              val && router.push(`/new?search=${val}`);
            }}
          >
            <input
              name="playlistLink"
              className="input w-full pl-0 pr-8 rounded-none border-0 border-b-2 text-foreground-secondary border-foreground-secondary focus:text-foreground focus:border-pink transition-colors duration-300"
              placeholder={t("new.playlist.altText")}
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
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
              className="flex mb-2 w-full bordered-box rounded-lg shadow-lg p-2"
            >
              <IndexPlaylistShowcase
                onSelected={onSelected}
                {...playlistData[index]}
              />
            </animated.div>
          ))}
        </animated.div>
      </div>
    </IndexSection>
  );
};

export default IndexPlaylist;
