import React from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useI18n } from "~/i18n/index";

const DiscoverPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("discover.title")}
        description={t("discover.description")}
        openGraph={{}}
        canonical={`${process.env.APP_URI}/discover`}
      />
    </>
  );
};

export default DiscoverPage;
