import player, { useCurrentPlaybackMeta } from "@/player";
import {
  usePlaybackStateControlContext,
  usePlaybackStateSourceContext,
  usePlaybackStateStatusContext,
} from "@/player/Context";
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
  const trackId = usePlaybackStateSourceContext().trackId;
  const [{ data, fetching }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });
  const track = trackId ? data?.track : null;

  const playbackControl = usePlaybackStateControlContext();
  const currentMeta = useCurrentPlaybackMeta();

  const playbackFetching = usePlaybackStateStatusContext().fetching;

  return (
    <View style={styles.root}>
      <PlayerViewMeta
        track={track || null}
        fetching={fetching || playbackFetching}
      />
      <PlayerViewProgress
        track={track}
        player={player}
        isLive={!!currentMeta?.isLive}
      />
      <PlayerViewControl
        trackId={trackId}
        control={playbackControl}
        player={player}
      />
    </View>
  );
};

export default MusicView;
