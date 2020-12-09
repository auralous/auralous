import React from "react";
import { Modal } from "~/components/Modal";
import { toast } from "~/lib/toast";
import { Story, useDeleteStoryMutation } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { usePlayer } from "../Player";

const DeleteStory: React.FC<{
  story: Story;
  active: boolean;
  close(): void;
}> = ({ story, active, close }) => {
  const {
    state: { playingStoryId },
    stopPlaying,
  } = usePlayer();

  const [{ fetching }, deleteStory] = useDeleteStoryMutation();
  const { t } = useI18n();

  function onDelete() {
    if (playingStoryId === story.id) stopPlaying();
    deleteStory({ id: story.id }).then(() => {
      toast.success(t("story.delete.success"));
    });
  }

  return (
    <>
      <Modal.Modal
        title={t("story.delete.title")}
        active={active}
        onOutsideClick={close}
      >
        <Modal.Header>
          <Modal.Title>{t("story.delete.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Content className="text-center">
          <p className="mb-4">
            {t("story.delete.confirmPrompt")}
            <br />
            <b>{t("common.dangerousActionText")}</b>.
          </p>
        </Modal.Content>
        <Modal.Footer>
          <button
            className="btn btn-transparent text-danger-light"
            onClick={onDelete}
            disabled={fetching}
          >
            {t("story.delete.action")}
          </button>
          <button
            onClick={close}
            className="btn btn-success"
            disabled={fetching}
          >
            {t("story.delete.cancel")}
          </button>
        </Modal.Footer>
      </Modal.Modal>
    </>
  );
};

export default DeleteStory;
