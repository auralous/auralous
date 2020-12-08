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
import StoryHeader from "./StoryHeader";
import StoryFooter from "./StoryFooter";
import { ShareDialog } from "~/components/Social";
import { useCurrentUser } from "~/hooks/user";
import { useModal } from "~/components/Modal";
import { useLogin } from "~/components/Auth";
import { SvgShare } from "~/assets/svg";

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
          <TabPanel className="absolute bottom-0 w-full h-96 max-h-full">
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

const Navbar: React.FC<{
  story: Story;
}> = ({ story }) => {
  const { t } = useI18n();

  const [activeShare, openShare, closeShare] = useModal();

  return (
    <>
      <div className="px-2 flex overflow-hidden bg-black bg-opacity-40">
        <div className="flex flex-1 w-0 items-center justify-start h-full">
          <h4 className="text-sm font-bold leading-tight truncate mr-2">
            {story.text}
          </h4>
        </div>
        <div className="flex items justify-end">
          <button onClick={openShare} className="btn p-2 mr-1">
            <SvgShare width="12" height="12" className="sm:mr-1" />
            <span className="text-xs sr-only sm:not-sr-only leading-none">
              {t("share.title")}
            </span>
          </button>
        </div>
      </div>
      <ShareDialog
        uri={`/story/${story.id}`}
        name={story.text}
        active={activeShare}
        close={closeShare}
      />
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
        <Navbar story={story} />
        {playerPlaying && (
          <img
            src={playerPlaying.image}
            alt={playerPlaying.title}
            className="story-bg"
          />
        )}
        <StoryContent story={story} />
      </div>
    </>
  );
};

export default StoryMain;
