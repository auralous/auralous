import { SvgChevronLeft } from "assets/svg";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { useI18n } from "i18n/index";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import React from "react";

const NotFoundPage: NextPage = () => {
  const { t } = useI18n();

  return (
    <>
      <NextSeo noindex title={t("404.title")} openGraph={{}} />
      <div className="flex flex-col flex-center w-full h-full fixed inset-0 z-20 bg-background p-2">
        <Typography.Title>{t("404.title")}</Typography.Title>
        <Typography.Paragraph
          size="xl"
          align="center"
          color="foreground-tertiary"
        >
          {t("404.description")}
        </Typography.Paragraph>
        <Link href="/">
          <Button icon={<SvgChevronLeft />} title={t("common.back")} />
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
