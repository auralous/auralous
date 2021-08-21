import { Button, ButtonProps } from "@/components/Button";
import { Text } from "@/components/Typography";
import { Colors, Size } from "@/styles";
import { ComponentProps, FC, useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, .8)",
    ...StyleSheet.absoluteFillObject,
  },
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

const DialogRoot: FC<BottomSheetDialogProps> = ({
  visible,
  children,
  onDismiss,
}) => {
  const [mount, setMount] = useState(false);
  const sharedValue = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMount(true);
      sharedValue.value = withTiming(1);
    } else {
      sharedValue.value = withTiming(0, undefined, (isFinished) => {
        if (isFinished) runOnJS(setMount)(false);
      });
    }
  }, [visible, sharedValue]);

  const backdropStyle = useAnimatedStyle(
    () => ({
      opacity: sharedValue.value,
    }),
    []
  );

  const contentStyle = useAnimatedStyle(() => ({
    bottom: (sharedValue.value - 1) * 100 + "%",
  }));

  return (
    <Modal
      visible={mount}
      onRequestClose={onDismiss}
      transparent
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, backdropStyle]} />
      <Animated.View style={[styles.container, contentStyle]}>
        {children}
      </Animated.View>
    </Modal>
  );
};

const DialogTitle: FC<{ children: string }> = ({ children }) => (
  <View style={styles.titleContainer}>
    <Text size="xl" align="center">
      {children}
    </Text>
  </View>
);

const DialogContent: FC = ({ children }) => <View>{children}</View>;

const DialogContentText: FC<
  { children: string } & ComponentProps<typeof Text>
> = ({ children, ...props }) => (
  <Text align="center" color="textSecondary" {...props}>
    {children}
  </Text>
);

const DialogFooter: FC = ({ children }) => (
  <View style={styles.footer}>{children}</View>
);

const DialogButton: FC<ButtonProps> = ({ children, ...props }) => (
  <View style={styles.button}>
    <Button {...props}>{children}</Button>
  </View>
);

export const Dialog = {
  Dialog: DialogRoot,
  Title: DialogTitle,
  Content: DialogContent,
  ContentText: DialogContentText,
  Footer: DialogFooter,
  Button: DialogButton,
};

export const useDialog = () => {
  const [visible, setVisible] = useState(false);
  const dismiss = useCallback(() => setVisible(false), []);
  const present = useCallback(() => setVisible(true), []);
  return [visible, present, dismiss] as const;
};
