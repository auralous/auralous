import React from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";
import {
  IndexParagraph,
  IndexSection,
  IndexTitle,
  useFadeInOnScroll,
} from "./common";
import { useI18n } from "~/i18n/index";
import { defaultAvatar } from "~/lib/util";
import { useTrackQuery } from "~/graphql/gql.gen";
import { SvgLogIn, SvgMusic } from "~/assets/svg";

const intialStyle = { opacity: 0, transform: "skewY(0deg) translateY(0px)" };

const featuredTrackId = `spotify:2CgOd0Lj5MuvOqzqdaAXtS`;

const username = "adrian";
const username1 = "lisa";
const username2 = "bailey";

const IndexStoryJoin: React.FC = () => {
  const { t } = useI18n();
  const [ref, inView] = useInView();

  const style = useSpring(
    inView
      ? { opacity: 1, transform: "skewY(-8deg) translateY(-10px)" }
      : intialStyle
  );

  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id: featuredTrackId },
  });

  return (
    <animated.div
      className="inline-block z-10 w-48 h-64 mx-1 bg-blue rounded-lg shadow-lg relative p-2 whitespace-normal"
      style={style}
      ref={ref}
    >
      <div className="flex w-full">
        <img
          alt={username}
          className="w-10 h-10 rounded-full object-cover"
          src={defaultAvatar(username)}
        />
        <div className="p-1 leading-4 text-left">
          <div>
            <span className="font-semibold mr-2">{username}</span>{" "}
            <span className="text-xs text-foreground-secondary">2m</span>
          </div>
          <div className="text-sm text-foreground-secondary">
            {t("intro.story.storyText")}
          </div>
        </div>
      </div>
      <img
        className="w-20 h-20 rounded-lg mx-auto mt-2"
        src={track?.image}
        alt={track?.title}
      />
      <div className="absolute z-10 px-2 py-4 bottom-0 w-full bg-gradient-to-t from-background to-transparent">
        <div className="btn btn-primary w-full">{t("listen.actionJoin")}</div>
      </div>
    </animated.div>
  );
};

const IndexStoryMessage: React.FC = ({ children }) => (
  <div className="w-full text-left text-sm mt-3 hover:bg-background-secondary p-1 whitespace-normal">
    {children}
  </div>
);
const IndexStorySocial: React.FC = () => {
  const [ref, inView] = useInView();
  const { t } = useI18n();

  const style = useSpring(
    inView
      ? { opacity: 1, transform: "skewY(8deg) translateY(10px)" }
      : intialStyle
  );

  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id: featuredTrackId },
  });

  return (
    <animated.div
      className="w-64 h-72 mt-10 mx-1 bg-warning-dark rounded-lg shadow-lg inline-flex flex-col flex-center p-1 text-foreground-secondary"
      style={style}
      ref={ref}
    >
      <IndexStoryMessage>
        <SvgMusic className="inline w-6 h-6 mr-2 bg-background-secondary p-1 rounded-full" />
        <span className="text-foreground-tertiary">
          {t("message.play.text", { username: username2 })}
        </span>{" "}
        <a
          href={track?.url}
          target="_blank"
          rel="noreferrer"
          className="text-foreground-secondary hover:text-foreground transition-colors"
        >
          <i>{track?.artists.map(({ name }) => name).join(", ")}</i> -{" "}
          {track?.title}
        </a>
      </IndexStoryMessage>
      <IndexStoryMessage>
        <b>{username}</b> {t("intro.story.storyMsg1")}
      </IndexStoryMessage>
      <IndexStoryMessage>
        <SvgLogIn className="inline w-6 h-6 mr-2 bg-background-secondary p-1 rounded-full" />
        <span className="text-foreground-tertiary">
          {t("message.join.text", { username: username1 })}
        </span>
      </IndexStoryMessage>
      <IndexStoryMessage>
        <b>{username}</b> {t("intro.story.storyMsg2")}
      </IndexStoryMessage>
      <IndexStoryMessage>
        <b>{username1}</b> {t("intro.story.storyMsg3")}
      </IndexStoryMessage>
    </animated.div>
  );
};

const IndexStory: React.FC = () => {
  const { t } = useI18n();
  const [ref, style] = useFadeInOnScroll();

  return (
    <IndexSection>
      <div className="flex flex-col-reverse md:flex-row">
        <div
          className="relative w-full overflow-x-auto overflow-y-hidden pb-8 flex-1 md:w-0 whitespace-nowrap text-center"
          role="img"
        >
          <IndexStoryJoin />
          <IndexStorySocial />
        </div>
        <animated.div
          ref={ref}
          style={style}
          className="py-2 px-2 md:px-8 text-center md:text-left md:w-7/12"
        >
          <IndexTitle>{t("intro.story.title")}</IndexTitle>
          <IndexParagraph>{t("intro.story.p1")}</IndexParagraph>
          <IndexParagraph>
            {t("intro.story.p2")} <b>{t("intro.story.p2end")}</b>
          </IndexParagraph>
        </animated.div>
      </div>
    </IndexSection>
  );
};

export default IndexStory;
