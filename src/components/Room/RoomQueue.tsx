import React, { useCallback, useMemo } from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { QueueManager, QueueViewer, useQueue } from "~/components/Queue";
import {
  TrackAdderPlaylist,
  TrackAdderSearch,
} from "~/components/Track/TrackAdder";
import {
  QueueAction,
  Room,
  useUpdateQueueMutation,
  RoomState,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgClock } from "~/assets/svg";

const RoomQueue: React.FC<{ room: Room; roomState: RoomState }> = ({
  room,
  roomState,
}) => {
  const { t } = useI18n();

  const [, updateQueue] = useUpdateQueueMutation();

  const [queue] = useQueue(`room:${room.id}`);

  const addedTracks = useMemo(() => {
    if (!queue) return [];
    return queue.items.map(({ trackId }) => trackId);
  }, [queue]);

  const onAddTracks = useCallback(
    (newTrackArray: string[]) => {
      return updateQueue({
        id: `room:${room.id}`,
        tracks: newTrackArray,
        action: QueueAction.Add,
      }).then((result) => !!result.data?.updateQueue);
    },
    [updateQueue, room]
  );

  return (
    <Tabs className="h-full flex flex-col overflow-hidden">
      {({ selectedIndex }) => {
        const getClassName = (index: number) =>
          `flex-1 mx-1 p-1 text-sm rounded-lg font-bold ${
            index === selectedIndex ? "bg-pink text-white" : ""
          } transition duration-200`;
        return (
          <>
            <TabList className="flex flex-none">
              <Tab className={getClassName(0)}>
                {t("room.queue.queue.title")}
              </Tab>
              <Tab
                className={getClassName(1)}
                disabled={!roomState.permission.queueCanAdd}
              >
                {t("room.queue.search.title")}
              </Tab>
              <Tab
                className={getClassName(2)}
                disabled={!roomState.permission.queueCanAdd}
              >
                {t("room.queue.playlist.title")}
              </Tab>
              <Tab
                className={`${getClassName(3)} flex-grow-0`}
                title={t("room.queue.played.title")}
              >
                <SvgClock width="16" height="16" />
              </Tab>
            </TabList>
            <TabPanels className="flex-1 h-0">
              <TabPanel
                className={`${
                  selectedIndex === 0 ? "flex" : "hidden"
                } relative flex-col h-full`}
              >
                <QueueManager
                  permission={roomState.permission}
                  queueId={`room:${room.id}`}
                />
              </TabPanel>
              <TabPanel
                className={`${
                  selectedIndex === 1 ? "flex" : "hidden"
                } flex-col h-full`}
              >
                <TrackAdderSearch
                  callback={onAddTracks}
                  addedTracks={addedTracks}
                />
              </TabPanel>
              <TabPanel
                className={`${
                  selectedIndex === 2 ? "flex" : "hidden"
                } flex-col h-full overflow-hidden`}
              >
                <TrackAdderPlaylist
                  callback={onAddTracks}
                  addedTracks={addedTracks}
                  queryConfig={
                    selectedIndex === 2 ? undefined : { enabled: false }
                  }
                />
              </TabPanel>
              <TabPanel
                className={`${
                  selectedIndex === 3 ? "flex" : "hidden"
                } flex-col h-full overflow-hidden`}
              >
                <QueueViewer
                  onAdd={
                    roomState.permission.queueCanAdd ? onAddTracks : undefined
                  }
                  queueId={`room:${room.id}:played`}
                  reverse
                  queryOpts={selectedIndex === 3 ? undefined : { pause: true }}
                />
              </TabPanel>
            </TabPanels>
          </>
        );
      }}
    </Tabs>
  );
};

export default RoomQueue;
