import React from "react";
import { useI18n } from "~/i18n/index";
import { useLogin } from "./LogIn";

const AuthBanner: React.FC<{ prompt: string; hook?: string }> = ({
  prompt,
  hook,
}) => {
  const { t } = useI18n();
  const [, openLogin] = useLogin();

  return (
    <div className="flex flex-col items-center px-4 py-8 w-full max-w-2xl mx-auto">
      <p className="font-bold text-center mb-2">{prompt}</p>
      <p className="text-foreground-secondary text-sm mb-4 text-center">
        {hook || t("auth.hookDefault")}
      </p>
      <button onClick={openLogin} className="button w-128 max-w-full">
        {t("auth.action")}
      </button>
    </div>
  );
};

export default AuthBanner;
