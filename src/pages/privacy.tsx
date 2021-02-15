import { Typography } from "components/Typography";
import fs from "fs";
import { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import path from "path";
import markdownToHtml from "utils/markdown-to-html";

const PrivacyPage: NextPage<{ __html: string }> = ({ __html }) => {
  return (
    <>
      <NextSeo
        title="Privacy Policy"
        description="Here on Stereo, you share your music, not your data. Learn more about our privacy policy."
        openGraph={{}}
        canonical={`${process.env.APP_URI}/privacy`}
      />
      <Typography.Title align="center">Privacy Policy</Typography.Title>
      <div className="py-20 px-2 leading-loose max-w-xl mx-auto">
        <div className="content text-lg">
          <div dangerouslySetInnerHTML={{ __html }} />
          <Typography.Paragraph color="foreground-tertiary" size="sm">
            Adapted from the{" "}
            <Typography.Link
              href="https://github.com/basecamp/policies"
              target="_blank"
            >
              Basecamp open-source policies
            </Typography.Link>{" "}
            / CC BY 4.0
          </Typography.Paragraph>
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
