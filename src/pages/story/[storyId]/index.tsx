import React, { useMemo } from "react";
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
  const initialStory = useMemo<Story | null>(() => {
    if (!story) return null;
    // FIXME: Sometimes createdAt is Invalid Date
    return {
      ...story,
      createdAt: new Date(story.createdAt),
    };
  }, [story]);

  if (!initialStory) return <NotFoundPage />;

  return (
    <>
      <NextSeo
        title={initialStory.text}
        description={initialStory.text}
        canonical={`${process.env.APP_URI}/story/${initialStory.id}`}
        openGraph={{
          images: [
            {
              url: initialStory.image,
              alt: initialStory.text,
            },
          ],
        }}
        noindex={!initialStory.isPublic}
      />
      <StoryMain initialStory={initialStory} />
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
  const story: Story | null = result.data?.story || null;
  if (!story) res.statusCode = 404;
  else {
    if (story.isPublic)
      res.setHeader("cache-control", `public, max-age=${CONFIG.storyMaxAge}`);
  }
  return { props: { story } };
};

export default StoryPage;
