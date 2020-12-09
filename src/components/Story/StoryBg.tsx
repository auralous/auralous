import React from "react";
import { useTransition, animated, config as springConfig } from "react-spring";

const StoryBg: React.FC<{ image: string | undefined }> = ({ image }) => {
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
            <animated.div
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: -1, ...props }}
              key={key}
            >
              <div
                style={{ backgroundImage: `url(${item})` }}
                className="w-full h-full opacity-25 bg-cover"
              />
            </animated.div>
          )
      )}
    </>
  );
};

export default StoryBg;
