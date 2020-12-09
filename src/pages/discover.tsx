import React from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useI18n } from "~/i18n/index";

const DiscoverPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo title={t("discover.title")} />
    </>
  );
};

export default DiscoverPage;
