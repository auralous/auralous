import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import markdownToHtml from "~/lib/markdown-to-html";
import {
  getPage as getSuportPage,
  getPages as getSupportPages,
} from "~/lib/content-support";
import { SupportArticle } from "~/types/index";
import { useI18n } from "~/i18n/index";

const SupportPageArticle: NextPage<{ page: SupportArticle }> = ({ page }) => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo title={`${page.title} - ${page.subtitle}`} />
      <div className="py-12 px-2">
        <div className="text-center container">
          <h1 className="font-bold">
            <span className="block text-5xl leading-none mb-2">
              {page.title}
            </span>
            <span className="text-lg leading-none">{page.subtitle}</span>
          </h1>
        </div>
      </div>
      <div className="py-20 px-2 leading-loose max-w-2xl mx-auto">
        <div className="content content-support text-lg">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
          <p className="text-center mt-2">
            <Link href="/browse">
              <a className="text-sm button button-transparent">
                ← {t("common.backToHome")}
              </a>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SupportPageArticle;

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = getSupportPages();
  return {
    paths: pages.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  { page: SupportArticle },
  { slug: string }
> = async ({ params }) => {
  const page = getSuportPage(params?.slug || "");
  page.content = await (await markdownToHtml(page.content)).toString();
  return { props: { page } };
};
