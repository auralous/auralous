import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import { Modal } from "components/Modal";
import { Button } from "components/Pressable";
import {
  TrackAdderPlaylist,
  TrackAdderSearch,
} from "components/Track/TrackAdder";
import { Story, useQueueAddMutation, useQueueQuery } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import { useCallback, useMemo, useState } from "react";
import { animated, useSpring } from "react-spring";

const AnimatedTabPanel = animated(TabPanel);
const tabInactiveStyle = { opacity: 0, transform: "translate3d(0px,40px,0px)" };
const tabActiveStyle = { opacity: 1, transform: "translate3d(0px,0px,0px)" };

const StoryQueueAdder: React.FC<{
  story: Story;
  active: boolean;
  close(): void;
}> = ({ story, active, close }) => {
  const { t } = useI18n();

  const [, queueAdd] = useQueueAddMutation();
  const [{ data: { queue } = { queue: undefined } }] = useQueueQuery({
    variables: { id: story.id },
  });

  const addedTracks = useMemo(() => {
    if (!queue) return [];
    return queue.items.map(({ trackId }) => trackId);
  }, [queue]);

  const onAddTracks = useCallback(
    (newTrackArray: string[]) => {
      return queueAdd({
        id: story.id,
        tracks: newTrackArray,
      }).then((result) => !!result.data?.queueAdd);
    },
    [queueAdd, story]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const getClassName = useCallback(
    (index: number) =>
      `rounded-full flex-1 text-xs p-2 uppercase font-bold ${
        index === selectedIndex ? "bg-primary" : "bg-background-secondary"
      } transition-colors`,
    [selectedIndex]
  );

  const tabPanelStyle0 = useSpring(
    0 === selectedIndex ? tabActiveStyle : tabInactiveStyle
  );
  const tabPanelStyle1 = useSpring(
    1 === selectedIndex ? tabActiveStyle : tabInactiveStyle
  );

  return (
    <Modal.Modal
      title={t("story.queue.adderTitle")}
      active={active}
      isFullHeight
    >
      <Modal.Content>
        <Tabs
          onChange={setSelectedIndex}
          index={selectedIndex}
          className="h-full flex flex-col overflow-hidden"
        >
          <TabList className="flex flex-none py-1 space-x-1">
            <Tab className={getClassName(0)}>
              {t("story.queue.search.title")}
            </Tab>
            <Tab className={getClassName(1)}>
              {t("story.queue.playlist.title")}
            </Tab>
          </TabList>
          <TabPanels className="flex-1 min-h-0">
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
                inactive={selectedIndex !== 1}
              />
            </AnimatedTabPanel>
          </TabPanels>
        </Tabs>
      </Modal.Content>
      <Modal.Footer>
        <Button onPress={close} title={t("common.done")} />
      </Modal.Footer>
    </Modal.Modal>
  );
};

export default StoryQueueAdder;
