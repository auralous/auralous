import { useLogin } from "components/Auth";
import { usePlayer } from "components/Player";
import { Button } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
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
  <>
    <div className="w-full flex flex-col items-center">{children}</div>
    <Spacer size={4} axis="vertical" />
  </>
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
        <Spacer size={1} axis="vertical" />
        <Typography.Paragraph size="xs" color="foreground-tertiary">
          {t("new.addNew.textHelp", { maxLength: CONFIG.storyTextMaxLength })}
        </Typography.Paragraph>
      </CreateStoryFormGroup>
      <Spacer size={4} axis="vertical" />
      <Button
        color="primary"
        type="submit"
        disabled={fetching}
        title={t("new.addNew.action")}
        shape="circle"
      />
    </form>
  );
};

export default CreateStory;
