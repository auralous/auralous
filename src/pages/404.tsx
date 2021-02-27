import { SvgChevronLeft } from "assets/svg";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useI18n } from "i18n/index";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";

const NotFoundPage: NextPage = () => {
  const { t } = useI18n();

  return (
    <>
      <NextSeo noindex title={t("404.title")} openGraph={{}} />
      <Box
        justifyContent="center"
        alignItems="center"
        fullHeight
        fullWidth
        top={0}
        left={0}
        style={{ position: "fixed", zIndex: 20 }}
        padding="sm"
        backgroundColor="background"
      >
        <Typography.Title>{t("404.title")}</Typography.Title>
        <Typography.Paragraph
          size="xl"
          align="center"
          color="foregroundTertiary"
        >
          {t("404.description")}
        </Typography.Paragraph>
        <Link href="/">
          <Button icon={<SvgChevronLeft />} title={t("common.back")} />
        </Link>
      </Box>
    </>
  );
};

export default NotFoundPage;
