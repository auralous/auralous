import { NewContainer } from "containers/New";
import { useI18n } from "i18n/index";
import { NextPage } from "next";
import { NextSeo } from "next-seo";

const NewPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("new.title")}
        noindex
        openGraph={{}}
        canonical={`${process.env.APP_URI}/new`}
      />
      <NewContainer />
    </>
  );
};

export default NewPage;
