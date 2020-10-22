import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useCurrentUser } from "~/hooks/user";
import { SvgMail, SvgFacebook, SvgTwitter } from "~/assets/svg";

const ContactPage: NextPage = () => {
  const user = useCurrentUser();
  return (
    <>
      <NextSeo
        title="Contact us"
        description="The team behind Stereo would love to hear about your feedbacks and questions."
      />
      <div className="py-16 mt-20 containerleading-loose text-lg">
        <h1 className="text-center text-5xl text-foreground-secondary font-bold max-w-xl mx-auto leading-none">
          Hi{" "}
          {user ? (
            <span className="text-foreground">{user.username}</span>
          ) : (
            "there"
          )}
          ,<br />
          how can we help?
        </h1>
        <div className="flex flex-wrap justify-center my-10">
          <a
            className="button button-foreground rounded-full m-1 py-4 px-8"
            href="mailto:yo@withstereo.com"
          >
            <SvgMail className="mx-2" />
            yo@withstereo.com
          </a>
          <a
            className="button button-foreground rounded-full m-1 py-4 px-8"
            target="_blank"
            rel="noreferrer"
            href="https://www.facebook.com/withstereo/"
          >
            <SvgFacebook className="mx-2" />
            withstereo
          </a>
          <a
            className="button button-foreground rounded-full m-1 py-4 px-8"
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/withstereo_"
          >
            <SvgTwitter className="mx-2" />
            withstereo_
          </a>
        </div>
        <p className="text-sm opacity-75 text-center mb-4">
          Be sure to reach out at any time should you have any ideas, questions,
          or encounter any nasty bugs.
        </p>
        <p className="text-center">
          <Link href="/browse">
            <a className="text-sm button bg-transparent hover:text-foreground-secondary">
              ← Back to home
            </a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default ContactPage;
