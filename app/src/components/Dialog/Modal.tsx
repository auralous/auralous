import type { FC } from "react";
import { Modal } from "react-native";
import { Toaster } from "../Toast";

interface SlideModalProps {
  visible: boolean;
  onDismiss?(): void;
}

export const SlideModal: FC<SlideModalProps> = ({
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
