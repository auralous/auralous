import { useTrackQuery } from "@auralous/api";
import player, {
  usePlaybackContextMeta,
  usePlaybackCurrentContext,
  usePlaybackCurrentControl,
  usePlaybackTrackId,
} from "@auralous/player";
import {
  PlayerViewBackground,
  PlayerViewControl,
  PlayerViewMeta,
  PlayerViewProgress,
  Size,
} from "@auralous/ui";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface PlayerViewProps {
  visible: boolean;
  onDismiss(): void;
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    padding: Size[6],
    paddingTop: Size[2],
  },
  root: {
    backgroundColor: "black",
    flex: 1,
  },
});

const PlayerViewInner: FC = () => {
  const trackId = usePlaybackTrackId();
  const [{ data, fetching }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });
  const track = trackId ? data?.track : null;

  const currentControl = usePlaybackCurrentControl();
  const contextMeta = usePlaybackContextMeta(usePlaybackCurrentContext());

  return (
    <View style={styles.inner}>
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

const ModalInner: FC<{ visible: boolean; setMount(mount: boolean): void }> = ({
  visible,
  setMount,
}) => {
  const sharedValue = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      sharedValue.value = withTiming(1);
    } else {
      sharedValue.value = withTiming(0, undefined, (isFinished) => {
        if (isFinished) runOnJS(setMount)(false);
      });
    }
  }, [visible, sharedValue, setMount]);

  const rootAnimatedStyle = useAnimatedStyle(() => {
    return {
      bottom: (sharedValue.value - 1) * 100 + "%",
    };
  }, []);

  return (
    <Animated.View style={[styles.root, rootAnimatedStyle]}>
      <PlayerViewBackground />
      <PlayerViewInner />
    </Animated.View>
  );
};

const PlayerView: FC<PlayerViewProps> = ({ visible, onDismiss }) => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (visible) setMount(true);
  }, [visible]);

  return (
    <Modal
      visible={mount}
      onRequestClose={onDismiss}
      transparent
      statusBarTranslucent
    >
      <ModalInner visible={visible} setMount={setMount} />
    </Modal>
  );
};

export default PlayerView;
