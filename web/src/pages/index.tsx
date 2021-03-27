import { IndexContainer } from "containers/Index";
import { useI18n } from "i18n/index";
import { NextSeo } from "next-seo";

const IndexPage: React.FC = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title="Auralous"
        titleTemplate={`%s · ${t("motto")}`}
        description={t("description")}
        canonical={`${process.env.APP_URI}`}
        openGraph={{}}
      />
      <IndexContainer />
    </>
  );
};

export default IndexPage;
