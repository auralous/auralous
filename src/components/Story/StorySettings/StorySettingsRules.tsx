import React, { useState } from "react";
import { toast } from "~/lib/toast";
import { Story, useUpdateStoryMutation, StoryState } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const StorySettingsRules: React.FC<{
  story: Story;
  storyState: StoryState;
}> = ({ story }) => {
  const { t } = useI18n();

  const [{ fetching }, updateStory] = useUpdateStoryMutation();
  const [isChanged, setIsChanged] = useState(false);

  const handleSaveRules = async () => {
    const update = {
      id: story.id,
    };
    const result = await updateStory(update);
    if (!result.error) {
      setIsChanged(false);
      toast.success(t("story.settings.updatedText"));
    }
  };

  return (
    <>
      <button
        className="btn mb-6"
        onClick={handleSaveRules}
        disabled={!isChanged || fetching}
      >
        {isChanged ? t("common.save") : t("common.saved")}
      </button>
    </>
  );
};

export default StorySettingsRules;
