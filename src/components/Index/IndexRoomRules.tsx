import React from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";
import { IndexParagraph, IndexSection, IndexTitle } from "./common";
import { useI18n } from "~/i18n/index";
import { SvgLock } from "~/assets/svg";

const intialStyle = { opacity: 0, transform: "skewY(0deg) translateY(0px)" };

const IndexRoomRulesLock: React.FC = () => {
  const [ref, inView] = useInView();

  const style = useSpring(
    inView
      ? { opacity: 1, transform: "skewY(-8deg) translateY(-10px)" }
      : intialStyle
  );

  return (
    <animated.div
      className="z-10 w-48 h-64 mx-1 bg-blue rounded-lg shadow-2xl flex flex-col flex-center p-1"
      style={style}
    >
      <SvgLock className="mb-4 w-10 h-10" />
      <input ref={ref} className="input p-0 w-24 text-center" type="password" />
    </animated.div>
  );
};

const IndexRoomRulesMembers: React.FC = () => {
  const [ref, inView] = useInView();

  const style = useSpring(
    inView
      ? { opacity: 1, transform: "skewY(8deg) translateY(10px)" }
      : intialStyle
  );

  return (
    <animated.div
      className="w-48 h-64 mt-10 mx-1 bg-blue rounded-lg shadow-2xl flex flex-col flex-center p-1"
      style={style}
    >
      <b className="mb-4" ref={ref}>
        Listeners
      </b>
      <div className="text-sm mb-2">
        thechosenone02{" "}
        <span className="text-xs p-0.5 rounded bg-white text-black">mod</span>
      </div>
      <div className="text-sm mb-2">
        goodboi{" "}
        <span className="text-xs p-0.5 rounded bg-white text-black">
          collab
        </span>
      </div>
      <div className="text-sm mb-2">
        <span className="text-danger-dark line-through">darthvader20</span>
      </div>
    </animated.div>
  );
};

const IndexRoomRules: React.FC = () => {
  const { t } = useI18n();
  return (
    <IndexSection>
      <div className="flex flex-col-reverse md:flex-row">
        <div className="relative w-screen overflow-x-hidden py-20 flex-1 md:w-0 flex justify-center">
          <IndexRoomRulesLock />
          <IndexRoomRulesMembers />
        </div>
        <div className="py-2 px-2 md:px-8 text-center md:text-left md:w-7/12">
          <IndexTitle>{t("intro.rules.title")}</IndexTitle>
          <IndexParagraph>{t("intro.rules.p1")}</IndexParagraph>
          <IndexParagraph>
            {t("intro.rules.p2")} <b>{t("intro.rules.p2Bold")}</b>.
          </IndexParagraph>
        </div>
      </div>
    </IndexSection>
  );
};

export default IndexRoomRules;
