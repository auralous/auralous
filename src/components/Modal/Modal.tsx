import React from "react";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { useTransition, animated, config as springConfig } from "react-spring";
import { SvgX } from "~/assets/svg";
import { useI18n } from "~/i18n/index";

const ModalHeader: React.FC = ({ children }) => (
  <div className="p-4 border-b-2 border-background-secondary">{children}</div>
);

const ModalTitle: React.FC = ({ children }) => (
  <h4 className="text-lg font-medium flex items-center">{children}</h4>
);

const ModalContent: React.FC<{
  noPadding?: boolean;
}> = ({ children, noPadding }) => (
  <div className={`${noPadding ? "" : "px-4 py-8"} flex-1 overflow-auto`}>
    {children}
  </div>
);

const ModalFooter: React.FC = ({ children }) => (
  <div className="modal-footer">{children}</div>
);

const AnimatedDialogOverlay = animated(DialogOverlay);
const AnimatedDialogContent = animated(DialogContent);

const Modal: React.FC<{
  title: string;
  active: boolean;
  close?: () => void;
  isFullHeight?: boolean;
}> = ({ title, children, active, close, isFullHeight }) => {
  const { t } = useI18n();

  const transitions = useTransition(active, null, {
    from: {
      opacity: 0,
      transform: "translateY(-40px)",
    },
    enter: {
      opacity: 1,
      transform: "translateY(0px)",
    },
    leave: {
      opacity: 0,
      transform: "translateY(-40px)",
    },
    config: springConfig.gentle,
  });

  return (
    <>
      {transitions.map(
        ({ item, key, props: style }) =>
          item && (
            <AnimatedDialogOverlay
              isOpen={style.opacity !== 0}
              onDismiss={() => close && close()}
              key={key}
              style={{ opacity: style.opacity }}
              as="div"
            >
              {/* FIXME: possibly upstream, aria-label tag not passed along */}
              <AnimatedDialogContent
                style={{
                  transform: style.transform,
                  ...(isFullHeight && { height: "100%" }),
                }}
                as="div"
                aria-label={title}
              >
                {children}
                {close && (
                  <button
                    className="btn absolute top-4 right-3 p-1.5 rounded-full"
                    onClick={close}
                    aria-label={t("modal.close")}
                  >
                    <SvgX className="w-4 h-4" />
                  </button>
                )}
              </AnimatedDialogContent>
            </AnimatedDialogOverlay>
          )
      )}
    </>
  );
};

export default {
  Modal,
  Header: ModalHeader,
  Title: ModalTitle,
  Content: ModalContent,
  Footer: ModalFooter,
};
