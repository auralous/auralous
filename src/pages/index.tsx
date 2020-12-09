import React from "react";
import { NextSeo } from "next-seo";
import {
  IndexHero,
  IndexListen,
  IndexPlaylist,
  IndexStory,
  IndexEnd,
} from "~/components/Index";
import { useI18n } from "~/i18n/index";

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
