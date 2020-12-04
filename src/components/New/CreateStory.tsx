import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Switch } from "@headlessui/react";
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

  const titleRef = useRef<HTMLInputElement>(null);
  const [isPublic, setIsPublic] = useState(true);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [anyoneCanAdd, setAnyoneCanAdd] = useState(false);

  const [{ fetching }, createStory] = useCreateStoryMutation();
  const [, updateQueue] = useUpdateQueueMutation();

  const handleStoryCreation = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (fetching) return;
      event.preventDefault();

      if (!user) return logIn();

      if (!isPublic && !passwordRef.current?.value) {
        if (!window.confirm(t("new.addNew.warnNoPass"))) return;
      }

      const result = await createStory({
        title: (titleRef.current as HTMLInputElement).value,
        isPublic,
        anyoneCanAdd: isPublic ? anyoneCanAdd : false,
        password: passwordRef.current?.value ?? (isPublic ? undefined : ""),
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
      t,
      initTracks,
      router,
      fetching,
      isPublic,
      createStory,
      anyoneCanAdd,
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
        <CreateStoryLabel htmlFor="storyTitle">
          {t("new.addNew.promptTitle")}
        </CreateStoryLabel>
        <input
          id="storyTitle"
          aria-label={t("story.settings.info.titleHelp")}
          placeholder={t("story.settings.info.titleHelp")}
          required
          className="input w-full text-center"
          type="text"
          ref={titleRef}
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
        <CreateStoryFormGroup>
          {isPublic ? (
            <>
              <CreateStoryLabel htmlFor="storyAnyoneCanAdd">
                {t("story.settings.privacy.publicAllowGuests")}
              </CreateStoryLabel>
              <Switch
                checked={anyoneCanAdd}
                onChange={setAnyoneCanAdd}
                className={`${
                  anyoneCanAdd ? "bg-success" : "bg-background-tertiary"
                } relative inline-flex h-6 rounded-full w-12 mb-1`}
                aria-labelledby="storyAnyoneCanAdd"
              >
                <span
                  className={`${
                    anyoneCanAdd ? "translate-x-6" : "translate-x-0"
                  } inline-block w-6 h-6 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
              <p className="text-xs text-foreground-tertiary px-1">
                {t("story.settings.privacy.publicAllowGuestsHelp")}
              </p>
            </>
          ) : (
            <>
              <CreateStoryLabel htmlFor="password">
                {t("story.settings.privacy.password")}
              </CreateStoryLabel>
              <input
                type="password"
                id="password"
                aria-label={t("story.settings.privacy.password")}
                ref={passwordRef}
                className="input mb-1"
                maxLength={16}
              />
              <p className="text-xs text-foreground-tertiary px-1">
                {t("story.settings.privacy.passwordHelp")}
              </p>
            </>
          )}
        </CreateStoryFormGroup>
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
