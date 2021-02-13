import { DialogOverlay } from "@reach/dialog";
import React, { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { useI18n } from "~/i18n/index";

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
      <div className="max-w-xl mx-auto p-4 text-opacity-75 text-center">
        <p className="text-lg md:text-2xl font-bold mb-4">
          {t("story.feed.instruction")}
        </p>
        <Button
          onPress={close}
          title={t("common.startListening")}
          color="primary"
        />
      </div>
    </DialogOverlay>
  );
};

export default StorySliderInstruction;
