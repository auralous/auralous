import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import StoryMain from "~/components/Story/StoryMain";
import NotFoundPage from "../../404";
import { forwardSSRHeaders } from "~/lib/ssr-utils";
import { Story } from "~/graphql/gql.gen";
import { QUERY_STORY } from "~/graphql/story";
import { CONFIG } from "~/lib/constants";

const StoryPage: NextPage<{
  story: Story | null;
}> = ({ story }) => {
  if (!story) return <NotFoundPage />;
  return (
    <>
      <NextSeo
        title={story.text}
        description={story.text}
        canonical={`${process.env.APP_URI}/story/${story.id}`}
        openGraph={{
          images: [
            {
              url: story.image,
              alt: story.text,
            },
          ],
        }}
        noindex={!story.isPublic}
      />
      <StoryMain initialStory={story} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  story: Story | null;
}> = async ({ params, req, res }) => {
  const result = await fetch(
    `${process.env.API_URI}/graphql?query=${QUERY_STORY.replace(
      /([\s,]|#[^\n\r]+)+/g,
      " "
    ).trim()}&variables=${JSON.stringify({ id: params?.storyId })}`,
    { headers: forwardSSRHeaders(req) }
  ).then((response) => response.json());
  const story = result.data?.story || null;
  if (!story) res.statusCode = 404;
  else {
    story.createdAt = JSON.stringify(story.createdAt);
    res.setHeader("cache-control", `public, max-age=${CONFIG.storyMaxAge}`);
  }
  return { props: { story } };
};

export default StoryPage;
