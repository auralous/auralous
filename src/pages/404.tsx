import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useI18n } from "~/i18n/index";

const NotFoundPage: NextPage = () => {
  const { t } = useI18n();

  return (
    <>
      <NextSeo noindex title={t("404.title")} openGraph={{}} />
      <div className="flex flex-col flex-center w-full h-full fixed inset-0 z-20 bg-background p-2">
        <h1 className="font-black text-9xl leading-none">{t("404.title")}</h1>
        <p className="text-xl text-center text-foreground-tertiary py-2 mb-4">
          {t("404.description")}
        </p>
        <Link href="/">
          <a className="py-3 px-6 font-bold border-2 border-foreground-secondary  hover:border-foreground rounded-lg text-sm">
            ← {t("common.back")}
          </a>
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
