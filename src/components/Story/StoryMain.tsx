import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { animated, useSpring } from "react-spring";
import { usePlayer } from "~/components/Player/index";
import {
  Story,
  useStoryQuery,
  usePingStoryMutation,
  useStoryUpdatedSubscription,
  useNowPlayingReactionsUpdatedSubscription,
} from "~/graphql/gql.gen";
import StoryNav from "./StoryNav";
import StoryQueue from "./StoryQueue";
import StoryEnd from "./StoryEnd";
import StoryPlayer from "./StoryPlayer";
import LayoutBackButton from "~/components/Layout/LayoutBackButton";
import { PlayerControl } from "~/components/Player/PlayerView";
import { useCurrentUser } from "~/hooks/user";
import { useInnerHeightResizeRef } from "~/hooks/sizing";
import { useI18n } from "~/i18n/index";

const StoryChat = dynamic(() => import("./StoryChat"), { ssr: false });

const tabInactiveStyle = { opacity: 0, transform: "translate3d(0px,40px,0px)" };
const tabActiveStyle = { opacity: 1, transform: "translate3d(0px,0px,0px)" };
const AnimatedTabPanel = animated(TabPanel);

const StoryMain: React.FC<{ initialStory: Story }> = ({ initialStory }) => {
  // initialStory is the same as story, only might be a outdated version
  // so it can be used as backup
  const [{ data }] = useStoryQuery({
    variables: { id: initialStory.id },
    requestPolicy: "cache-and-network",
  });

  const story = data?.story || initialStory;

  useStoryUpdatedSubscription(
    { variables: { id: story.id }, pause: !story.isLive },
    (prev, data) => data
  );

  useNowPlayingReactionsUpdatedSubscription(
    { variables: { id: story.id }, pause: !story.isLive },
    (prev, data) => data
  );

  const { t } = useI18n();
  const { playStory } = usePlayer();
  useEffect(() => {
    playStory(story.id);
  }, [story, playStory]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const user = useCurrentUser();

  // This informs that the user is present in story
  const [, pingStory] = usePingStoryMutation();
  useEffect(() => {
    if (user) {
      const pingInterval = window.setInterval(() => {
        pingStory({ id: story.id });
      }, 30 * 1000);
      return () => window.clearInterval(pingInterval);
    }
  }, [story, user, pingStory]);

  const getClassName = useCallback(
    (index: number) =>
      `mx-1 px-3 text-xs py-1 rounded-full uppercase font-bold ${
        index === selectedIndex
          ? "text-foreground bg-primary-dark"
          : "border-transparent text-foreground-secondary"
      } transition-colors`,
    [selectedIndex]
  );

  const tabPanel0Style = useSpring(
    0 === selectedIndex ? tabActiveStyle : tabInactiveStyle
  );
  const tabPanel1Style = useSpring(
    1 === selectedIndex ? tabActiveStyle : tabInactiveStyle
  );
  const tabPanel2Style = useSpring(
    2 === selectedIndex ? tabActiveStyle : tabInactiveStyle
  );

  const resizeRef = useInnerHeightResizeRef();

  return (
    <>
      <div
        ref={resizeRef}
        className="p-4 overflow-hidden flex flex-col justify-center"
      >
        <div className="flex items-center mb-1">
          <LayoutBackButton />
          <StoryNav story={story} />
          <div className="self-center">
            <StoryEnd story={story}>
              {(openEnd) => (
                <button onClick={openEnd} className="btn text-sm bg-opacity-25">
                  {t("story.end.title")}
                </button>
              )}
            </StoryEnd>
          </div>
        </div>
        <Tabs
          index={selectedIndex}
          onChange={setSelectedIndex}
          className="flex-1 h-0 flex flex-col"
        >
          <TabList className="py-1 text-center">
            <Tab className={getClassName(0)}>{t("player.title")}</Tab>
            <Tab className={getClassName(1)}>{t("story.live.title")}</Tab>
            <Tab className={getClassName(2)}>{t("story.queue.title")}</Tab>
          </TabList>
          <TabPanels className="flex-1 h-0 relative">
            <AnimatedTabPanel
              style={tabPanel0Style}
              className="h-full"
              as="div"
            >
              <StoryPlayer story={story} />
            </AnimatedTabPanel>
            <AnimatedTabPanel
              style={tabPanel1Style}
              className="h-full"
              as="div"
            >
              <StoryChat story={story} />
            </AnimatedTabPanel>
            <AnimatedTabPanel
              style={tabPanel2Style}
              className="h-full"
              as="div"
            >
              <StoryQueue story={story} />
            </AnimatedTabPanel>
          </TabPanels>
        </Tabs>
        <PlayerControl />
      </div>
    </>
  );
};

export default StoryMain;
