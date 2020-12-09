import React from "react";
import { GetStaticProps, NextPage } from "next";
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";
import markdownToHtml from "~/lib/markdown-to-html";

const PrivacyPage: NextPage<{ __html: string }> = ({ __html }) => {
  return (
    <>
      <NextSeo
        title="Privacy Policy"
        description="Here on Stereo, you share your music, not your data. Learn more about our privacy policy."
        openGraph={{}}
        canonical={`${process.env.APP_URI}/privacy`}
      />
      <div className="py-12 px-2">
        <div className="text-center">
          <h1 className="text-5xl leading-none font-bold">Privacy Policy</h1>
        </div>
      </div>
      <div className="py-20 px-2 leading-loose max-w-xl mx-auto">
        <div className="content text-lg">
          <div dangerouslySetInnerHTML={{ __html }} />
          <small className="text-foreground-tertiary">
            Adapted from the{" "}
            <a
              href="https://github.com/basecamp/policies"
              target="_blank"
              rel="noopener noreferrer"
            >
              Basecamp open-source policies
            </a>{" "}
            / CC BY 4.0
          </small>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "src", "content", "privacy.md");
  const md = fs.readFileSync(filePath, "utf8");
  const __html = (await markdownToHtml(md)).toString();
  return { props: { __html } };
};
