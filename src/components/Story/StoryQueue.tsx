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
import { SvgClock } from "~/assets/svg";
import { useLogin } from "../Auth";
import { toast } from "~/lib/toast";

const AnimatedTabPanel = animated(TabPanel);
const tabInactiveStyle = { opacity: 0, transform: "translate3d(0px,40px,0px)" };
const tabActiveStyle = { opacity: 1, transform: "translate3d(0px,0px,0px)" };

const StoryQueue: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const user = useCurrentUser();
  const isQueueable = Boolean(
    user && (story.creatorId === user.id || story.queueable.includes(user.id))
  );

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
      index === selectedIndex ? "bg-success" : "bg-background-secondary"
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
  const tabPanelStyle3 = useSpring(
    3 === selectedIndex ? tabActiveStyle : tabInactiveStyle
  );

  const [, showLogin] = useLogin();

  const onTabChange = useCallback(
    (index: number) => {
      if (index === 1 || index === 2) {
        // These two requires user to log in
        if (!user) return showLogin();
        // ...and be allowed to add to queue
        if (!isQueueable)
          return toast.open({
            type: "info",
            message: t("story.queue.notAllowed"),
          });
      }
      setSelectedIndex(index);
    },
    [showLogin, user, t, isQueueable]
  );

  return (
    <Tabs
      onChange={onTabChange}
      index={selectedIndex}
      className="h-full flex flex-col overflow-hidden"
    >
      <TabList className="flex flex-none py-1 gap-1">
        <Tab className={getClassName(0)}>{t("story.queue.queue.title")}</Tab>
        <Tab className={getClassName(1)}>{t("story.queue.search.title")}</Tab>
        <Tab className={getClassName(2)}>{t("story.queue.playlist.title")}</Tab>
        <Tab
          className={`${getClassName(3)} flex-grow-0`}
          title={t("story.queue.played.title")}
        >
          <SvgClock width="16" height="16" />
        </Tab>
      </TabList>
      <TabPanels className="flex-1 h-0">
        <AnimatedTabPanel style={tabPanelStyle0} className="h-full" as="div">
          <QueueManager
            isQueueable={isQueueable}
            queueId={story.id}
            onEmptyAddClick={() => setSelectedIndex(1)}
          />
        </AnimatedTabPanel>
        <AnimatedTabPanel style={tabPanelStyle1} className="h-full" as="div">
          <TrackAdderSearch callback={onAddTracks} addedTracks={addedTracks} />
        </AnimatedTabPanel>
        <AnimatedTabPanel style={tabPanelStyle2} className="h-full" as="div">
          <TrackAdderPlaylist
            callback={onAddTracks}
            addedTracks={addedTracks}
            queryConfig={selectedIndex === 2 ? undefined : { enabled: false }}
          />
        </AnimatedTabPanel>
        <AnimatedTabPanel style={tabPanelStyle3} className="h-full" as="div">
          <QueueViewer
            onAdd={isQueueable ? onAddTracks : undefined}
            queueId={`${story.id}:played`}
            reverse
            queryOpts={selectedIndex === 3 ? undefined : { pause: true }}
          />
        </AnimatedTabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default StoryQueue;
