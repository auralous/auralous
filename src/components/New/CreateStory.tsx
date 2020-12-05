import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  QueueAction,
  Track,
  useCreateStoryMutation,
  useUpdateQueueMutation,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { useLogin } from "~/components/Auth";
import { useCurrentUser } from "~/hooks/user";

const CreateStoryLabel: React.FC<{ htmlFor: string }> = ({
  htmlFor,
  children,
}) => (
  <label className="label text-foreground text-center" htmlFor={htmlFor}>
    {children}
  </label>
);

const CreateStoryFormGroup: React.FC = ({ children }) => (
  <div className="w-full flex flex-col mb-4 items-center">{children}</div>
);

const CreateStory: React.FC<{ initTracks: Track[] }> = ({ initTracks }) => {
  const { t } = useI18n();

  const [, logIn] = useLogin();
  const user = useCurrentUser();

  const router = useRouter();

  const textRef = useRef<HTMLInputElement>(null);
  const [isPublic, setIsPublic] = useState(true);

  const [{ fetching }, createStory] = useCreateStoryMutation();
  const [, updateQueue] = useUpdateQueueMutation();

  const handleStoryCreation = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (fetching) return;
      event.preventDefault();

      if (!user) return logIn();

      const result = await createStory({
        text: (textRef.current as HTMLInputElement).value,
        isPublic,
      });

      if (result.data?.createStory) {
        if (initTracks?.length)
          await updateQueue({
            id: `story:${result.data.createStory.id}`,
            action: QueueAction.Add,
            tracks: initTracks.map((initTrack) => initTrack.id),
          });

        router.push("/story/[storyId]", `/story/${result.data.createStory.id}`);
      }
    },
    [
      initTracks,
      router,
      fetching,
      isPublic,
      createStory,
      updateQueue,
      logIn,
      user,
    ]
  );

  return (
    <form
      onSubmit={handleStoryCreation}
      autoComplete="off"
      className="flex flex-col flex-center"
    >
      <CreateStoryFormGroup>
        <CreateStoryLabel htmlFor="storyText">
          {t("new.addNew.promptText")}
        </CreateStoryLabel>
        <input
          id="storyText"
          aria-label={t("story.settings.info.textHelp")}
          placeholder={t("story.settings.info.textHelp")}
          required
          className="input w-full text-center"
          type="text"
          ref={textRef}
          disabled={fetching}
        />
      </CreateStoryFormGroup>
      <CreateStoryFormGroup>
        <CreateStoryLabel htmlFor="storyPrivacy">
          {t("new.addNew.promptPrivacy")}
        </CreateStoryLabel>
        <div className="input inline-flex mx-auto">
          <div className="flex items-center mr-4">
            <input
              id="storyPrivacyPublic"
              name="storyPrivacy"
              type="radio"
              value="public"
              className="input"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.currentTarget.value === "public")}
            />
            <label className="label mb-0 pl-1" htmlFor="storyPrivacyPublic">
              {t("story.privacy.public")}
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="storyPrivacyPrivate"
              name="storyPrivacy"
              type="radio"
              value="private"
              className="input"
              checked={!isPublic}
              onChange={(e) => setIsPublic(e.currentTarget.value === "public")}
            />
            <label className="label mb-0 pl-1" htmlFor="storyPrivacyPrivate">
              {t("story.privacy.private")}
            </label>
          </div>
        </div>
      </CreateStoryFormGroup>
      <div className="px-4 py-2 h-28 rounded-lg bg-background-secondary">
        <CreateStoryFormGroup></CreateStoryFormGroup>
      </div>
      <button
        className="btn btn-success rounded-full mt-8"
        type="submit"
        disabled={fetching}
      >
        {t("new.addNew.action")}
      </button>
    </form>
  );
};

export default CreateStory;
