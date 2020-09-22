import React from "react";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";
import markdownToHtml from "~/lib/markdown-to-html";

const PrivacyPage: NextPage<{ __html: string }> = ({ __html }) => (
  <>
    <NextSeo
      title="Privacy Policy"
      description="Here on Stereo, you share your music, not your data. Learn more about our privacy policy."
    />
    <div className="py-12 mt-20 px-2">
      <div className="text-center container">
        <h1 className="text-5xl leading-none font-bold">Privacy Policy</h1>
      </div>
    </div>
    <div className="py-20 leading-loose container">
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
        <p className="text-center mt-2">
          <Link href="/explore">
            <a className="text-sm button bg-transparent text-foreground hover:text-foreground-secondary">
              ← Back to home
            </a>
          </Link>
        </p>
      </div>
    </div>
  </>
);

export default PrivacyPage;

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "src", "content", "privacy.md");
  const md = fs.readFileSync(filePath, "utf8");
  const __html = (await markdownToHtml(md)).toString();
  return { props: { __html } };
};
