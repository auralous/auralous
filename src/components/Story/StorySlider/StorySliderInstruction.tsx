import { DialogOverlay } from "@reach/dialog";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useI18n } from "i18n/index";
import { useEffect, useState } from "react";

const storageKey = "storyswiper-instruction";

const StorySliderInstruction = () => {
  const { t } = useI18n();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.sessionStorage.getItem(storageKey)) setActive(true);
  }, []);

  const close = () => {
    window.sessionStorage.setItem(storageKey, "1");
    setActive(false);
  };

  return (
    <DialogOverlay
      isOpen={active}
      style={{ zIndex: 10, backdropFilter: "blur(2px)" }}
      aria-label={t("story.feed.instruction")}
    >
      <Box alignItems="center" padding={4}>
        <Typography.Paragraph size="lg" strong>
          {t("story.feed.instruction")}
        </Typography.Paragraph>
        <Button
          onPress={close}
          title={t("common.startListening")}
          color="primary"
          shape="circle"
        />
      </Box>
    </DialogOverlay>
  );
};

export default StorySliderInstruction;
