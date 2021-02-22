import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import { useWindowHeight } from "@react-hook/window-size";
import clsx from "clsx";
import LayoutContext from "components/Layout/LayoutApp/LayoutAppContext";
import { PlayerControl, usePlayer } from "components/Player";
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
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import StoryPlayer from "./StoryPlayer";
import StoryQueue from "./StoryQueue";

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
      `mx-1 px-3 text-xs py-1 rounded-full uppercase ${
        index === selectedIndex
          ? "font-bold text-primary"
          : "text-foreground-tertiary opacity-50"
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

  const router = useRouter();
  const { prevPathname } = useContext(LayoutContext);

  const onClose = useCallback(
    () => (prevPathname.current ? router.back() : router.replace("/listen")),
    [router, prevPathname]
  );

  const height = useWindowHeight();

  return (
    <Tabs index={selectedIndex} onChange={setSelectedIndex}>
      <Box padding={4} justifyContent="center" style={{ height }}>
        <StoryNav onClose={onClose} story={story} />
        <TabPanels className="flex-1 min-h-0 relative">
          <AnimatedTabPanel
            style={tabPanel0Style}
            className={clsx(
              selectedIndex === 0 ? "flex" : "hidden",
              "justify-center",
              "h-full"
            )}
            as="div"
          >
            <StoryPlayer story={story} />
          </AnimatedTabPanel>
          <AnimatedTabPanel style={tabPanel1Style} className="h-full" as="div">
            <StoryChat story={story} />
          </AnimatedTabPanel>
          <AnimatedTabPanel style={tabPanel2Style} className="h-full" as="div">
            <StoryQueue story={story} />
          </AnimatedTabPanel>
        </TabPanels>
        <TabList className="py-2 text-center z-10">
          <Tab className={getClassName(0)}>{t("player.title")}</Tab>
          <Tab className={getClassName(1)}>{t("story.chat.title")}</Tab>
          <Tab className={getClassName(2)}>{t("story.queue.title")}</Tab>
        </TabList>
        <PlayerControl />
      </Box>
    </Tabs>
  );
};

export default StoryContainer;
