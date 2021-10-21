import type { FC } from "react";
import { Modal, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

interface SlideModalProps {
  visible: boolean;
  onDismiss?(): void;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export const SlideModal: FC<SlideModalProps> = ({
  visible,
  onDismiss,
  children,
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onDismiss}
      transparent
      statusBarTranslucent
      animationType="slide"
    >
      <Animated.View style={styles.root}>{children}</Animated.View>
    </Modal>
  );
};
