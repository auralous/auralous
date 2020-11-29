import React from "react";
import { useRouter } from "next/router";
import { animated } from "react-spring";
import { useLogin } from "~/components/Auth";
import { useI18n } from "~/i18n/index";
import { useCurrentUser } from "~/hooks/user";
import { useFadeInOnScroll } from "./common";

const IndexEnd: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const [, logIn] = useLogin();

  const user = useCurrentUser();

  const onClick = async () => {
    await router.push("/listen");
    if (!user) logIn();
  };

  const [ref, style] = useFadeInOnScroll();

  return (
    <div className="flex justify-center">
      <animated.button
        className="btn bg-gradient-to-l from-warning to-pink py-8 px-12 rounded-full transform hover:scale-110 transition-transform duration-500"
        onClick={onClick}
        style={style}
        ref={ref}
      >
        <span className="text-xl sm:text-3xl font-black text-white transition duration-500">
          {t("common.startListening")}
        </span>
      </animated.button>
    </div>
  );
};

export default IndexEnd;
