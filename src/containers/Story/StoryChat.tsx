import { SvgShare2 } from "assets/svg";
import { AuthBanner } from "components/Auth";
import { Messenger } from "components/Message/index";
import { useModal } from "components/Modal";
import { Button } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { StoryShare } from "components/Story";
import { Box } from "components/View";
import {
  Story,
  useOnStoryUsersUpdatedSubscription,
  useStoryUsersQuery,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import { useEffect } from "react";
import StoryListeners from "./StoryListeners";

const StoryUsers: React.FC<{ story: Story; userIds: string[] }> = ({
  story,
  userIds,
}) => {
  const { t } = useI18n();
  const [active, open, close] = useModal();

  return (
    <>
      <Box paddingX={4} paddingY={1} row>
        <Button
          color="primary"
          accessibilityLabel={t("story.share.title")}
          onPress={open}
          icon={<SvgShare2 className="w-4 h-4" />}
          shape="circle"
          size="sm"
        />
        <Spacer size={1} axis="horizontal" />
        <Box flex={1} minWidth={0}>
          <StoryListeners userIds={userIds} />
        </Box>
      </Box>
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
    fetchStoryUsers,
  ] = useStoryUsersQuery({
    variables: { id: story.id },
    requestPolicy: "cache-and-network",
    pause: !me || !story.isLive,
  });

  useEffect(() => {
    const i = window.setInterval(
      () => fetchStoryUsers({ requestPolicy: "cache-and-network" }),
      60 * 1000
    );
    return () => window.clearInterval(i);
  }, [fetchStoryUsers]);

  useOnStoryUsersUpdatedSubscription(
    { variables: { id: story.id || "" }, pause: !storyUsers || !story.isLive },
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
      {story.isLive && <StoryUsers userIds={storyUsers || []} story={story} />}
      <Box flex={1} minHeight={0}>
        <Messenger id={`story:${story.id}`} />
      </Box>
    </Box>
  );
};

export default StoryChat;
