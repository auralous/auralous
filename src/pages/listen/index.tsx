import ListenMain from "components/Listen/ListenMain";
import { useI18n } from "i18n/index";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import React from "react";

const ListenPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("listen.title")}
        description={t("listen.description")}
        openGraph={{}}
        canonical={`${process.env.APP_URI}/listen`}
      />
      <ListenMain />
    </>
  );
};

export default ListenPage;
