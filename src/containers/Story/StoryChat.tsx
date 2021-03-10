import { AuthBanner } from "components/Auth";
import { Messenger } from "components/Message/index";
import { Box } from "components/View";
import {
  Story,
  useOnStoryUsersUpdatedSubscription,
  useStoryUsersQuery,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import { useEffect } from "react";

const StoryChat: React.FC<{ story: Story; inactive?: boolean }> = ({
  story,
  inactive,
}) => {
  const { t } = useI18n();
  const me = useMe();

  // get current users in story
  const [
    { data: { storyUsers } = { storyUsers: undefined } },
    fetchStoryUsers,
  ] = useStoryUsersQuery({
    variables: { id: story.id },
    requestPolicy: "cache-and-network",
    pause: !me || !story.isLive || !!inactive,
  });

  useEffect(() => {
    const i = window.setInterval(
      () => fetchStoryUsers({ requestPolicy: "cache-and-network" }),
      60 * 1000
    );
    return () => window.clearInterval(i);
  }, [fetchStoryUsers]);

  useOnStoryUsersUpdatedSubscription(
    {
      variables: { id: story.id || "" },
      pause: !storyUsers || !story.isLive || !!inactive,
    },
    (prev, data) => data
  );

  if (!me)
    return (
      <Box fullHeight justifyContent="center" alignItems="center">
        <AuthBanner
          prompt={t("story.chat.authPrompt")}
          hook={t("story.chat.authPromptHook")}
        />
      </Box>
    );

  return (
    <Box fullHeight>
      <Box flex={1} minHeight={0}>
        <Messenger id={`story:${story.id}`} inactive={inactive} />
      </Box>
    </Box>
  );
};

export default StoryChat;
