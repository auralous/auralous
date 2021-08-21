import { Button, ButtonProps, Colors, Size, Text } from "@auralous/ui";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  ComponentProps,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { useBackHandlerDismiss } from "./useBackHandlerDismiss";

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingHorizontal: Size[1],
  },
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderTopLeftRadius: Size[8],
    borderTopRightRadius: Size[8],
    bottom: 0,
    left: 0,
    padding: Size[6],
    position: "absolute",
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    paddingTop: Size[6],
  },
  titleContainer: {
    paddingBottom: Size[6],
  },
});

interface BottomSheetDialogProps {
  visible: boolean;
  onDismiss?(): void;
}

const snapPoints = ["100%"];

export const Dialog: FC<BottomSheetDialogProps> = ({
  visible,
  children,
  onDismiss,
}) => {
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) ref.current?.present();
    else ref.current?.dismiss();
  }, [visible]);

  useBackHandlerDismiss(visible, onDismiss);

  return (
    <BottomSheetModal
      ref={ref}
      handleComponent={null}
      backdropComponent={BottomSheetBackdrop}
      backgroundComponent={null}
      snapPoints={snapPoints}
      stackBehavior="push"
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      dismissOnPanDown={false}
    >
      <View style={styles.container}>{children}</View>
    </BottomSheetModal>
  );
};

export const DialogTitle: FC<{ children: string }> = ({ children }) => (
  <View style={styles.titleContainer}>
    <Text size="xl" align="center">
      {children}
    </Text>
  </View>
);

export const DialogContent: FC = ({ children }) => <View>{children}</View>;

export const DialogContentText: FC<
  { children: string } & ComponentProps<typeof Text>
> = ({ children, ...props }) => (
  <Text align="center" color="textSecondary" {...props}>
    {children}
  </Text>
);

export const DialogFooter: FC = ({ children }) => (
  <View style={styles.footer}>{children}</View>
);

export const DialogButton: FC<ButtonProps> = ({ children, ...props }) => (
  <View style={styles.button}>
    <Button {...props}>{children}</Button>
  </View>
);

export const useDialog = () => {
  const [visible, setVisible] = useState(false);
  const dismiss = useCallback(() => setVisible(false), []);
  const present = useCallback(() => setVisible(true), []);
  return [visible, present, dismiss] as const;
};
