import React from "react";
import { Messenger } from "~/components/Message/index";
import {
  Story,
  useStoryUsersQuery,
  useOnStoryUsersUpdatedSubscription,
} from "~/graphql/gql.gen";
import { useMe } from "~/hooks/user";
import { AuthBanner } from "~/components/Auth";
import StoryListeners from "./StoryListeners";
import { useModal } from "~/components/Modal";
import { useI18n } from "~/i18n/index";
import { SvgShare2 } from "~/assets/svg";
import StoryShare from "./StoryShare";

const StoryUsers: React.FC<{ story: Story; userIds: string[] }> = ({
  story,
  userIds,
}) => {
  const { t } = useI18n();
  const [active, open, close] = useModal();

  return (
    <>
      <div className="px-4 py-1 flex">
        <button
          className="btn btn-primary mr-1 flex-none overflow-hidden inline-flex w-8 h-8 rounded-full p-0"
          title={t("story.share.title")}
          onClick={open}
        >
          <SvgShare2 className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <StoryListeners userIds={userIds} />
        </div>
      </div>
      <StoryShare active={active} close={close} story={story} />
    </>
  );
};

const StoryChat: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const me = useMe();

  // get current users in story
  const [
    { data: { storyUsers } = { storyUsers: undefined } },
  ] = useStoryUsersQuery({
    variables: { id: story.id },
    pollInterval: 60 * 1000,
    requestPolicy: "cache-and-network",
    pause: !me || !story.isLive,
  });

  useOnStoryUsersUpdatedSubscription(
    { variables: { id: story.id || "" }, pause: !storyUsers || !story.isLive },
    (prev, data) => data
  );

  if (!me)
    return (
      <div className="h-full flex flex-center">
        <AuthBanner
          prompt={t("story.chat.authPrompt")}
          hook={t("story.chat.authPromptHook")}
        />
      </div>
    );

  return (
    <div className="h-full flex flex-col">
      {story.isLive && <StoryUsers userIds={storyUsers || []} story={story} />}
      <div className="flex-1 h-0">
        <Messenger id={`story:${story.id}`} />
      </div>
    </div>
  );
};

export default StoryChat;
