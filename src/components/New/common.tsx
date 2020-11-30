import React, { useState } from "react";
import { animated, useSpring } from "react-spring";

export const LoadingDots: React.FC = () => {
  const [reset, setReset] = useState(false);
  const { num } = useSpring({
    num: 3,
    from: { num: 0 },
    reset,
    onStart: () => setReset(false),
    onRest: () => setReset(true),
    delay: 250,
  });
  return (
    <animated.span>
      {num.interpolate((v) => {
        return new Array(Math.round(v)).fill(".").join("");
      })}
    </animated.span>
  );
};
