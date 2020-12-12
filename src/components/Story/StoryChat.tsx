import React from "react";
import { Messenger } from "~/components/Message/index";
import { Story } from "~/graphql/gql.gen";
import { useCurrentUser } from "~/hooks/user";
import { useI18n } from "~/i18n/index";
import { AuthBanner } from "~/components/Auth";

const StoryChat: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const user = useCurrentUser();

  if (!user)
    return (
      <div className="h-full flex flex-center">
        <AuthBanner
          prompt={t("story.chat.authPrompt")}
          hook={t("story.chat.authPromptHook")}
        />
      </div>
    );

  return <Messenger id={`story:${story.id}`} />;
};

export default StoryChat;
