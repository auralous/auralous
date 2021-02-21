import { SettingsContainer } from "containers/Settings";
import { useI18n } from "i18n/index";
import { NextPage } from "next";
import { NextSeo } from "next-seo";

const SettingsPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("settings.title")}
        noindex
        openGraph={{}}
        canonical={`${process.env.APP_URI}/settings`}
      />
      <SettingsContainer />
    </>
  );
};

export default SettingsPage;
