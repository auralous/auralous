// Check if current user has an ongoing story
// and redirect them to it
import { Modal } from "components/Modal";
import { usePlayer } from "components/Player";
import { Button } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useStoryLiveQuery } from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import { useRouter } from "next/router";

const StoryOngoingWatcher: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    state: { playingStoryId },
  } = usePlayer();
  const me = useMe();
  const [
    { data: { storyLive } = { storyLive: undefined } },
  ] = useStoryLiveQuery({
    variables: { creatorId: me?.user.id },
    pause: !me,
  });

  return (
    <>
      <Modal.Modal
        title={t("story.ongoing.title")}
        active={!!storyLive?.isLive && playingStoryId !== storyLive.id}
      >
        <Modal.Content>
          <Typography.Paragraph size="lg" strong color="foreground-secondary">
            {t("story.ongoing.title")}
          </Typography.Paragraph>
          <Box padding="xl" rounded="lg">
            <Typography.Paragraph strong size="lg">
              <span className="animate-pulse uppercase text-xs font-bold p-1 bg-primary rounded-lg">
                {t("common.live")}
              </span>
              <Spacer size={1} />
              {storyLive?.text}
            </Typography.Paragraph>
            <Typography.Paragraph size="xs" color="foreground-secondary">
              {storyLive?.createdAt.toLocaleDateString()}
            </Typography.Paragraph>
          </Box>
        </Modal.Content>
        <Modal.Footer>
          <Button
            onPress={() => router.push(`/story/${storyLive?.id}`)}
            title={t("story.ongoing.goto")}
          />
        </Modal.Footer>
      </Modal.Modal>
    </>
  );
};

export default StoryOngoingWatcher;
