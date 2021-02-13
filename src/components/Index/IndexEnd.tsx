import { useI18n } from "i18n/index";
import Link from "next/link";
import React from "react";
import { animated } from "react-spring";
import { useFadeInOnScroll } from "./common";

const IndexEnd: React.FC = () => {
  const { t } = useI18n();

  const [ref, style] = useFadeInOnScroll();

  return (
    <div className="flex justify-center">
      <animated.span style={style}>
        <Link href="/listen">
          <a
            className="btn bg-gradient-to-l from-secondary to-primary py-8 px-16 rounded-full transform hover:scale-110 transition-transform duration-500"
            ref={ref}
          >
            <span className="text-3xl font-black text-white transition duration-500">
              {t("common.startListening")}
            </span>
          </a>
        </Link>
      </animated.span>
    </div>
  );
};

export default IndexEnd;
