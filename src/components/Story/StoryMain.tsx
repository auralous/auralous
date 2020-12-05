import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  usePlayer,
  PlayerEmbeddedControl,
  PlayerEmbeddedNotification,
} from "~/components/Player/index";
import { ShareDialog } from "~/components/Social/index";
import { useModal } from "~/components/Modal/index";
import { useCurrentUser } from "~/hooks/user";
import {
  Story,
  useStoryQuery,
  useStoryStateQuery,
  useOnStoryStateUpdatedSubscription,
  StoryState,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgShare, SvgSettings, SvgMessageSquare, SvgX } from "~/assets/svg";

const StoryQueue = dynamic(() => import("./StoryQueue"), { ssr: false });
const StoryChat = dynamic(() => import("./StoryChat"), { ssr: false });

const Navbar: React.FC<{
  story: Story;
  storyState: StoryState | null | undefined;
}> = ({ story }) => {
  const { t } = useI18n();

  const user = useCurrentUser();
  const [activeShare, openShare, closeShare] = useModal();

  return (
    <>
      <div className="nav px-2 overflow-hidden">
        <div className="flex flex-1 w-0 items-center justify-start h-full">
          <img
            alt={story.title}
            src={story.image}
            className="w-6 h-6 rounded-lg mr-2"
          />
          <h4 className="text-lg font-bold leading-tight truncate mr-2">
            {story.title}
          </h4>
        </div>
        <div className="flex items justify-end">
          <button onClick={openShare} className="btn p-2 mr-1">
            <SvgShare width="14" height="14" className="sm:mr-1" />
            <span className="text-sm sr-only sm:not-sr-only leading-none">
              {t("share.title")}
            </span>
          </button>
          {story.creatorId === user?.id && (
            <Link href={`/story/${story.id}/settings`}>
              <a className="btn p-2">
                <SvgSettings width="14" height="14" className="sm:mr-1" />
                <span className="text-sm sr-only sm:not-sr-only leading-none">
                  {t("story.settings.shortTitle")}
                </span>
              </a>
            </Link>
          )}
        </div>
      </div>
      <ShareDialog
        uri={`/story/${story.id}`}
        name={story.title}
        active={activeShare}
        close={closeShare}
      />
    </>
  );
};

const StoryContent: React.FC<{ story: Story; storyState: StoryState }> = ({
  story,
  storyState,
}) => {
  const { t } = useI18n();
  const { playStory } = usePlayer();
  useEffect(() => {
    playStory(story.id);
  }, [story, playStory]);

  const [expandedChat, setExpandedChat] = useState(false);

  return (
    <div className="w-full h-full lg:pr-96 relative">
      {/* Main */}
      <div className="w-full h-full flex flex-col relative overflow-hidden p-2">
        <div className="mb-1 bordered-box rounded-lg overflow-hidden">
          <PlayerEmbeddedControl storyId={story.id} />
        </div>
        <PlayerEmbeddedNotification />
        <div className="mt-1 bordered-box rounded-lg flex-1 overflow-hidden">
          <StoryQueue storyState={storyState} story={story} />
        </div>
      </div>
      {/* Chat */}
      <button
        aria-label={t("story.chat.title")}
        className="btn w-14 h-14 p-1 rounded-full border-2 border-background-tertiary fixed z-40 right-2 bottom-12 md:bottom-2 lg:hidden"
        onClick={() => setExpandedChat(!expandedChat)}
      >
        {expandedChat ? <SvgX /> : <SvgMessageSquare />}
      </button>
      <div
        id="story-chat"
        className={`absolute z-10 right-0 top-0 h-full w-full transform ${
          expandedChat ? "traslate-y-0" : "translate-y-full lg:translate-y-0"
        } lg:pb-0 lg:w-96 bg-blue bg-opacity-75 lg:bg-transparent backdrop-blur lg:backdrop-none transition-transform duration-500`}
      >
        <StoryChat story={story} storyState={storyState} />
      </div>
    </div>
  );
};

const StoryLoading: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  return (
    <div className="w-full h-full flex flex-col flex-center">
      <h1 className="text-2xl md:text-4xl font-black">{story.title}</h1>
      <p className="text-sm md:text-md text-foreground-secondary animate-pulse">
        {t("story.main.loading.text")}
      </p>
    </div>
  );
};

const StoryMain: React.FC<{ initialStory: Story }> = ({ initialStory }) => {
  const { t } = useI18n();
  // initialStory is the same as story, only might be a outdated version
  // so it can be used as backup
  const [{ data }] = useStoryQuery({
    variables: { id: initialStory.id as string },
  });
  const story = data?.story || initialStory;
  const [
    {
      data: { storyState } = { storyState: undefined },
      fetching: fetchingStoryState,
    },
  ] = useStoryStateQuery({
    variables: { id: story.id },
    pollInterval: 60 * 1000,
    requestPolicy: "cache-and-network",
  });

  useOnStoryStateUpdatedSubscription(
    {
      variables: { id: story.id || "" },
      pause: !storyState?.permission.viewable,
    },
    (prev, data) => data
  );

  return (
    <>
      <div className="h-screen-layout relative pt-12 overflow-hidden">
        <Navbar story={story} storyState={storyState} />
        {storyState ? (
          storyState.permission.viewable ? (
            <StoryContent story={story} storyState={storyState} />
          ) : (
            <p>{t("main.private.prompt")}</p>
          )
        ) : (
          fetchingStoryState && <StoryLoading story={story} />
        )}
      </div>
    </>
  );
};

export default StoryMain;
