import player, {
  usePlaybackContextMeta,
  usePlaybackCurrentContext,
  usePlaybackCurrentControl,
  usePlaybackTrackId,
} from "@/player";
import { useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import PlayerViewControl from "./PlayerViewControl";
import PlayerViewMeta from "./PlayerViewMeta";
import PlayerViewProgress from "./PlayerViewProgress";

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
    </View>
  );
};

export default MusicView;