import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useCurrentUser } from "~/hooks/user";
import { useI18n } from "../i18n/index";
import { SvgMail, SvgFacebook, SvgTwitter } from "~/assets/svg";

const ContactLink: React.FC<{ href: string }> = ({ href, children }) => (
  <a
    className="button button-foreground rounded-full m-1 py-4 px-8"
    target="_blank"
    rel="noreferrer"
    href={href}
  >
    {children}
  </a>
);

const ContactPage: NextPage = () => {
  const user = useCurrentUser();
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("contact.title")}
        description="The team behind Stereo would love to hear about your feedbacks and questions."
      />
      <div className="py-16 containerleading-loose text-lg">
        <h1 className="text-center text-5xl text-foreground-secondary font-bold max-w-xl mx-auto leading-none">
          {t("contact.hi")}{" "}
          {user ? (
            <span className="text-foreground">{user.username}</span>
          ) : (
            t("contact.there")
          )}{" "}
          {t("contact.how")}
        </h1>
        <div className="flex flex-wrap justify-center my-10">
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
        <p className="text-sm opacity-75 text-center mb-4">{t("contact.p")}</p>
        <p className="text-center">
          <Link href="/browse">
            <a className="text-sm button bg-transparent hover:text-foreground-secondary">
              ← {t("common.backToHome")}
            </a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default ContactPage;
