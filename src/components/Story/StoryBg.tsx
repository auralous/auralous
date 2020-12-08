import React from "react";
import { useTransition, animated, config as springConfig } from "react-spring";
import { useI18n } from "~/i18n/index";

const StoryBg: React.FC<{ image: string | undefined }> = ({ image }) => {
  const { t } = useI18n();

  const transitionImage = useTransition(image, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig.slow,
  });

  return (
    <>
      {transitionImage.map(
        ({ item, key, props }) =>
          item && (
            <animated.img
              style={props}
              key={key}
              alt={t("nowPlaying.title")}
              src={item}
              className="story-bg"
            />
          )
      )}
    </>
  );
};

export default StoryBg;
