import type { FC } from "react";
import { Modal } from "react-native";
import { Toaster } from "../Toast";

interface ModalProps {
  visible: boolean;
  onDismiss?(): void;
}

export const SlideModal: FC<ModalProps> = ({
  visible,
  onDismiss,
  children,
}) => {
  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onDismiss}
      transparent
      statusBarTranslucent
    >
      {children}
      <Toaster />
    </Modal>
  );
};

export const FadeModal: FC<ModalProps> = ({ visible, onDismiss, children }) => {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
      transparent
      statusBarTranslucent
    >
      {children}
      <Toaster />
    </Modal>
  );
};
