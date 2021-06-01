import { IconX } from "@/assets/svg";
import { BottomSheetCustomBackground } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import BottomSheet from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import React, { forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

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

const snapPoints = [0, "100%"];

interface QueueSheetProps {
  onClose(): void;
}

const QueueSheet = forwardRef<BottomSheet, QueueSheetProps>(function QueueSheet(
  { onClose },
  ref
) {
  const { t } = useTranslation();
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
          <Heading level={3}>{t("queue.title")}</Heading>
          <TouchableOpacity onPress={onClose}>
            <IconX width={Size[8]} height={Size[8]} stroke={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}></View>
      </View>
    </BottomSheet>
  );
});

const Queue: React.FC = () => {
  const { t } = useTranslation();
  const ref = useRef<BottomSheet>(null);

  return (
    <>
      <View>
        <Button onPress={() => ref.current?.snapTo(1)}>
          {t("queue.title")}
        </Button>
      </View>
      <Portal>
        <QueueSheet ref={ref} onClose={() => ref.current?.snapTo(0)} />
      </Portal>
    </>
  );
};

export default Queue;
