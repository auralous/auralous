import React from "react";
import { useRouter } from "next/router";
import { useLogin } from "~/components/Auth";
import { useI18n } from "~/i18n/index";
import { useCurrentUser } from "~/hooks/user";

const IndexEnd: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const [, logIn] = useLogin();

  const user = useCurrentUser();

  const onClick = async () => {
    await router.push("/listen-now");
    if (!user) logIn();
  };

  return (
    <div className="flex justify-center">
      <button
        className="btn bg-gradient-to-l from-warning to-pink py-8 px-12 rounded-full transform hover:scale-110 transition-transform duration-500"
        onClick={onClick}
      >
        <span className="text-xl sm:text-3xl font-black text-white transition duration-500">
          {t("common.startListening")}
        </span>
      </button>
    </div>
  );
};

export default IndexEnd;
