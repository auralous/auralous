import { Toaster } from "@/components/Toast";
import type { FC, PropsWithChildren } from "react";
import { Modal } from "react-native";

interface ModalProps {
  visible: boolean;
  onDismiss?(): void;
}

export const SlideModal: FC<PropsWithChildren<ModalProps>> = ({
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

export const FadeModal: FC<PropsWithChildren<ModalProps>> = ({
  visible,
  onDismiss,
  children,
}) => {
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
