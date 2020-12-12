import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { animated, useSpring } from "react-spring";
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
import StoryQueue from "./StoryQueue";
import StoryListeners from "./StoryListeners";
import StoryQueueable from "./StoryQueueable";
import StoryShare from "./StoryShare";
import { Modal, useModal } from "~/components/Modal";
import { useCurrentUser } from "~/hooks/user";
import { SvgUserPlus, SvgShare2 } from "~/assets/svg";

const StoryChat = dynamic(() => import("./StoryChat"), { ssr: false });

const tabInactiveStyle = { opacity: 0, transform: "translate3d(0px,40px,0px)" };
const tabActiveStyle = { opacity: 1, transform: "translate3d(0px,0px,0px)" };
const AnimatedTabPanel = animated(TabPanel);

const StoryQueueableManager: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const [active, open, close] = useModal();

  const user = useCurrentUser();

  return (
    <>
      <div className="px-4 py-1 flex">
        {user?.id === story.creatorId && (
          <>
            <button
              className="btn mr-1 flex-none overflow-hidden inline-flex w-8 h-8 rounded-full p-0"
              title={t("story.queueable.title")}
              onClick={open}
            >
              <SvgUserPlus className="w-4 h-4" />
            </button>
            <Modal.Modal
              active={active}
              close={close}
              title={t("story.queueable.title")}
            >
              <Modal.Header>
                <Modal.Title>{t("story.queueable.title")}</Modal.Title>
              </Modal.Header>
              <Modal.Content>
                <StoryQueueable story={story} />
              </Modal.Content>
              <Modal.Footer>
                <button className="btn">{t("story.queueable.done")}</button>
              </Modal.Footer>
            </Modal.Modal>
          </>
        )}
        <div className="flex-1">
          <StoryListeners userIds={story.queueable} />
        </div>
      </div>
    </>
  );
};

const StoryUsers: React.FC<{ story: Story; userIds: string[] }> = ({
  story,
  userIds,
}) => {
  const { t } = useI18n();
  const [active, open, close] = useModal();

  return (
    <>
      <div className="px-4 py-1 flex">
        <button
          className="btn mr-1 flex-none overflow-hidden inline-flex w-8 h-8 rounded-full p-0"
          title={t("story.queueable.title")}
          onClick={open}
        >
          <SvgShare2 className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <StoryListeners userIds={userIds} />
        </div>
      </div>
      <Modal.Modal
        active={active}
        close={close}
        title={t("story.queueable.title")}
      >
        <Modal.Header>
          <Modal.Title>{t("story.share.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <StoryShare story={story} />
        </Modal.Content>
      </Modal.Modal>
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

  const getClassName = useCallback(
    (index: number) =>
      `mx-4 text-xs py-2 uppercase font-bold border-b-2 ${
        index === selectedIndex
          ? "border-white text-foreground"
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
      <div className="h-screen-layout relative overflow-hidden flex flex-col">
        <div className="lg:flex justify-between bg-background bg-opacity-50 backdrop-blur">
          <div className="p-2 pb-0 lg:pb-2 flex-1">
            <StoryNav story={story} />
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
          <TabList className="bg-background bg-opacity-25">
            <Tab className={getClassName(0)}>{t("story.live.title")}</Tab>
            <Tab className={getClassName(1)}>{t("story.queue.title")}</Tab>
          </TabList>
          <TabPanels className="flex-1 h-0 relative bg-gradient-to-t from-black to-transparent">
            <AnimatedTabPanel
              style={tabPanel0Style}
              className={`${
                selectedIndex === 0 ? "flex" : "hidden"
              } flex-col h-full`}
              as="div"
            >
              <StoryUsers userIds={storyUsers || []} story={story} />
              <div className="flex-1 h-0">
                <StoryChat story={story} />
              </div>
            </AnimatedTabPanel>
            <AnimatedTabPanel
              style={tabPanel1Style}
              className={`${
                selectedIndex === 1 ? "flex" : "hidden"
              } flex-col h-full`}
              as="div"
            >
              <StoryQueueableManager story={story} />
              <div className="flex-1 h-0">
                <StoryQueue story={story} />
              </div>
            </AnimatedTabPanel>
          </TabPanels>
        </Tabs>
        <StoryFooter story={story} />
        <StoryBg image={playerPlaying?.image} />
      </div>
    </>
  );
};

export default StoryMain;
