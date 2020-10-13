import React from "react";
import { Dialog } from "@reach/dialog";
import { SvgX } from "~/assets/svg";

const ModalHeader: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={`p-4 border-b-2 border-opacity-10 border-white ${
      className || ""
    }`}
  >
    {children}
  </div>
);

const ModalTitle: React.FC = ({ children }) => (
  <h4 className="text-lg font-bold flex items-center">{children}</h4>
);

const ModalContent: React.FC<{ className?: string; noPadding?: boolean }> = ({
  children,
  className,
  noPadding,
}) => (
  <div
    className={`${noPadding ? "" : "px-4 py-8"} flex-1 overflow-auto ${
      className || ""
    }`}
  >
    {children}
  </div>
);

const ModalFooter: React.FC = ({ children }) => (
  <div className="flex modal-footer h-12">{children}</div>
);

const Modal: React.FC<{
  title?: string;
  active: boolean;
  onOutsideClick?: () => void;
}> = ({ title, children, active, onOutsideClick }) => (
  <Dialog
    aria-label={title ?? "Dialog"}
    isOpen={active}
    onDismiss={() => onOutsideClick && onOutsideClick()}
  >
    {children}
    {onOutsideClick && (
      <button
        type="button"
        className="absolute top-4 right-4"
        onClick={onOutsideClick}
      >
        <SvgX />
      </button>
    )}
  </Dialog>
);

export default {
  Modal,
  Header: ModalHeader,
  Title: ModalTitle,
  Content: ModalContent,
  Footer: ModalFooter,
};
