import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {
  StorySettingsMember,
  StorySettingsBasic,
  StorySettingsRules,
} from "~/components/Story/StorySettings";
import { useCurrentUser } from "~/hooks/user";
import {
  useOnStoryStateUpdatedSubscription,
  useStoryQuery,
  useStoryStateQuery,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import Link from "next/link";
import { SvgChevronLeft } from "~/assets/svg";

const StorySettingsSectionTitle: React.FC = ({ children }) => (
  <h2 className="text-2xl mb-4 p-2 pl-4 bg-background-secondary border-l-4 font-bold">
    {children}
  </h2>
);

const StorySettingsPage: NextPage = () => {
  const { t } = useI18n();
  const user = useCurrentUser();
  const router = useRouter();
  const storyId = router.query.storyId as string | undefined;
  const [{ data: { story } = { story: undefined }, fetching }] = useStoryQuery({
    variables: { id: storyId || "" },
    pause: !storyId,
  });
  const [
    {
      data: { storyState } = { storyState: undefined },
      fetching: fetchingState,
    },
  ] = useStoryStateQuery({
    variables: { id: story?.id || "" },
    pause: !story,
  });
  useOnStoryStateUpdatedSubscription({
    variables: { id: story?.id || "" },
    pause: !story,
  });
  if (fetching || fetchingState) return <div />;
  if (!storyState || !story) return <div />;
  if (story.creatorId !== user?.id) return <div />;

  return (
    <>
      <NextSeo title={t("story.settings.title")} noindex />
      <div className="container relative">
        <div className="sticky z-20 top-0 left-0 w-full px-4 pt-6 pb-2 flex items-center mb-2 bg-gradient-to-b from-blue to-transparent">
          <Link href={`/story/${storyId}`}>
            <a className="btn p-1 mr-2" title={t("story.settings.backToStory")}>
              <SvgChevronLeft className="h-8 w-8" />
            </a>
          </Link>
          <h1 className="font-bold flex-1 w-0 truncate text-4xl leading-tight">
            {t("story.settings.title")}
          </h1>
        </div>
        <section className="p-4">
          <StorySettingsSectionTitle>
            {t("story.settings.titleInfo")}
          </StorySettingsSectionTitle>
          <StorySettingsBasic story={story} />
        </section>
        <section className="p-4">
          <StorySettingsSectionTitle>
            {t("story.settings.titleRules")}
          </StorySettingsSectionTitle>
          <StorySettingsRules story={story} storyState={storyState} />
        </section>
        <section className="p-4">
          <StorySettingsSectionTitle>
            {t("story.settings.titleMembers")}
          </StorySettingsSectionTitle>
          <StorySettingsMember story={story} storyState={storyState} />
        </section>
      </div>
    </>
  );
};

export default StorySettingsPage;
