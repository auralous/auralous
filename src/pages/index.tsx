import {
  IndexEnd,
  IndexHero,
  IndexListen,
  IndexPlaylist,
  IndexStory,
} from "components/Index";
import { useI18n } from "i18n/index";
import { NextSeo } from "next-seo";

const IndexPage: React.FC = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title="Stereo"
        titleTemplate={`%s · ${t("motto")}`}
        description={t("description")}
        canonical={`${process.env.APP_URI}`}
        openGraph={{}}
      />
      <IndexHero />
      <IndexListen />
      <IndexPlaylist />
      <IndexStory />
      <IndexEnd />
    </>
  );
};

export default IndexPage;
