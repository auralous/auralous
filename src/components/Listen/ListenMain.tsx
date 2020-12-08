import React, { useEffect, useMemo, useRef, useState } from "react";
import Swiper from "swiper/bundle";
import ListenStoryView from "./ListenStoryView";
import { usePlayer } from "~/components/Player";
import { useStoryFeedQuery, Story } from "~/graphql/gql.gen";
import ListenStoryOverlay from "./ListenStoryOverlay";
import { VirtualData } from "swiper/types/components/virtual";

const LIMIT = 10;

const ListenMain: React.FC = () => {
  const [next, setNext] = useState<undefined | string>("");

  const swiperRef = useRef<{ swiper: Swiper | null }>({ swiper: null });

  // Setup swiper
  useEffect(() => {
    const swiperInstance = (swiperRef.current.swiper =
      swiperRef.current.swiper ||
      new Swiper("#story-feed-swiper", {
        spaceBetween: 0,
        slidesPerView: 1,
        virtual: { renderExternal: setVirtualData },
        on: {
          slideChange(swiper) {
            setCurrentSlide(swiper.activeIndex);
          },
        },
      }));

    // scroll by keyboard
    const onKeyPress = (e: KeyboardEvent) => {
      const swiperInstance = swiperRef.current.swiper;
      if (!swiperInstance) return;
      if (e.key === "ArrowRight") swiperInstance.slideNext();
      else if (e.key === "ArrowLeft") swiperInstance.slidePrev();
    };
    document.addEventListener("keydown", onKeyPress, true);

    // cleanup
    return function cleanupSwiper() {
      document.removeEventListener("keydown", onKeyPress);
      swiperInstance.destroy();
    };
  }, []);

  const [stories, setStories] = useState<Story[]>([]);

  const [{ data }] = useStoryFeedQuery({
    // pagination is not working rn
    variables: { id: "PUBLIC", next, limit: LIMIT },
  });

  useEffect(
    () =>
      setStories((ss) => {
        const tempArr: Story[] = [];
        data?.storyFeed.forEach(
          (sf) => !ss.some((s) => s.id === sf.id) && tempArr.push(sf)
        );

        // update swiper slides
        swiperRef.current.swiper?.virtual?.appendSlide(
          tempArr.map((ta) => ta.id)
        );

        // update state
        return ss.concat(tempArr);
      }),
    [data]
  );

  const { playStory } = usePlayer();

  const [virtualData, setVirtualData] = useState<VirtualData | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (!stories.length) return;

    playStory(stories[currentSlide].id);

    // Load more stories (pagination)
    // should start loading the next one if it is 5 slides away
    if (stories.length - currentSlide < 5) {
      setNext(stories[stories.length - 1].id);
    }
  }, [currentSlide, stories, playStory]);

  const VirtualSlides = useMemo(() => {
    const els: JSX.Element[] = [];
    if (!virtualData || !stories.length) return els;

    virtualData.slides.forEach((slide: string) => {
      const story = stories.find((s) => s.id === slide);
      if (!story) return;
      els.push(
        <div
          key={story.id}
          className="swiper-slide h-screen-layout"
          style={{
            left: `${virtualData.offset}px`,
          }}
        >
          <ListenStoryView story={story} />
        </div>
      );
    });
    return els;
  }, [virtualData, stories]);

  return (
    <div className="h-screen-layout w-full relative overflow-hidden select-none">
      <div className="swiper-container h-full" id="story-feed-swiper">
        <div className="swiper-wrapper">{VirtualSlides}</div>
      </div>
      <ListenStoryOverlay storyFeed={stories} />
    </div>
  );
};

export default ListenMain;
