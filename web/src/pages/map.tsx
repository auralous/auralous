import { LoadingFullpage } from "components/Loading";
import { useI18n } from "i18n/index";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("containers/Map/MapContainer"), {
  ssr: false,
  loading: LoadingFullpage,
});

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
