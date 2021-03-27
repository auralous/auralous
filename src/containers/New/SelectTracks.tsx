import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import {
  TrackAdderPlaylist,
  TrackAdderSearch,
} from "components/Track/TrackAdder";
import { TrackAdderCallbackFn } from "components/Track/TrackAdder/types";
import {
  Track,
  TrackDocument,
  TrackQuery,
  TrackQueryVariables,
} from "gql/gql.gen";
import { useI18n } from "i18n/index";
import { useCallback, useMemo, useState } from "react";
import { animated, useSpring } from "react-spring";
import { useClient } from "urql";

const tabInactiveStyle = { opacity: 0, transform: "translate3d(0px,40px,0px)" };
const tabActiveStyle = { opacity: 1, transform: "translate3d(0px,0px,0px)" };

const AnimatedTabPanel = animated(TabPanel);

const SelectTracks: React.FC<{
  initTracks: Track[];
  setInitTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  setDoneSelect(done: boolean): void;
}> = ({ initTracks, setInitTracks }) => {
  const { t } = useI18n();

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

  const client = useClient();

  const onAddTracks: TrackAdderCallbackFn = async (newTrackArray) => {
    const tracks = newTrackArray
      .map(
        (trackId) =>
          client.readQuery<TrackQuery, TrackQueryVariables>(TrackDocument, {
            id: trackId,
          })?.data?.track
      )
      .filter((value) => !!value) as Track[];
    setInitTracks((prevInitTracks) => [...prevInitTracks, ...tracks]);
    return false;
  };

  const addedTracks = useMemo(() => initTracks.map((iT) => iT.id), [
    initTracks,
  ]);

  return (
    <>
      <Tabs
        onChange={setSelectedIndex}
        index={selectedIndex}
        className="h-full flex flex-col overflow-hidden"
      >
        <TabList className="flex flex-none py-1 space-x-1">
          <Tab className={getClassName(0)}>{t("story.queue.search.title")}</Tab>
          <Tab className={getClassName(1)}>
            {t("story.queue.playlist.title")}
          </Tab>
        </TabList>
        <TabPanels className="flex-1 min-h-0">
          <AnimatedTabPanel style={tabPanelStyle0} className="h-full" as="div">
            <TrackAdderSearch
              callback={onAddTracks}
              addedTracks={addedTracks}
            />
          </AnimatedTabPanel>
          <AnimatedTabPanel style={tabPanelStyle1} className="h-full" as="div">
            <TrackAdderPlaylist
              callback={onAddTracks}
              addedTracks={addedTracks}
              inactive={selectedIndex !== 1}
            />
          </AnimatedTabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default SelectTracks;
