import React from "react";
import { Button } from "~/components/Button";
import { Modal } from "~/components/Modal";
import { Story, useDeleteStoryMutation } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { toast } from "~/lib/toast";
import { usePlayer } from "../Player";

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
          <p className="text-center">
            {t("story.delete.confirmPrompt")}
            <br />
            <b>{t("common.dangerousActionText")}</b>.
          </p>
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
