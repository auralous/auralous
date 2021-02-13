import { useLogin } from "components/Auth";
import { Button } from "components/Button";
import { usePlayer } from "components/Player";
import {
  QueueAction,
  Track,
  useCreateStoryMutation,
  useUpdateQueueMutation,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import { useRouter } from "next/router";
import React, { useCallback, useRef, useState } from "react";
import { CONFIG } from "utils/constants";

const CreateStoryLabel: React.FC<{ htmlFor: string }> = ({
  htmlFor,
  children,
}) => (
  <label
    id={`${htmlFor}-label`}
    className="label text-foreground text-center"
    htmlFor={htmlFor}
  >
    {children}
  </label>
);

const CreateStoryFormGroup: React.FC = ({ children }) => (
  <div className="w-full flex flex-col mb-4 items-center">{children}</div>
);

const CreateStory: React.FC<{ initTracks: Track[] }> = ({ initTracks }) => {
  const { t } = useI18n();

  const { playStory } = usePlayer();

  const [, logIn] = useLogin();
  const me = useMe();

  const router = useRouter();

  const textRef = useRef<HTMLInputElement>(null);
  const [isPublic] = useState(true);

  const [{ fetching }, createStory] = useCreateStoryMutation();
  const [, updateQueue] = useUpdateQueueMutation();

  const handleStoryCreation = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (fetching) return;
      event.preventDefault();

      if (!me) return logIn();

      const result = await createStory({
        text: (textRef.current as HTMLInputElement).value,
        isPublic,
      });

      if (result.data?.createStory) {
        playStory(result.data.createStory.id);

        if (initTracks?.length)
          await updateQueue({
            id: result.data.createStory.id,
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
      me,
      playStory,
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
          aria-labelledby="storyText-label"
          required
          className="input w-full text-center"
          type="text"
          maxLength={CONFIG.storyTextMaxLength}
          ref={textRef}
          disabled={fetching}
        />
        <p className="text-xs text-foreground-tertiary mt-1">
          {t("new.addNew.textHelp", { maxLength: CONFIG.storyTextMaxLength })}
        </p>
      </CreateStoryFormGroup>
      <div className="mb-8" />
      {/* <CreateStoryFormGroup>
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
      </CreateStoryFormGroup> */}
      <Button
        color="primary"
        type="submit"
        disabled={fetching}
        title={t("new.addNew.action")}
      />
    </form>
  );
};

export default CreateStory;
