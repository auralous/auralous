import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import ChatButtonAndSheet from "./ChatButtonAndSheet";
import MusicView from "./MusicView";
import QueueButtonAndSheet from "./QueueButtonAndSheet";

const styles = StyleSheet.create({
  bottomBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    paddingTop: 0,
  },
  music: {
    flex: 1,
    padding: Size[6],
    paddingTop: Size[2],
  },
});

const PlayerViewContent: FC = () => {
  return (
    <View style={styles.content}>
      <View style={styles.music}>
        <MusicView />
        <View style={styles.bottomBtns}>
          <QueueButtonAndSheet />
          <ChatButtonAndSheet />
        </View>
      </View>
    </View>
  );
};

export default PlayerViewContent;
