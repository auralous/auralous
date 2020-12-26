import React, { useState } from "react";
import StorySlider from "./StorySlider";
import StoryItem from "./StoryItem";
import { useModal } from "~/components/Modal";
import { useStoriesQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const LIMIT = 10;

const StoryFeed: React.FC<{ id: string }> = () => {
  const { t } = useI18n();

  const [active, open, close] = useModal();
  const [intialSlide, setIntialSlide] = useState(0);

  // Pagination
  const [next, setNext] = useState<undefined | string>("");
  const [{ data: { stories } = { stories: undefined } }] = useStoriesQuery({
    variables: { id: "PUBLIC", next, limit: LIMIT },
  });

  return (
    <>
      <div className="w-full p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
