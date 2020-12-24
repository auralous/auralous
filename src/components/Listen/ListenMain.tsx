import React, { useEffect, useMemo, useRef, useState } from "react";
import Swiper from "swiper/bundle";
import ListenStoryView from "./ListenStoryView";
import { usePlayer } from "~/components/Player";
import { useStoryFeedQuery, Story } from "~/graphql/gql.gen";
import ListenStoryOverlay from "./ListenStoryGoButton";
import { VirtualData } from "swiper/types/components/virtual";
import { SvgChevronLeft, SvgChevronRight } from "~/assets/svg";

const LIMIT = 10;

const ListenMain: React.FC = () => {
  const [next, setNext] = useState<undefined | string>("");

  const swiperRef = useRef<{ swiper: Swiper | null }>({ swiper: null });

  // Setup swiper
  useEffect(() => {
    const swiperInstance = (swiperRef.current.swiper = new Swiper(
      "#story-feed-swiper",
      {
        spaceBetween: 0,
        slidesPerView: 1,
        virtual: { renderExternal: setVirtualData },
        on: {
          transitionEnd(swiper) {
            setCurrentSlide(swiper.activeIndex);
          },
        },
      }
    ));

    // cleanup
    return function cleanupSwiper() {
      swiperInstance.detachEvents();
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
    // FIXME: This indicate an error
    // We try to scroll backward to recover
    if (currentSlide > stories.length - 1)
      return swiperRef.current.swiper?.slidePrev(600);

    // Play the story
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
          style={{ left: `${virtualData.offset}px` }}
        >
          <ListenStoryView story={story} />
        </div>
      );
    });

    return els;
  }, [virtualData, stories]);

  return (
    <div className="h-screen-layout mx-auto max-w-xl w-full relative select-none">
      <div className="swiper-container h-full" id="story-feed-swiper">
        <div className="swiper-wrapper">{VirtualSlides}</div>
      </div>
      <button
        onClick={() => swiperRef.current.swiper?.slidePrev()}
        className="btn hidden sm:flex rounded-full absolute z-10 top-1/2 left-2 h-12 w-12"
      >
        <SvgChevronLeft />
      </button>
      <button
        onClick={() => swiperRef.current.swiper?.slideNext()}
        className="btn hidden sm:flex rounded-full absolute z-10 top-1/2 right-2 h-12 w-12"
      >
        <SvgChevronRight />
      </button>
      <ListenStoryOverlay storyFeed={stories} />
    </div>
  );
};

export default ListenMain;
