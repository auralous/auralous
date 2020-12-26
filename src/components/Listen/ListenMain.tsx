import { DialogOverlay } from "@reach/dialog";
import React, { useState } from "react";
import { SvgChevronDown } from "~/assets/svg";
import { useI18n } from "~/i18n/index";
import { usePlayer } from "~/components/Player";
import StorySlider from "~/components/Story/StorySlider";

const ListenMain: React.FC = () => {
  const { t } = useI18n();
  const [id, setId] = useState<string | undefined>();
  const { playStory } = usePlayer();

  return (
    <>
      <h1 className="px-4 pt-6 pb-2 font-bold text-4xl mb-2 bg-gradient-to-b from-background to-transparent">
        {t("listen.title")}
      </h1>
      <div className="container relative">
        <button onClick={() => setId("PUBLIC")}>Click me</button>
      </div>
      {id && (
        <DialogOverlay isOpen style={{ zIndex: 10 }}>
          <button
            className="btn absolute top-4 z-20 right-3 p-1.5 rounded-full"
            onClick={() => {
              playStory("");
              setId(undefined);
            }}
            aria-label={t("modal.close")}
          >
            <SvgChevronDown className="w-4 h-4" />
          </button>
          <StorySlider id={id} />
        </DialogOverlay>
      )}
    </>
  );
};

export default ListenMain;
