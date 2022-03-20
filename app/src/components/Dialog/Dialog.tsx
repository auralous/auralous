import { IconX } from "@/assets";
import type { ButtonProps } from "@/components/Button";
import { Button } from "@/components/Button";
import { Toaster } from "@/components/Toast";
import { Text } from "@/components/Typography";
import { AnimationEasings } from "@/styles/animation";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import type { ComponentProps, FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "black",
    ...StyleSheet.absoluteFillObject,
  },
  backdropPressable: {
    flex: 1,
  },
  button: {
    flex: 1,
    paddingHorizontal: Size[1],
  },
  closeBtn: {
    position: "absolute",
    right: Size[4],
    top: Size[4],
    zIndex: 1,
  },
  container: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Size[6],
  },
  containerLand: {
    borderRadius: Size[2],
    margin: "auto",
    maxWidth: "100%",
    width: LayoutSize.md,
  },
  containerPor: {
    borderTopLeftRadius: Size[4],
    borderTopRightRadius: Size[4],
    marginTop: "auto",
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
      sharedValue.value = withTiming(1, {
        easing: AnimationEasings.outExp,
      });
    } else {
      sharedValue.value = withTiming(0, undefined, (isFinished) => {
        if (isFinished) runOnJS(setMount)(false);
      });
    }
  }, [visible, sharedValue]);

  const backdropStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(sharedValue.value, [0, 1], [0, 0.5]),
    }),
    []
  );

  const { width: windowWidth } = useWindowDimensions();
  const isLargeScreen = windowWidth >= LayoutSize.md;

  const contentStyle = useAnimatedStyle(
    () => ({
      bottom: !isLargeScreen ? (sharedValue.value - 1) * 100 + "%" : 0,
      opacity: isLargeScreen ? sharedValue.value : 1,
    }),
    [isLargeScreen]
  );

  const { t } = useTranslation();

  return (
    <Modal
      visible={mount}
      onRequestClose={onDismiss}
      transparent
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, backdropStyle]} focusable={false}>
        {onDismiss && (
          <Pressable
            accessibilityLabel={t("common.navigation.close")}
            onPress={onDismiss}
            style={styles.backdropPressable}
          />
        )}
      </Animated.View>
      <Animated.View
        style={[
          styles.container,
          isLargeScreen ? styles.containerLand : styles.containerPor,
          contentStyle,
        ]}
      >
        {onDismiss && (
          <Pressable
            style={styles.closeBtn}
            accessibilityLabel={t("common.navigation.close")}
            onPress={onDismiss}
          >
            <IconX />
          </Pressable>
        )}
        {children}
      </Animated.View>
      <Toaster />
    </Modal>
  );
};

const DialogTitle: FC = ({ children }) => (
  <View style={styles.titleContainer}>
    <Text size="xl" align="center">
      {children}
    </Text>
  </View>
);

const DialogContent: FC = ({ children }) => <View>{children}</View>;

const DialogContentText: FC<ComponentProps<typeof Text>> = ({
  children,
  ...props
}) => (
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
  return [visible, present, dismiss] as [
    visible: boolean,
    present: () => void,
    dismiss: () => void
  ];
};
