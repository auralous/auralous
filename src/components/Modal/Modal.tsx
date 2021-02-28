import { DialogContent, DialogOverlay } from "@reach/dialog";
import { SvgX } from "assets/svg";
import clsx from "clsx";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useI18n } from "i18n/index";
import { animated, config as springConfig, useTransition } from "react-spring";

const ModalHeader: React.FC = ({ children }) => (
  <Box row padding="md">
    {children}
  </Box>
);

const ModalTitle: React.FC = ({ children }) => (
  <Typography.Title noMargin level={4} size="lg">
    {children}
  </Typography.Title>
);

const ModalContent: React.FC<{
  noPadding?: boolean;
}> = ({ children, noPadding }) => (
  <div className={clsx("flex-1 overflow-auto", !noPadding && "px-4 py-8")}>
    {children}
  </div>
);

const ModalFooter: React.FC = ({ children }) => (
  <Box row alignItems="center" justifyContent="end" gap="sm" padding="md">
    {children}
  </Box>
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
    config: springConfig.default,
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
                  <Box position="absolute" top={2} right={2}>
                    <Button
                      accessibilityLabel={t("modal.close")}
                      icon={<SvgX className="w-8 h-8" />}
                      onPress={close}
                      shape="circle"
                      styling="link"
                    />
                  </Box>
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
