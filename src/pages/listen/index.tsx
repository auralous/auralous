import React from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import ListenMain from "~/components/Listen/ListenMain";
import { useI18n } from "~/i18n/index";

const ListenPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("listen.title")}
        description={t("listen.description")}
      />
      <h1>
        <span className="sr-only">{t("listen.title")}</span>
      </h1>
      <ListenMain />
    </>
  );
};

export default ListenPage;
