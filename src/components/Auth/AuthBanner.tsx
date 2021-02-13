import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { useI18n } from "i18n/index";
import React from "react";
import { useLogin } from "./LogIn";

const AuthBanner: React.FC<{ prompt: string; hook?: string }> = ({
  prompt,
  hook,
}) => {
  const { t } = useI18n();
  const [, openLogin] = useLogin();

  return (
    <div className="flex flex-col items-center px-4 py-8 w-full max-w-2xl mx-auto">
      <Typography.Title level={4} align="center">
        {prompt}
      </Typography.Title>
      <Typography.Paragraph size="sm" align="center">
        {hook || t("auth.hookDefault")}
      </Typography.Paragraph>
      <Button onPress={openLogin} title={t("auth.action")} />
    </div>
  );
};

export default AuthBanner;
