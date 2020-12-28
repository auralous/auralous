import React, { useState, useMemo, useEffect } from "react";
import ms from "ms";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";
import { useModal } from "~/components/Modal";
import { Story, useStoriesQuery, useUserQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const StorySlider = dynamic(() => import("./StorySlider"));

const LIMIT = 10;

const StoryItem: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId },
  });

  const dateStr = useMemo(() => {
    const d = Date.now() - story.createdAt.getTime();
    return d ? ms(d) : "";
  }, [story]);

  return (
    <div
      className="w-full relative h-0 bg-background-secondary rounded-lg"
      style={{ paddingBottom: "100%" }}
    >
      <div className="border-4 border-background-tertiary w-12 h-12 rounded-full overflow-hidden absolute top-4 left-4">
        {user ? (
          <img
            alt={user.username}
            className="w-full h-full object-cover"
            src={user.profilePicture}
          />
        ) : (
          <div className="box-skeleton w-full h-full" />
        )}
      </div>
      <div className="absolute p-4 bottom-0 w-full">
        <div>
          <span className="font-bold mr-1">{user?.username}</span>
          {story.isLive ? (
            <span className="font-semibold text-xs bg-primary animate-pulse uppercase leading-none py-0.5 px-1 rounded-full">
              {t("common.live")}
            </span>
          ) : (
            <span className="text-xs text-foreground-secondary">{dateStr}</span>
          )}
        </div>
        <div className="text-foreground-secondary">{story.text}</div>
      </div>
    </div>
  );
};

const StoryFeed: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useI18n();

  const [active, open, close] = useModal();
  const [intialSlide, setIntialSlide] = useState(0);

  // Pagination
  const [next, setNext] = useState<undefined | string>("");
  const [{ data: { stories } = { stories: undefined } }] = useStoriesQuery({
    variables: { id, next, limit: LIMIT },
  });

  // Load more stories
  const { ref: refLoadMore, inView: inViewLoadMore } = useInView();
  useEffect(() => {
    if (inViewLoadMore && stories?.length)
      setNext(stories[stories.length - 1].id);
  }, [inViewLoadMore, stories]);

  return (
    <>
      <div className="w-full sm:p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {stories?.map((story, index) => (
          <div key={story.id} className="relative rounded-lg overflow-hidden">
            <StoryItem story={story} />
            <button
              className="absolute inset-0 hover:bg-foreground-backdrop focus:bg-foreground-backdrop focus:outline-none w-full h-full"
              aria-label={t("story.play")}
              onClick={() => {
                setIntialSlide(index);
                open();
              }}
            />
          </div>
        ))}
        {/* Load more observer */}
        <span className="w-1 h-1" ref={refLoadMore} />
      </div>
      <StorySlider
        stories={stories}
        setNext={setNext}
        intialSlide={intialSlide}
        active={active}
        close={close}
      />
    </>
  );
};

export default StoryFeed;
