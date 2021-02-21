import { MapContainer } from "containers/Map";
import { useI18n } from "i18n/index";
import { NextPage } from "next";
import { NextSeo } from "next-seo";

const MapPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("map.title")}
        description={t("map.description")}
        openGraph={{}}
        canonical={`${process.env.APP_URI}/map`}
      />
      <MapContainer />
    </>
  );
};

export default MapPage;
