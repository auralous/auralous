import { useModal } from "components/Modal";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { Story, useStoriesQuery, useUserQuery } from "gql/gql.gen";
import { useMeLiveStory } from "hooks/user";
import { t as i18nT, useI18n } from "i18n/index";
import ms from "ms";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";

const StorySlider = dynamic(() => import("./StorySlider"), { ssr: false });

const LIMIT = 10;

const StoryItem: React.FC<{ story: Story; onClick(): void }> = ({
  story,
  onClick,
}) => {
  const { t } = useI18n();

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId },
  });

  const dateStr = useMemo(() => {
    const d = Date.now() - story.createdAt.getTime();
    return d ? ms(d) : "";
  }, [story]);

  const altText = `${t("story.ofUsername", {
    username: user?.username || "",
  })} - ${story.text}`;

  return (
    <button
      className="w-full text-inline-link"
      onClick={onClick}
      aria-label={`${t("story.play")}: ${altText}`}
    >
      <Box
        position="relative"
        fullWidth
        style={{ paddingBottom: "100%" }}
        height={0}
      >
        <img
          className="absolute inset-0 w-full h-full"
          src={story.image}
          alt={altText}
        />
      </Box>
      <Box padding="sm" fullWidth>
        <Typography.Paragraph strong truncate noMargin align="left">
          {story.text}
        </Typography.Paragraph>
        <Typography.Paragraph
          truncate
          noMargin
          color="foreground-secondary"
          align="left"
          size="sm"
        >
          {story.isLive ? (
            <span className="font-bold bg-primary animate-pulse uppercase leading-none py-0.5 px-1 rounded-full">
              {t("common.live")}
            </span>
          ) : (
            <Typography.Text color="foreground-secondary">
              {dateStr} •
            </Typography.Text>
          )}
          <Spacer size={1} axis="horizontal" />
          <Typography.Text>{user?.username}</Typography.Text>
        </Typography.Paragraph>
      </Box>
    </button>
  );
};

const StoryFeed: React.FC<{ id: string }> = ({ id }) => {
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

  const storyLive = useMeLiveStory();

  const startBrowse = (index: number) => {
    if (storyLive) {
      toast(i18nT("story.ongoing.prompt"));
      return;
    }
    setIntialSlide(index);
    open();
  };

  return (
    <>
      <div className="w-full p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stories?.map((story, index) => (
          <StoryItem
            key={story.id}
            story={story}
            onClick={() => startBrowse(index)}
          />
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
