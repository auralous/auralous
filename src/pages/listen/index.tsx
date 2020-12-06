import React from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { SvgLogo } from "~/assets/svg";
import { useI18n } from "~/i18n/index";

const ListenPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("listen.title")}
        description={t("listen.description")}
      />
      <div className="w-full h-screen p-4 flex flex-col flex-center">
        <h1 className="font-black leading-none text-center mb-8">
          <span className="sr-only">{t("listen.title")}</span>
          <SvgLogo
            width="320"
            height="48"
            className="mx-auto fill-current max-w-full"
          />
        </h1>
        <div className="text-sm text-foreground-secondary mb-4 max-w-sm text-center">
          {t("listen.comingSoon")}
        </div>
        <Link href="/discover">
          <a className="btn btn-success">{t("discover.title")}</a>
        </Link>
      </div>
    </>
  );
};

export default ListenPage;
