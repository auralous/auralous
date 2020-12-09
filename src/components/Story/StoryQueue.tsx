import React, { useCallback, useMemo, useState } from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { animated, useSpring } from "react-spring";
import { QueueManager, QueueViewer, useQueue } from "~/components/Queue";
import {
  TrackAdderPlaylist,
  TrackAdderSearch,
} from "~/components/Track/TrackAdder";
import { useCurrentUser } from "~/hooks/user";
import { QueueAction, Story, useUpdateQueueMutation } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgPlus } from "~/assets/svg";
import { useLogin } from "../Auth";
import { toast } from "~/lib/toast";
import { Modal, useModal } from "~/components/Modal";

const AnimatedTabPanel = animated(TabPanel);
const tabInactiveStyle = { opacity: 0, transform: "translate3d(0px,40px,0px)" };
const tabActiveStyle = { opacity: 1, transform: "translate3d(0px,0px,0px)" };

const StoryQueueAdder: React.FC<{
  story: Story;
  active: boolean;
  close(): void;
}> = ({ story, active, close }) => {
  const { t } = useI18n();

  const [, updateQueue] = useUpdateQueueMutation();
  const [queue] = useQueue(story.id);

  const addedTracks = useMemo(() => {
    if (!queue) return [];
    return queue.items.map(({ trackId }) => trackId);
  }, [queue]);

  const onAddTracks = useCallback(
    (newTrackArray: string[]) => {
      return updateQueue({
        id: story.id,
        tracks: newTrackArray,
        action: QueueAction.Add,
      }).then((result) => !!result.data?.updateQueue);
    },
    [updateQueue, story]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const getClassName = (index: number) =>
    `rounded-full flex-1 text-xs p-2 uppercase font-bold ${
      index === selectedIndex ? "bg-pink" : "bg-background-secondary"
    } transition-colors`;

  const tabPanelStyle0 = useSpring(
    0 === selectedIndex ? tabActiveStyle : tabInactiveStyle
  );
  const tabPanelStyle1 = useSpring(
    1 === selectedIndex ? tabActiveStyle : tabInactiveStyle
  );
  const tabPanelStyle2 = useSpring(
    2 === selectedIndex ? tabActiveStyle : tabInactiveStyle
  );

  return (
    <Modal.Modal active={active} onOutsideClick={close}>
      <Modal.Content className="h-screen-layout">
        <Tabs
          onChange={setSelectedIndex}
          index={selectedIndex}
          className="h-full flex flex-col overflow-hidden"
        >
          <TabList className="flex flex-none py-1 gap-1">
            <Tab className={getClassName(0)}>
              {t("story.queue.search.title")}
            </Tab>
            <Tab className={getClassName(1)}>
              {t("story.queue.playlist.title")}
            </Tab>
            <Tab className={`${getClassName(2)}`}>
              {t("story.queue.played.title")}
            </Tab>
          </TabList>
          <TabPanels className="flex-1 h-0">
            <AnimatedTabPanel
              style={tabPanelStyle0}
              className="h-full"
              as="div"
            >
              <TrackAdderSearch
                callback={onAddTracks}
                addedTracks={addedTracks}
              />
            </AnimatedTabPanel>
            <AnimatedTabPanel
              style={tabPanelStyle1}
              className="h-full"
              as="div"
            >
              <TrackAdderPlaylist
                callback={onAddTracks}
                addedTracks={addedTracks}
                queryConfig={
                  selectedIndex === 2 ? undefined : { enabled: false }
                }
              />
            </AnimatedTabPanel>
            <AnimatedTabPanel
              style={tabPanelStyle2}
              className="h-full"
              as="div"
            >
              <QueueViewer
                onAdd={onAddTracks}
                queueId={`${story.id}:played`}
                reverse
                queryOpts={selectedIndex === 2 ? undefined : { pause: true }}
              />
            </AnimatedTabPanel>
          </TabPanels>
        </Tabs>
      </Modal.Content>
      <Modal.Footer>
        <button onClick={close} className="btn w-full">
          {t("story.queue.adderClose")}
        </button>
      </Modal.Footer>
    </Modal.Modal>
  );
};

const StoryQueue: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const user = useCurrentUser();
  const isQueueable = Boolean(
    user && (story.creatorId === user.id || story.queueable.includes(user.id))
  );

  const [, showLogin] = useLogin();

  const [active, open, close] = useModal();

  const onAddButtonClick = () => {
    if (!user) return showLogin();
    if (!isQueueable)
      return toast.open({
        type: "info",
        message: t("story.queue.notAllowed"),
      });
    open();
  };

  return (
    <div className="h-full relative">
      <button
        title={t("story.queue.adderTitle")}
        onClick={onAddButtonClick}
        className="z-40 btn btn-primary rounded-full absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-12 h-12 md:w-16 md:h-16 p-1"
      >
        <SvgPlus />
      </button>
      <QueueManager
        isQueueable={isQueueable}
        queueId={story.id}
        onEmptyAddClick={open}
      />
      <StoryQueueAdder story={story} active={active} close={close} />
    </div>
  );
};

export default StoryQueue;
