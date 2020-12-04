import React, { useRef, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { toast } from "~/lib/toast";
import { Story, useUpdateStoryMutation, StoryState } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const StorySettingsRules: React.FC<{
  story: Story;
  storyState: StoryState;
}> = ({ story, storyState }) => {
  const { t } = useI18n();
  const passwordRef = useRef<HTMLInputElement>(null);

  const [anyoneCanAdd, setAnyoneCanAdd] = useState(false);

  useEffect(() => {
    if (!storyState) return;
    setAnyoneCanAdd(storyState.anyoneCanAdd);
  }, [storyState]);

  const [{ fetching }, updateStory] = useUpdateStoryMutation();
  const [isChanged, setIsChanged] = useState(false);

  const handleSaveRules = async () => {
    if (!story.isPublic && !passwordRef.current?.value) {
      if (!window.confirm(t("new.addNew.warnNoPass"))) return;
    }
    const update = {
      id: story.id,
      anyoneCanAdd: story.isPublic ? anyoneCanAdd : undefined,
      password: !story.isPublic ? passwordRef.current?.value : undefined,
    };
    const result = await updateStory(update);
    if (!result.error) {
      setIsChanged(false);
      toast.success(t("story.settings.updatedText"));
    }
  };

  return (
    <>
      {story.isPublic ? (
        <>
          <div className="mb-4">
            <h5 className="text-lg font-bold">
              {t("story.settings.privacy.publicAllowGuests")}
            </h5>
            <p className="text-foreground-secondary mb-1">
              {t("story.settings.privacy.publicAllowGuestsHelp")}
            </p>
            <Switch
              checked={anyoneCanAdd}
              onChange={(value) => {
                setAnyoneCanAdd(value);
                setIsChanged(true);
              }}
              className={`${
                anyoneCanAdd ? "bg-success" : "bg-background-tertiary"
              } relative inline-flex h-6 rounded-full w-12`}
              aria-labelledby="storyAnyoneCanAdd"
            >
              <span
                className={`${
                  anyoneCanAdd ? "translate-x-6" : "translate-x-0"
                } inline-block w-6 h-6 transform bg-white rounded-full transition-transform`}
              />
            </Switch>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <h5 className="text-lg font-bold">
              {t("story.settings.privacy.newPassword")}
            </h5>
            <p className="text-foreground-secondary mb-1">
              {t("story.settings.privacy.passwordHelp")}
            </p>
            <input
              type="password"
              autoComplete="new-password"
              id="password"
              ref={passwordRef}
              className="input"
              maxLength={16}
              onChange={() => setIsChanged(true)}
            />
            <p className="text-foreground-tertiary text-xs mt-1">
              {t("story.settings.privacy.newPasswordHelp")}
            </p>
          </div>
        </>
      )}
      <button
        className="btn  mb-6"
        onClick={handleSaveRules}
        disabled={!isChanged || fetching}
      >
        {isChanged ? t("common.save") : t("common.saved")}
      </button>
    </>
  );
};

export default StorySettingsRules;
