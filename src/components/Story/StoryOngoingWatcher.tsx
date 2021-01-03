// Check if current user has an ongoing story
// and redirect them to it
import React from "react";
import { useRouter } from "next/router";
import StoryEnd from "./StoryEnd";
import { useStoryLiveQuery } from "~/graphql/gql.gen";
import { useMe } from "~/hooks/user";
import { Modal } from "~/components/Modal";
import { usePlayer } from "~/components/Player";
import { useI18n } from "~/i18n/index";

const StoryOngoingWatcher: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    state: { playingStoryId },
  } = usePlayer();
  const me = useMe();
  const [
    { data: { storyLive } = { storyLive: undefined } },
  ] = useStoryLiveQuery({
    variables: { creatorId: me?.user.id },
    pause: !me,
  });

  return (
    <>
      <Modal.Modal
        title={t("story.ongoing.title")}
        active={!!storyLive?.isLive && playingStoryId !== storyLive.id}
      >
        <Modal.Content>
          <p className="mb-2 text-lg font-bold text-foreground-secondary">
            {t("story.ongoing.title")}
          </p>
          <div className="py-6 px-8 rounded-lg bg-background-secondary border-background-tertiary mb-4">
            <div className="mb-2 leading-none font-bold text-lg text-foreground">
              <span className="mr-1 animate-pulse uppercase text-xs font-bold p-1 bg-primary rounded">
                {t("common.live")}
              </span>
              {storyLive?.text}
            </div>
            <div className="text-xs text-foreground-secondary">
              {storyLive?.createdAt.toLocaleDateString()}
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          {storyLive && (
            <StoryEnd story={storyLive}>
              {(openDelete) => (
                <button
                  className="btn btn-transparent text-danger"
                  onClick={openDelete}
                >
                  {t("story.end.title")}
                </button>
              )}
            </StoryEnd>
          )}
          <button
            className="btn"
            onClick={() => router.push(`/story/${storyLive?.id}`)}
          >
            {t("story.ongoing.goto")}
          </button>
        </Modal.Footer>
      </Modal.Modal>
    </>
  );
};

export default StoryOngoingWatcher;
