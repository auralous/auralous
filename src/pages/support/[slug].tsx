import { Typography } from "components/Typography";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  getPage as getSuportPage,
  getPages as getSupportPages,
  SupportArticle,
} from "utils/content-support";
import markdownToHtml from "utils/markdown-to-html";

const SupportPageArticle: NextPage<{ page: SupportArticle }> = ({ page }) => {
  return (
    <>
      <NextSeo
        title={`${page.title} - ${page.subtitle}`}
        openGraph={{}}
        canonical={`${process.env.APP_URI}/support/${page.slug}`}
      />
      <div className="py-12 px-2">
        <Typography.Title align="center" size="4xl">
          {page.title}
        </Typography.Title>
        <Typography.Paragraph align="center" size="lg">
          {page.subtitle}
        </Typography.Paragraph>
      </div>
      <div className="py-20 px-2 leading-loose max-w-2xl mx-auto">
        <div className="content content-support text-lg">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
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
