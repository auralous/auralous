import { SvgFacebook, SvgMail, SvgTwitter } from "assets/svg";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import React from "react";
import {
  getPages as getSupportPages,
  SupportArticle,
} from "utils/content-support";

const SupportPage: NextPage<{
  pages: SupportArticle[];
}> = ({ pages }) => {
  const me = useMe();
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("support.title")}
        openGraph={{}}
        canonical={`${process.env.APP_URI}/support`}
      />
      <div className="py-16 container leading-loose text-lg">
        <div className="max-w-xl mx-auto">
          <Typography.Title align="center">
            {t("support.hi")}{" "}
            {me ? (
              <Typography.Text color="primary">
                {me.user.username}
              </Typography.Text>
            ) : (
              t("support.there")
            )}
            {t("support.how")}
          </Typography.Title>
        </div>
        <div className="flex flex-col items-center py-10 space-y-2">
          <Typography.Title level={2} size="xl" color="foreground-secondary">
            {t("support.articles.title")}
          </Typography.Title>
          {pages.map((page, index) => (
            <Link key={page.slug} href={`/support/${page.slug}`}>
              <a className="flex items-center opacity-75 hover:opacity-100 transition-opacity">
                <span className="mr-2 flex-none font-bold h-12 w-12 text-lg flex flex-center rounded-full bg-primary text-white">
                  {index + 1}
                </span>
                <Typography.Title level={4} size="md" strong={false}>
                  <Typography.Text size="2xl" strong>
                    {page.title}
                  </Typography.Text>
                  <div className="mb-2" />
                  <Typography.Text>{page.subtitle}</Typography.Text>
                </Typography.Title>
              </a>
            </Link>
          ))}
        </div>
        <Typography.Paragraph
          size="sm"
          color="foreground-tertiary"
          align="center"
          paragraph={false}
        >
          {t("support.p")}
        </Typography.Paragraph>
        <div className="flex flex-wrap justify-center py-6 space-x-2">
          <Button
            icon={<SvgMail />}
            title="yo@withstereo.com"
            asLink="mailto:yo@withstereo.com"
            shape="circle"
          />
          <Button
            icon={<SvgFacebook />}
            title="withstereo"
            asLink="https://www.facebook.com/withstereo/"
            shape="circle"
          />
          <Button
            icon={<SvgTwitter />}
            title="withstereo_"
            asLink="https://twitter.com/withstereo_"
            shape="circle"
          />
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
