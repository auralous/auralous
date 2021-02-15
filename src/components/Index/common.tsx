import { Typography } from "components/Typography";
import React from "react";
import { useInView } from "react-intersection-observer";
import { useSpring } from "react-spring";

export const IndexParagraph: React.FC = ({ children }) => (
  <Typography.Paragraph size="lg" color="foreground-secondary">
    {children}
  </Typography.Paragraph>
);

export const IndexTitle: React.FC = ({ children }) => (
  <h2 className="font-bold text-4xl md:text-5xl mb-6">{children}</h2>
);

export const useFadeInOnScroll = () => {
  const [ref, inView] = useInView();
  const props = useSpring(
    inView
      ? {
          opacity: 1,
          transform: "translateY(0px)",
        }
      : {
          opacity: 0,
          transform: "translateY(40px)",
        }
  );
  return [ref, props] as const;
};

export const IndexSection: React.FC = ({ children }) => {
  return <section className="px-6 py-24 overflow-x-hidden">{children}</section>;
};
