import React, { useState } from "react";
import { Story, StoryState } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const StorySettingsRules: React.FC<{
  story: Story;
  storyState: StoryState;
}> = () => {
  const { t } = useI18n();

  const [isChanged] = useState(false);

  return (
    <>
      <button className="btn mb-6" disabled={!isChanged}>
        {isChanged ? t("common.save") : t("common.saved")}
      </button>
    </>
  );
};

export default StorySettingsRules;
