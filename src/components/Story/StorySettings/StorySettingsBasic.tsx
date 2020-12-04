import React, { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { toast } from "~/lib/toast";
import { useModal, Modal } from "~/components/Modal";
import {
  Story,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgEdit2 } from "~/assets/svg";

const ImageEditSection: React.FC<{
  story: Story;
  imageRef: React.RefObject<HTMLImageElement>;
  imageInputRef: React.RefObject<HTMLInputElement>;
}> = ({ story, imageRef, imageInputRef }) => {
  function handleImageInputChange() {
    const file = (imageInputRef.current as HTMLInputElement).files?.[0];
    if (file)
      (imageRef.current as HTMLImageElement).src = URL.createObjectURL(file);
  }

  return (
    <div className="relative mx-auto w-32 h-32 mb-2 rounded-full overflow-hidden flex flex-center">
      <input
        id="storyImg"
        className="absolute w-full h-full inset-0 cursor-pointer"
        type="file"
        accept="image/*"
        aria-label="Upload an image"
        ref={imageInputRef}
        onChange={handleImageInputChange}
      />
      <img
        ref={imageRef}
        alt={story.title}
        className="pointer-events-none absolute inset-0 w-full h-full object-cover bg-background-secondary"
        src={story.image}
      />
      <div
        className="pointer-events-none absolute inset-0 w-full h-full flex flex-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        <SvgEdit2 fill="white" stroke="transparent" />
      </div>
    </div>
  );
};

const InfoEditSection: React.FC<{
  story: Story;
  titleRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
}> = ({ story, titleRef, descriptionRef }) => {
  const { t } = useI18n();
  return (
    <>
      <div className="mb-4">
        <label className="label" htmlFor="storyTitle">
          {t("story.settings.info.title")}
        </label>
        <input
          id="storyTitle"
          className="input w-full"
          type="text"
          ref={titleRef}
          required
        />
      </div>
      <div className="mb-4 hidden">
        <label className="label" htmlFor="storyDesc">
          {t("story.settings.info.description")}
        </label>
        <textarea
          id="storyDesc"
          className="input w-full"
          ref={descriptionRef}
        />
      </div>
      {/* TODO: Not yet implemented */}
      <div className="mb-4">
        <label className="label" htmlFor="storyUsername">
          {t("story.settings.info.username")}
        </label>
        <input
          id="storyUsername"
          disabled
          className="input w-full"
          type="text"
          value={story.id}
          required
        />
      </div>
    </>
  );
};

const StoryDetails: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const [{ fetching }, updateStory] = useUpdateStoryMutation();

  const [isChanged, setIsChanged] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsChanged(false);

    const formNode = formRef.current;
    const titleNode = titleRef.current;
    const descriptionNode = descriptionRef.current;
    const imageInputNode = imageInputRef.current;
    const imageNode = imageRef.current;

    if (
      !formNode ||
      !titleNode ||
      !descriptionNode ||
      !imageInputNode ||
      !imageNode
    )
      return;

    (formRef.current as HTMLFormElement).reset();

    titleNode.value = story.title;
    descriptionNode.value = story.description || "";
    imageNode.src = story.image;

    const onChange = () => setIsChanged(true);
    titleNode.oninput = onChange;
    descriptionNode.oninput = onChange;
    imageInputNode.onchange = onChange;
    return () => {
      titleNode.oninput = null;
      descriptionNode.oninput = null;
      imageInputNode.onchange = null;
    };
  }, [story]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const image = imageInputRef.current?.files?.[0];
      const title =
        titleRef.current?.value !== story.title && titleRef.current?.value;
      const description =
        descriptionRef.current?.value !== story.description &&
        descriptionRef.current?.value;
      if (image || title || description) {
        await updateStory({
          id: story.id,
          ...(title && { title }),
          ...(description !== false && { description }),
          ...(image && { image }),
        });
        toast.success(t("story.settings.updatedText"));
      }
    },
    [t, story, updateStory]
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
      <div className="flex flex-wrap flex-center">
        <div className="flex-none w-full md:w-auto md:mr-4">
          <ImageEditSection
            story={story}
            imageInputRef={imageInputRef}
            imageRef={imageRef}
          />
        </div>
        <div className="flex-1 pt-4">
          <InfoEditSection
            story={story}
            titleRef={titleRef}
            descriptionRef={descriptionRef}
          />
        </div>
      </div>
      <button
        type="submit"
        className="btn mt-2"
        disabled={!isChanged || fetching}
      >
        {isChanged ? t("common.save") : t("common.saved")}
      </button>
    </form>
  );
};

const StoryPublish: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const router = useRouter();
  const [{ fetching }, deleteStory] = useDeleteStoryMutation();
  const [activeDelete, openDelete, closeDelete] = useModal();
  const [confirmDelete, setConfirmDelete] = useState("");

  const onDelete = () => {
    deleteStory({ id: story.id }).then(() => {
      toast.success(t("story.settings.dangerZone.delete.deleted"));
      router.replace("/browse");
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
        title={t("story.settings.dangerZone.delete.title", {
          title: t("story.label"),
        })}
        active={activeDelete}
        onOutsideClick={closeDelete}
      >
        <Modal.Header>
          <Modal.Title>
            {t("story.settings.dangerZone.delete.title", {
              title: story.title,
            })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Content className="text-center">
          <p className="mb-2">
            {t("story.settings.dangerZone.delete.description")}
            <br />
            <b>{t("common.dangerousActionText")}</b>.
          </p>
          <input
            aria-label={t("story.settings.dangerZone.delete.enterName")}
            value={confirmDelete}
            placeholder={t("story.settings.dangerZone.delete.enterName")}
            onChange={(e) => setConfirmDelete(e.target.value)}
            className="input w-96 max-w-full"
          />
        </Modal.Content>
        <Modal.Footer>
          <button
            className="btn btn-transparent text-danger-light"
            onClick={onDelete}
            disabled={confirmDelete !== story.title || fetching}
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
      <div className="mb-4 rounded-t-lg overflow-hidden">
        <StoryDetails story={story} />
      </div>
      <div>
        <StoryPublish story={story} />
      </div>
    </div>
  );
};

export default StorySettingsBasic;
