import { QueueModal } from "@/components/Queue";
import { useTrackQuery } from "@auralous/api";
import player, {
  usePlaybackContextMeta,
  usePlaybackCurrentContext,
  usePlaybackCurrentControl,
  usePlaybackNextItems,
  usePlaybackTrackId,
} from "@auralous/player";
import {
  PlayerViewControl,
  PlayerViewMeta,
  PlayerViewProgress,
  Size,
} from "@auralous/ui";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: Size[6],
    paddingTop: Size[2],
  },
});

const MusicView: FC = () => {
  const trackId = usePlaybackTrackId();
  const [{ data, fetching }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });
  const track = trackId ? data?.track : null;

  const currentControl = usePlaybackCurrentControl();
  const nextItems = usePlaybackNextItems();
  const contextMeta = usePlaybackContextMeta(usePlaybackCurrentContext());

  return (
    <View style={styles.root}>
      <PlayerViewMeta track={track || null} fetching={fetching} />
      <PlayerViewProgress
        track={track}
        player={player}
        isLive={!!contextMeta?.isLive}
      />
      <PlayerViewControl
        trackId={trackId}
        control={currentControl}
        player={player}
      />
      <QueueModal currentTrack={track || null} nextItems={nextItems} />
    </View>
  );
};

export default MusicView;
