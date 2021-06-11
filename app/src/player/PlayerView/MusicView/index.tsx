import { useTrackQuery } from "@/gql/gql.gen";
import { PlaybackState } from "@/player/Context";
import Player from "@/player/Player";
import { Size } from "@/styles";
import React from "react";
import { StyleSheet, View } from "react-native";
import PlayerViewControl from "./Control";
import PlayerViewMeta from "./Meta";
import PlayerViewProgress from "./Progress";
import Queue from "./Queue";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: Size[6],
    paddingTop: Size[2],
  },
});

const MusicView: React.FC<{
  player: Player;
  playbackState: PlaybackState;
}> = ({ player, playbackState }) => {
  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id: playbackState.trackId || "" },
    pause: !playbackState.trackId,
  });

  return (
    <View style={styles.root}>
      <PlayerViewMeta track={track || null} />
      <PlayerViewProgress track={track} player={player} />
      <PlayerViewControl playbackState={playbackState} player={player} />
      <Queue
        currentTrack={track || null}
        playbackState={playbackState}
        player={player}
        queue={playbackState.queue}
      />
    </View>
  );
};

export default MusicView;
