import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { usePlayer } from "~/components/Player/index";
import {
  Story,
  useStoryQuery,
  useStoryUsersQuery,
  usePingStoryMutation,
  useOnStoryUsersUpdatedSubscription,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import StoryNav from "./StoryNav";
import StoryBg from "./StoryBg";
import StoryHeader from "./StoryHeader";
import StoryFooter from "./StoryFooter";
import { useCurrentUser } from "~/hooks/user";
import { useLogin } from "~/components/Auth";

const StoryQueue = dynamic(() => import("./StoryQueue"), { ssr: false });
const StoryChat = dynamic(() => import("./StoryChat"), { ssr: false });
const StoryListeners = dynamic(() => import("./StoryListeners"), {
  ssr: false,
});

const StoryContent: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const { playStory } = usePlayer();
  useEffect(() => {
    playStory(story.id);
  }, [story, playStory]);

  const getClassName = (index: number) =>
    `mx-4 text-xs py-2 uppercase font-bold border-b-2 ${
      index === selectedIndex
        ? "border-white text-foreground"
        : "border-transparent text-foreground-secondary"
    } transition-colors`;

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

  // get current users in story
  const [
    { data: { storyUsers } = { storyUsers: undefined } },
  ] = useStoryUsersQuery({
    variables: { id: story.id },
    pollInterval: 60 * 1000,
    requestPolicy: "cache-and-network",
    pause: !user,
  });

  useOnStoryUsersUpdatedSubscription(
    { variables: { id: story.id || "" }, pause: !storyUsers },
    (prev, data) => data
  );

  const [, showLogin] = useLogin();

  return (
    <>
      <StoryHeader story={story} />
      <Tabs
        index={selectedIndex}
        onChange={(index) => {
          if (index === 2 && !user) return showLogin();
          setSelectedIndex(index);
        }}
        className="flex-1 h-0 flex flex-col"
      >
        <TabList className="bg-opacity-40 bg-black">
          <Tab className={getClassName(0)}>{t("story.live.title")}</Tab>
          <Tab className={getClassName(1)}>{t("story.queue.title")}</Tab>
          <Tab className={getClassName(2)}>{t("story.listeners.title")}</Tab>
        </TabList>
        <TabPanels className="flex-1 h-0 relative bg-gradient-to-t from-black to-transparent">
          <TabPanel className="h-full">
            <StoryChat story={story} />
          </TabPanel>
          <TabPanel className="h-full">
            <StoryQueue story={story} />
          </TabPanel>
          <TabPanel className="h-full">
            <StoryListeners userIds={storyUsers || []} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <StoryFooter story={story} />
    </>
  );
};

const StoryMain: React.FC<{ initialStory: Story }> = ({ initialStory }) => {
  // initialStory is the same as story, only might be a outdated version
  // so it can be used as backup
  const [{ data }] = useStoryQuery({
    variables: { id: initialStory.id as string },
  });
  const story = data?.story || initialStory;

  const {
    state: { playerPlaying },
  } = usePlayer();

  return (
    <>
      <div className="h-screen-layout relative overflow-hidden flex flex-col">
        <div className="pt-2 px-2 bg-opacity-40 bg-black">
          <StoryNav story={story} />
        </div>
        <StoryBg image={playerPlaying?.image} />
        <StoryContent story={story} />
      </div>
    </>
  );
};

export default StoryMain;
