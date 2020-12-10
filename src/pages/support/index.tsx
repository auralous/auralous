import React from "react";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useCurrentUser } from "~/hooks/user";
import { useI18n } from "~/i18n/index";
import { SvgMail, SvgFacebook, SvgTwitter } from "~/assets/svg";
import { getPages as getSupportPages } from "~/lib/content-support";
import { SupportArticle } from "~/types/index";

const ContactLink: React.FC<{ href: string }> = ({ href, children }) => (
  <a
    className="btn btn-foreground rounded-full m-1 py-3 px-6"
    target="_blank"
    rel="noreferrer"
    href={href}
  >
    {children}
  </a>
);

const SupportPage: NextPage<{
  pages: SupportArticle[];
}> = ({ pages }) => {
  const user = useCurrentUser();
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("support.title")}
        openGraph={{}}
        canonical={`${process.env.APP_URI}/support`}
      />
      <div className="py-16 container leading-loose text-lg">
        <h1 className="text-center text-5xl text-foreground-secondary font-bold max-w-xl mx-auto leading-none">
          {t("support.hi")}{" "}
          {user ? (
            <>
              {" "}
              <span className="text-foreground">{user.username}</span>
            </>
          ) : (
            t("support.there")
          )}
          {t("support.how")}
        </h1>
        <div className="flex flex-col items-center py-10">
          <h2 className="text-3xl font-bold text-foreground-secondary">
            {t("support.articles.title")}
          </h2>
          {pages.map((page, index) => (
            <Link key={page.slug} href={`/support/${page.slug}`}>
              <a className="mb-2 flex items-center opacity-75 hover:opacity-100 transition-opacity">
                <span className="flex-none font-bold h-12 w-12 text-lg flex flex-center rounded-full bg-primary text-white">
                  {index + 1}
                </span>
                <h4 className="p-4 leading-snug">
                  <span className="text-2xl font-bold leading-none mb-1 block">
                    {page.title}
                  </span>
                  {page.subtitle}
                </h4>
              </a>
            </Link>
          ))}
        </div>
        <p className="text-sm text-foreground-tertiary text-center mt-10">
          {t("support.p")}
        </p>
        <div className="flex flex-wrap justify-center py-6">
          <ContactLink href="mailto:yo@withstereo.com">
            <SvgMail className="mx-2" />
            yo@withstereo.com
          </ContactLink>
          <ContactLink href="https://www.facebook.com/withstereo/">
            <SvgFacebook className="mx-2" />
            withstereo
          </ContactLink>
          <ContactLink href="https://twitter.com/withstereo_">
            <SvgTwitter className="mx-2" />
            withstereo_
          </ContactLink>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<{
  pages: SupportArticle[];
}> = async () => {
  const pages = getSupportPages();
  return { props: { pages } };
};

export default SupportPage;
