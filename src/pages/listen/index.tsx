import { ListenContainer } from "containers/Listen";
import { useI18n } from "i18n/index";
import { NextPage } from "next";
import { NextSeo } from "next-seo";

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
      <ListenContainer />
    </>
  );
};

export default ListenPage;
