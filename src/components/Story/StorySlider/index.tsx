import React, { useEffect, useRef, useState } from "react";
import { DialogOverlay } from "@reach/dialog";
import Swiper from "swiper/bundle";
import { VirtualData } from "swiper/types/components/virtual";
import ListenStoryView from "./StorySliderView";
import StorySliderInstruction from "./StorySliderInstruction";
import { usePlayer } from "~/components/Player";
import { Story } from "~/graphql/gql.gen";
import { SvgChevronDown } from "~/assets/svg";
import { useI18n } from "~/i18n/index";

const StorySliderContent: React.FC<{
  stories?: Story[];
  setNext: (id: string) => void;
  intialSlide: number;
}> = ({ stories, setNext, intialSlide }) => {
  const swiperRef = useRef<{ swiper: Swiper | null }>({ swiper: null });

  useEffect(
    function addSlidesToVirtualSwiper() {
      const swiper = swiperRef.current.swiper;
      if (!swiper) return;
      stories?.forEach((story) => {
        if (!swiper.virtual?.slides?.some((s: string) => s === story.id)) {
          swiper.virtual?.appendSlide(story.id);
        }
      });
    },
    [stories]
  );

  const [virtualData, setVirtualData] = useState<VirtualData | null>(null);

  const { playStory } = usePlayer();

  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (!stories?.length) return;
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
  }, [currentSlide, stories, playStory, setNext]);

  useEffect(function setUpSwiper() {
    const swiperInstance = (swiperRef.current.swiper = new Swiper(
      "#story-feed-swiper",
      {
        spaceBetween: 0,
        slidesPerView: 1,
        initialSlide: intialSlide,
        direction: "vertical",
        mousewheel: true,
        virtual: {
          slides: stories?.map((story) => story.id) || [],
          renderExternal: setVirtualData,
        },
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
      playStory("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="swiper-container h-full" id="story-feed-swiper">
      <div className="swiper-wrapper">
        {virtualData?.slides?.map((slide) => {
          const story = stories?.find((s) => s.id === slide);
          return (
            <div
              key={slide}
              className="swiper-slide h-screen-layout"
              style={{ top: `${virtualData.offset}px` }}
            >
              {story && <ListenStoryView story={story} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StorySlider: React.FC<{
  stories?: Story[];
  setNext: (id: string) => void;
  intialSlide: number;
  active: boolean;
  close(): void;
}> = ({ stories, setNext, intialSlide, active, close }) => {
  const { t } = useI18n();

  return (
    <DialogOverlay
      isOpen={active}
      style={{ zIndex: 10, backdropFilter: "blur(2px)" }}
      aria-label={t("story.feed.title")}
    >
      <div className="h-full w-full max-w-lg mx-auto relative select-none">
        <button
          className="btn absolute top-4 right-4 z-20 p-1.5 rounded-full"
          onClick={() => {
            close();
          }}
          aria-label={t("modal.close")}
        >
          <SvgChevronDown className="w-6 h-6" />
        </button>
        <StorySliderContent
          intialSlide={intialSlide}
          stories={stories}
          setNext={setNext}
        />
      </div>
      <StorySliderInstruction />
    </DialogOverlay>
  );
};

export default StorySlider;
