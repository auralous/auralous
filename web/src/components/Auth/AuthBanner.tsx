import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useI18n } from "i18n/index";
import { useLogin } from "./LogIn";

const AuthBanner: React.FC<{ prompt: string; hook?: string }> = ({
  prompt,
  hook,
}) => {
  const { t } = useI18n();
  const [, openLogin] = useLogin();

  return (
    <Box
      alignItems="center"
      paddingX="md"
      paddingY="xl"
      fullWidth
      maxWidth="2xl"
    >
      <Typography.Title level={4} align="center">
        {prompt}
      </Typography.Title>
      <Typography.Paragraph size="sm" align="center">
        {hook || t("auth.hookDefault")}
      </Typography.Paragraph>
      <Button shape="circle" onPress={openLogin} title={t("auth.action")} />
    </Box>
  );
};

export default AuthBanner;
