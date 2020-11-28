import React from "react";
import { NextSeo } from "next-seo";
import { IndexListen, IndexPlaylist, IndexRoomRules } from "~/components/Index";
import { useI18n } from "~/i18n/index";
import IndexHero from "~/components/Index/IndexHero";

const IndexPage: React.FC = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title="Stereo"
        titleTemplate={`%s · ${t("motto")}`}
        description={t("description")}
        canonical={`${process.env.APP_URI}/`}
      />
      <div className="px-4 flex flex-col items-center">
        <IndexHero />
        <IndexListen />
        <IndexPlaylist />
        <IndexRoomRules />
      </div>
    </>
  );
};

export default IndexPage;
