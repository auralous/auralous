import React from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { StoryItem } from "~/components/Story";
import { useExploreStoriesQuery, useStoriesQuery } from "~/graphql/gql.gen";
import { useCurrentUser } from "~/hooks/user";
import { useI18n } from "~/i18n/index";

const RandomStorySection: React.FC = () => {
  const [
    { data: { exploreStories } = { exploreStories: undefined } },
  ] = useExploreStoriesQuery({
    variables: { by: "random" },
  });

  return (
    <div className="flex flex-wrap pb-12">
      {exploreStories?.map((story) => (
        <div
          key={story.id}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
        >
          <StoryItem story={story} />
        </div>
      ))}
    </div>
  );
};

const MyStoriesSection: React.FC = () => {
  const user = useCurrentUser();
  const [{ data: { stories } = { stories: undefined } }] = useStoriesQuery({
    variables: { creatorId: user?.id || "" },
    pause: !user,
  });
  return (
    <>
      <div>
        <div className="flex flex-wrap pb-12">
          {stories?.map((story) => (
            <div
              key={story.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
            >
              <StoryItem key={story.id} story={story} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const StorySection: React.FC = () => {
  const { t } = useI18n();
  return (
    <Tabs className="h-full flex flex-col">
      {({ selectedIndex }) => {
        const getClassName = (index: number) =>
          `font-bold mx-1 px-2 py-1 ${
            index === selectedIndex
              ? "opacity-100"
              : "opacity-25 hover:opacity-50 focus:opacity-50"
          } transition-opacity`;
        return (
          <>
            <TabList className="flex-none flex mb-2 justify-center">
              <Tab className={getClassName(0)}>{t("discover.titleRandom")}</Tab>
              <Tab className={getClassName(1)}>{t("discover.titleMy")}</Tab>
            </TabList>
            <TabPanels className="flex-1 overflow-hidden">
              <TabPanel>
                <RandomStorySection />
              </TabPanel>
              <TabPanel>
                <MyStoriesSection />
              </TabPanel>
            </TabPanels>
          </>
        );
      }}
    </Tabs>
  );
};

const DiscoverPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo title={t("discover.title")} />
      <StorySection />
    </>
  );
};

export default DiscoverPage;
