import {
  PlayerViewControl,
  PlayerViewMeta,
  PlayerViewProgress,
} from "@/components/Player";
import { useTrackQuery } from "@/gql/gql.gen";
import { PlaybackState, player } from "@/player/Context";
import { Size } from "@/styles";
import React from "react";
import { StyleSheet, View } from "react-native";
import QueueModal from "./Queue";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: Size[6],
    paddingTop: Size[2],
  },
});

const MusicView: React.FC<{
  playbackState: PlaybackState;
}> = ({ playbackState }) => {
  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id: playbackState.trackId || "" },
    pause: !playbackState.trackId,
  });

  return (
    <View style={styles.root}>
      <PlayerViewMeta track={track || null} />
      <PlayerViewProgress track={track} player={player} />
      <PlayerViewControl playbackState={playbackState} player={player} />
      <QueueModal currentTrack={track || null} playbackState={playbackState} />
    </View>
  );
};

export default MusicView;
