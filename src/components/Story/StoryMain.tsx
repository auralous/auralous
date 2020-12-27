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
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import StoryNav from "./StoryNav";
import StoryHeader from "./StoryHeader";
import StoryQueue from "./StoryQueue";
import StoryEnd from "./StoryEnd";
import LayoutBackButton from "~/components/Layout/LayoutBackButton";
import { PlayerControl } from "~/components/Player/PlayerView";
import { useCurrentUser } from "~/hooks/user";

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

  useStoryUpdatedSubscription(
    { variables: { id: initialStory.id } },
    (prev, data) => data
  );

  const story = data?.story || initialStory;

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

  return (
    <>
      <div className="h-screen relative overflow-hidden flex flex-col">
        <div
          className="lg:flex justify-between border-b-4 border-primary"
          style={{ backgroundColor: "rgb(18, 18, 24)" }}
        >
          <div className="p-2 pb-0 lg:pb-2 flex-1 flex items-center">
            <LayoutBackButton />
            <StoryNav story={story} />
            <div className="self-center">
              <StoryEnd story={story}>
                {(openEnd) => (
                  <button
                    onClick={openEnd}
                    className="btn text-sm bg-opacity-25"
                  >
                    {t("story.end.title")}
                  </button>
                )}
              </StoryEnd>
            </div>
          </div>
          <div className="flex-1">
            <StoryHeader story={story} />
          </div>
        </div>
        <Tabs
          index={selectedIndex}
          onChange={setSelectedIndex}
          className="flex-1 h-0 flex flex-col"
        >
          <TabList className="py-1">
            <Tab className={getClassName(0)}>{t("story.live.title")}</Tab>
            <Tab className={getClassName(1)}>{t("story.queue.title")}</Tab>
          </TabList>
          <TabPanels className="flex-1 h-0 relative">
            <AnimatedTabPanel
              style={tabPanel0Style}
              className="h-full"
              as="div"
            >
              <StoryChat story={story} />
            </AnimatedTabPanel>
            <AnimatedTabPanel
              style={tabPanel1Style}
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
