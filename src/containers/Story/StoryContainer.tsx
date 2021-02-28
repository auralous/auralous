import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import { useWindowHeight } from "@react-hook/window-size";
import LayoutContext from "components/Layout/LayoutApp/LayoutAppContext";
import { usePlayer } from "components/Player";
import { Spacer } from "components/Spacer";
import { StoryNav } from "components/Story";
import { Box } from "components/View";
import {
  Story,
  useNowPlayingReactionsUpdatedSubscription,
  useStoryQuery,
  useStoryUpdatedSubscription,
} from "gql/gql.gen";
import { useI18n } from "i18n/index";
import dynamic from "next/dynamic";
import { useCallback, useContext, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import StoryPlayer from "./StoryPlayer";
import StoryQueue from "./StoryQueue";
import StoryTopPlayer from "./StoryTopPlayer";

const StoryChat = dynamic(() => import("./StoryChat"), { ssr: false });

const tabInactiveStyle = { opacity: 0, transform: "translate3d(0px,40px,0px)" };
const tabActiveStyle = { opacity: 1, transform: "translate3d(0px,0px,0px)" };
const AnimatedTabPanel = animated(TabPanel);

const StoryContainer: React.FC<{ initialStory: Story }> = ({
  initialStory,
}) => {
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
      `px-3 text-xs py-2 uppercase font-bold flex-1 ${
        index === selectedIndex
          ? "text-background bg-foreground"
          : "text-foreground-tertiary bg-background-secondary opacity-50"
      } transition`,
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

  const { back } = useContext(LayoutContext);

  const height = useWindowHeight();

  return (
    <Tabs index={selectedIndex} onChange={setSelectedIndex}>
      <Box
        position="relative"
        padding="md"
        justifyContent="center"
        style={{ height }}
      >
        <StoryNav onClose={back} story={story} />
        <StoryTopPlayer
          hidden={selectedIndex === 0}
          onPress={() => setSelectedIndex(0)}
        />
        <TabPanels className="flex-1 min-h-0 relative">
          <AnimatedTabPanel style={tabPanel0Style} className="h-full" as="div">
            <StoryPlayer story={story} />
          </AnimatedTabPanel>
          <AnimatedTabPanel style={tabPanel1Style} className="h-full" as="div">
            <StoryChat story={story} />
          </AnimatedTabPanel>
          <AnimatedTabPanel style={tabPanel2Style} className="h-full" as="div">
            <StoryQueue story={story} />
          </AnimatedTabPanel>
        </TabPanels>
        <Spacer axis="vertical" size={6} />
        <TabList className="overflow-hidden rounded-t-3xl bg-background-secondary absolute w-full bottom-0 left-0 flex z-10">
          <Tab className="sr-only">{t("player.title")}</Tab>
          <Tab className={getClassName(1)}>{t("story.chat.title")}</Tab>
          <Tab className={getClassName(2)}>{t("story.queue.title")}</Tab>
        </TabList>
      </Box>
    </Tabs>
  );
};

export default StoryContainer;
