import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import LayoutContext from "components/Layout/LayoutContext";
import { usePlayer } from "components/Player/index";
import { PlayerControl } from "components/Player/PlayerView";
import {
  Story,
  useNowPlayingReactionsUpdatedSubscription,
  useStoryQuery,
  useStoryUpdatedSubscription,
} from "gql/gql.gen";
import { useInnerHeightResizeRef } from "hooks/sizing";
import { useI18n } from "i18n/index";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import StoryNav from "./StoryNav";
import StoryPlayer from "./StoryPlayer";
import StoryQueue from "./StoryQueue";

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

  const router = useRouter();
  const { prevPathname } = useContext(LayoutContext);
  const onClose = useCallback(
    () => (prevPathname.current ? router.back() : router.replace("/listen")),
    [router, prevPathname]
  );

  return (
    <>
      <div
        ref={resizeRef}
        className="p-4 overflow-hidden flex flex-col justify-center"
        style={{ backgroundColor: "rgb(18, 18, 24)" }}
      >
        <StoryNav onClose={onClose} story={story} />
        <Tabs
          index={selectedIndex}
          onChange={setSelectedIndex}
          className="flex-1 h-0 flex flex-col"
        >
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
          <TabList className="py-1 text-center z-10">
            <Tab className={getClassName(0)}>{t("player.title")}</Tab>
            <Tab className={getClassName(1)}>{t("story.chat.title")}</Tab>
            <Tab className={getClassName(2)}>{t("story.queue.title")}</Tab>
          </TabList>
        </Tabs>
        <PlayerControl />
      </div>
    </>
  );
};

export default StoryMain;
