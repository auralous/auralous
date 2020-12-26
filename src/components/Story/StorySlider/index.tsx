import React, { useEffect, useRef, useState } from "react";
import Swiper from "swiper/bundle";
import ListenStoryView from "./StorySliderView";
import { usePlayer } from "~/components/Player";
import { useStoryFeedQuery } from "~/graphql/gql.gen";
import ListenStoryOverlay from "./StorySliderAction";
import { VirtualData } from "swiper/types/components/virtual";
import { SvgChevronLeft, SvgChevronRight } from "~/assets/svg";

const LIMIT = 10;

const StorySlider: React.FC<{ id: string }> = ({ id }) => {
  const [next, setNext] = useState<undefined | string>("");

  const swiperRef = useRef<{ swiper: Swiper | null }>({ swiper: null });

  const [virtualData, setVirtualData] = useState<VirtualData | null>(null);

  // Setup swiper
  useEffect(() => {
    const swiperInstance = (swiperRef.current.swiper = new Swiper(
      "#story-feed-swiper",
      {
        spaceBetween: 0,
        slidesPerView: 1,
        virtual: { slides: [], renderExternal: setVirtualData },
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

  useEffect(() => {
    swiperRef.current.swiper?.virtual?.removeAllSlides();
  }, [id]);

  const [
    { data: { storyFeed } = { storyFeed: undefined } },
  ] = useStoryFeedQuery({
    // pagination is not working rn
    variables: { id: id, next, limit: LIMIT },
  });

  useEffect(() => {
    const swiper = swiperRef.current.swiper;
    if (!swiper) return;
    storyFeed?.forEach((story) => {
      if (!swiper.virtual?.slides?.some((s: string) => s === story.id)) {
        swiper.virtual?.appendSlide(story.id);
      }
    });
  }, [storyFeed]);

  const { playStory } = usePlayer();

  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (!storyFeed?.length) return;
    // FIXME: This indicate an error
    // We try to scroll backward to recover
    if (currentSlide > storyFeed.length - 1)
      return swiperRef.current.swiper?.slidePrev(600);

    // Play the story
    playStory(storyFeed[currentSlide].id);

    // Load more storyFeed (pagination)
    // should start loading the next one if it is 5 slides away
    if (storyFeed.length - currentSlide < 5) {
      setNext(storyFeed[storyFeed.length - 1].id);
    }
  }, [currentSlide, storyFeed, playStory]);

  return (
    <>
      <div className="h-full w-full select-none">
        <div className="swiper-container h-full" id="story-feed-swiper">
          <div className="swiper-wrapper">
            {virtualData?.slides?.map((slide) => {
              const story = storyFeed?.find((s) => s.id === slide);
              return (
                <div
                  key={slide}
                  className="swiper-slide h-screen-layout"
                  style={{ left: `${virtualData.offset}px` }}
                >
                  {story && <ListenStoryView story={story} />}
                </div>
              );
            })}
          </div>
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
        <ListenStoryOverlay storyFeed={storyFeed} />
      </div>
    </>
  );
};

export default StorySlider;
