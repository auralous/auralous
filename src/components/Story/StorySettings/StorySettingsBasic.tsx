import React from "react";
import { useRouter } from "next/router";
import { toast } from "~/lib/toast";
import { useModal, Modal } from "~/components/Modal";
import { Story, useDeleteStoryMutation } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const StoryPublish: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const router = useRouter();
  const [{ fetching }, deleteStory] = useDeleteStoryMutation();
  const [activeDelete, openDelete, closeDelete] = useModal();

  const onDelete = () => {
    deleteStory({ id: story.id }).then(() => {
      toast.success(t("story.settings.dangerZone.delete.deleted"));
      router.replace("/discover");
    });
  };

  return (
    <>
      <h3 className="text-lg font-bold">
        {t("story.settings.dangerZone.title")}
      </h3>
      <button className="btn btn-danger mt-4" onClick={openDelete}>
        {t("story.settings.dangerZone.delete.title", {
          title: t("story.label"),
        })}
      </button>
      <Modal.Modal
        title={t("story.settings.dangerZone.delete.title")}
        active={activeDelete}
        onOutsideClick={closeDelete}
      >
        <Modal.Header>
          <Modal.Title>
            {t("story.settings.dangerZone.delete.title")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Content className="text-center">
          <p className="mb-2">
            {t("story.settings.dangerZone.delete.description")}
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
            {t("story.settings.dangerZone.delete.action")}
          </button>
          <button onClick={closeDelete} className="btn btn-success">
            {t("story.settings.dangerZone.delete.cancel")}
          </button>
        </Modal.Footer>
      </Modal.Modal>
    </>
  );
};

const StorySettingsBasic: React.FC<{ story: Story }> = ({ story }) => {
  return (
    <div>
      <div>
        <StoryPublish story={story} />
      </div>
    </div>
  );
};

export default StorySettingsBasic;
