import React from "react";
import Link from "next/link";
import { animated } from "react-spring";
import { useI18n } from "~/i18n/index";
import { useFadeInOnScroll } from "./common";

const IndexEnd: React.FC = () => {
  const { t } = useI18n();

  const [ref, style] = useFadeInOnScroll();

  return (
    <div className="flex justify-center">
      <Link href="/listen">
        <animated.a
          className="btn bg-gradient-to-l from-warning to-pink py-8 px-16 rounded-full transform hover:scale-110 transition-transform duration-500"
          style={style}
          ref={ref}
        >
          <span className="text-xl sm:text-3xl font-black text-white transition duration-500">
            {t("common.startListening")}
          </span>
        </animated.a>
      </Link>
    </div>
  );
};

export default IndexEnd;
