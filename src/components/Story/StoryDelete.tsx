import { Modal } from "components/Modal";
import { usePlayer } from "components/Player";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { Story, useDeleteStoryMutation } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import { toast } from "utils/toast";

const StoryDelete: React.FC<{
  story: Story;
  active: boolean;
  close(): void;
}> = ({ story, active, close }) => {
  const {
    state: { playingStoryId },
    playStory,
  } = usePlayer();

  const [{ fetching }, deleteStory] = useDeleteStoryMutation();
  const { t } = useI18n();

  function onDelete() {
    if (playingStoryId === story.id) playStory("");
    deleteStory({ id: story.id }).then(() => {
      toast.success(t("story.delete.success"));
      close();
    });
  }

  return (
    <>
      <Modal.Modal
        title={t("story.delete.title")}
        active={active}
        close={close}
      >
        <Modal.Header>
          <Modal.Title>{t("story.delete.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <Typography.Paragraph align="center">
            {t("story.delete.confirmPrompt")}
            <br />
            <Typography.Text strong>
              {t("common.dangerousActionText")}
            </Typography.Text>
            .
          </Typography.Paragraph>
        </Modal.Content>
        <Modal.Footer>
          <Button
            color="danger"
            onPress={onDelete}
            disabled={fetching}
            title={t("story.delete.confirm")}
          />
          <Button
            disabled={fetching}
            title={t("common.cancel")}
            onPress={close}
          />
        </Modal.Footer>
      </Modal.Modal>
    </>
  );
};

export default StoryDelete;
