import { IconX } from "@/assets/svg";
import { BottomSheetCustomBackground } from "@/components/BottomSheet";
import { Heading } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface PlayerViewSheetProps {
  children: React.ReactNode;
  title: string;
  onClose(): void;
}

const snapPoints = [0, "100%"];

const styles = StyleSheet.create({
  root: {
    padding: Size[4],
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const PlayerViewSheet = forwardRef<BottomSheet, PlayerViewSheetProps>(
  function PlayerViewSheet({ children, title, onClose }, ref) {
    const colors = useColors();
    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        backgroundComponent={BottomSheetCustomBackground}
        handleComponent={null}
      >
        <View style={styles.root}>
          <View style={styles.header}>
            <Heading level={3}>{title}</Heading>
            <TouchableOpacity onPress={onClose}>
              <IconX width={Size[8]} height={Size[8]} stroke={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>{children}</View>
        </View>
      </BottomSheet>
    );
  }
);

export default PlayerViewSheet;
