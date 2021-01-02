import React from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import NotificationMain from "~/components/Notification/NotificationMain";
import { useI18n } from "~/i18n/index";

const NotificationPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo noindex title={t("notification.title")} />
      <NotificationMain />
    </>
  );
};

export default NotificationPage;
