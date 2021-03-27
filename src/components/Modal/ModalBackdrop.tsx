import { DialogOverlay } from "@reach/dialog";
import {
  animated,
  config as springConfig,
  useTransition,
} from "@react-spring/web";
import { SvgClose } from "assets/svg";
import { Button } from "components/Pressable";
import { Box } from "components/View";
import { useI18n } from "i18n";

const AnimatedDialogOverlay = animated(DialogOverlay);

const Modal: React.FC<{
  title: string;
  active: boolean;
  close?: () => void;
}> = ({ title, active, close, children }) => {
  const { t } = useI18n();

  const transition = useTransition(active, {
    from: {
      opacity: 0,
      transform: "translateY(40px)",
    },
    enter: {
      opacity: 1,
      transform: "translateY(0px)",
    },
    leave: {
      opacity: 0,
      transform: "translateY(40px)",
    },
    config: springConfig.default,
  });

  return (
    <>
      {transition((style, item) => (
        <AnimatedDialogOverlay
          aria-label={title}
          isOpen={item}
          style={style}
          className="backdrop-blur"
          as="div"
        >
          {children}
          {close && (
            <Box position="absolute" top={4} right={4}>
              <Button
                accessibilityLabel={t("modal.close")}
                onPress={close}
                icon={<SvgClose className="w-8 h-8" />}
                styling="link"
              />
            </Box>
          )}
        </AnimatedDialogOverlay>
      ))}
    </>
  );
};

export default {
  Modal,
};
