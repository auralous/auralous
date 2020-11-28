import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useI18n } from "~/i18n/index";

const NotFoundPage: NextPage = () => {
  const { t } = useI18n();

  return (
    <>
      <NextSeo noindex title={t("404.title")} />
      <div className="flex flex-col flex-center py-32">
        <h1 className="font-black text-9xl leading-none px-2">
          {t("404.title")}
        </h1>
        <p className="text-xl text-center text-foreground-tertiary py-2">
          {t("404.description")}
        </p>
        <Link href="/browse">
          <a className="btn btn-transparent text-sm">
            ← {t("common.backToHome")}
          </a>
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
