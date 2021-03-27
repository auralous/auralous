import { LoadingFullpage } from "components/Loading";
import { Story } from "gql/gql.gen";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { CONFIG } from "utils/constants";
import { forwardSSRHeaders } from "utils/ssr-utils";

const StoryContainer = dynamic(
  () => import("containers/Story/StoryContainer"),
  { ssr: false, loading: LoadingFullpage }
);

const StoryPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ story }) => {
  const initialStory = useMemo<Story>(() => {
    // FIXME: Sometimes createdAt is Invalid Date
    return {
      ...story,
      createdAt: new Date(story.createdAt),
    };
  }, [story]);

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
      <StoryContainer initialStory={initialStory} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  story: Story;
}> = async ({ params, req, res }) => {
  const result = await fetch(
    `${process.env.API_URI}/graphql` +
      `?query=query story($id: ID!) { story(id: "${params?.storyId}") { id text image createdAt isPublic isLive creatorId queueable } }` +
      `&variables=${JSON.stringify({ id: params?.storyId })}`,
    { headers: forwardSSRHeaders(req) }
  ).then((response) => response.json());
  const story: Story | null = result.data?.story || null;
  if (!story) return { notFound: true };
  else {
    if (story.isPublic)
      res.setHeader("cache-control", `public, max-age=${CONFIG.storyMaxAge}`);
  }
  return { props: { story } };
};

export default StoryPage;
