import NotificationMain from "components/Notification/NotificationMain";
import { useI18n } from "i18n/index";
import { NextPage } from "next";
import { NextSeo } from "next-seo";

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
