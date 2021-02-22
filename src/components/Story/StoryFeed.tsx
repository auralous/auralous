import { Skeleton } from "components/Loading";
import { useModal } from "components/Modal";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Story, useStoriesQuery, useUserQuery } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import ms from "ms";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
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

  return (
    <button
      className="w-full relative h-0 bg-background-secondary text-inline-link rounded-bl-3xl rounded-br-lg rounded-tl-lg rounded-tr-3xl overflow-hidden"
      style={{ paddingBottom: "150%" }}
      onClick={onClick}
      aria-label={`${t("story.play")}: ${t("story.ofUsername", {
        username: user?.username || "",
      })} - ${story.text}`}
    >
      <div
        className="absolute w-full h-full bg-cover bg-center opacity-50"
        style={{ background: `url(${story.image})` }}
      />
      <div className="absolute rounded-full top-4 left-4 shadow-xl">
        <Skeleton show={!user} rounded="full">
          <img
            alt={user?.username}
            className="w-12 h-12 rounded-full object-cover"
            src={user?.profilePicture}
          />
        </Skeleton>
      </div>
      <div className="absolute p-4 bottom-0 w-full">
        <Typography.Paragraph noMargin align="left">
          <Typography.Text strong>{user?.username}</Typography.Text>
          <Spacer size={1} axis="horizontal" />
          {story.isLive ? (
            <span className="font-bold text-xs bg-primary animate-pulse uppercase leading-none py-0.5 px-1 rounded-full">
              {t("common.live")}
            </span>
          ) : (
            <Typography.Text color="foreground-secondary" size="xs">
              {dateStr}
            </Typography.Text>
          )}
        </Typography.Paragraph>
        <Typography.Paragraph
          truncate
          noMargin
          color="foreground-secondary"
          align="left"
        >
          {story.text}
        </Typography.Paragraph>
      </div>
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

  return (
    <>
      <div className="w-full p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stories?.map((story, index) => (
          <StoryItem
            key={story.id}
            story={story}
            onClick={() => {
              setIntialSlide(index);
              open();
            }}
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
