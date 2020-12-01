import React from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import NewMain from "~/components/New/index";
import { useI18n } from "~/i18n/index";

const NewPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo title={t("new.title")} noindex />
      <NewMain />
    </>
  );
};

export default NewPage;
