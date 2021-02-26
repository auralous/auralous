import { SvgLogo } from "assets/svg";
import { Button } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useI18n } from "i18n";
import Link from "next/link";

const IndexContainer: React.FC = () => {
  const { t } = useI18n();
  return (
    <Box alignItems="center" padding={4}>
      <Typography.Title>
        <SvgLogo className="w-64 h-16 fill-current max-w-full" />
      </Typography.Title>
      <Typography.Title level={2} color="primary-dark" align="center">
        {t("motto")}
      </Typography.Title>
      <Spacer axis="vertical" size={4} />
      <Box maxWidth="xl">
        <Typography.Paragraph color="foreground-tertiary" align="center">
          {t("description")}
        </Typography.Paragraph>
      </Box>
      <Spacer axis="vertical" size={8} />
      <Box style={{ width: 240 }}>
        <Link href="/listen">
          <Button
            color="primary"
            title="Use Web App"
            size="xl"
            shape="circle"
            fullWidth
          />
        </Link>
      </Box>
    </Box>
  );
};

export default IndexContainer;
