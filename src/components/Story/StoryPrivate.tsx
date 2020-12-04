import React, { useRef, useCallback } from "react";
import { toast } from "~/lib/toast";
import { AuthBanner } from "~/components/Auth/index";
import { useCurrentUser } from "~/hooks/user";
import {
  Story,
  useJoinPrivateStoryMutation,
  StoryState,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgLock } from "~/assets/svg";

const StoryPrivate: React.FC<{
  story: Story;
  storyState: StoryState;
  reloadFn: () => void;
}> = ({ story, reloadFn }) => {
  const { t } = useI18n();
  const passwordRef = useRef<HTMLInputElement>(null);

  const user = useCurrentUser();
  const [{ fetching }, joinPrivateStory] = useJoinPrivateStoryMutation();

  const handleJoinPrivateStory = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!passwordRef.current || fetching) return;
      const result = await joinPrivateStory({
        id: story.id,
        password: passwordRef.current.value,
      }).then((response) => response.data?.joinPrivateStory);
      result ? reloadFn() : toast.error(t("story.main.private.badPassword"));
    },
    [t, story, joinPrivateStory, fetching, reloadFn]
  );

  return (
    <div className="w-full h-full flex flex-col flex-center p-4">
      {user ? (
        <>
          <div className="mb-8 p-6 rounded-full bg-background-secondary">
            <SvgLock className="w-16 h-16" />
          </div>
          <p className="text-center">{t("story.main.private.password1")}</p>
          <form className="flex my-2" onSubmit={handleJoinPrivateStory}>
            <input
              type="password"
              autoComplete="current-password"
              aria-label="Password"
              ref={passwordRef}
              className="input w-full mr-1"
            />
            <button type="submit" className="btn" disabled={fetching}>
              {t("story.main.private.join")}
            </button>
          </form>
          <p className="text-foreground-secondary text-xs text-center mt-2">
            {t("story.main.private.password2")}
          </p>
        </>
      ) : (
        <AuthBanner prompt={t("story.main.private.prompt")} />
      )}
    </div>
  );
};

export default StoryPrivate;
