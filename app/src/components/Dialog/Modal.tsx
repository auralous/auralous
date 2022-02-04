import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { BottomSheetModalBackdrop } from "../BottomSheet";
import { NullComponent } from "../misc";

interface SlideModalProps {
  visible: boolean;
  onDismiss?(): void;
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: Colors.backgroundSecondary,
  },
  bs: {
    borderRadius: 15,
    marginHorizontal: "auto",
    overflow: "hidden",
  },
});

const snapPoints = ["100%"];

export const SlideModal: FC<SlideModalProps> = ({
  visible,
  onDismiss,
  children,
}) => {
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) ref.current?.present();
    else ref.current?.dismiss();
  }, [visible]);

  const windowWidth = useWindowDimensions().width;

  return (
    <BottomSheetModal
      ref={ref}
      backgroundStyle={styles.bg}
      backdropComponent={BottomSheetModalBackdrop}
      handleHeight={0}
      handleComponent={NullComponent}
      snapPoints={snapPoints}
      stackBehavior="push"
      onDismiss={onDismiss}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      enableDismissOnClose={false}
      enablePanDownToClose={false}
      style={[
        styles.bs,
        { maxWidth: Math.min(LayoutSize.md, windowWidth) - Size[8] },
      ]}
      detached
      bottomInset={Size[4]}
      topInset={Size[4]}
    >
      {children}
    </BottomSheetModal>
  );
};
