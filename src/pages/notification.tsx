import React from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useI18n } from "~/i18n/index";

const NotificationPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo noindex title={t("notification.title")} />
      <h1 className="px-4 pt-6 pb-2 font-bold text-4xl mb-2">
        {t("notification.title")}
      </h1>
    </>
  );
};

export default NotificationPage;
