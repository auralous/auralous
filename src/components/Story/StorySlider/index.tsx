import { DialogOverlay } from "@reach/dialog";
import { usePlayer } from "components/Player";
import { Story } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import React, { useEffect, useRef, useState } from "react";
import { animated, config as springConfig, useSpring } from "react-spring";
import Swiper from "swiper/bundle";
import { VirtualData } from "swiper/types/components/virtual";
import StorySliderInstruction from "./StorySliderInstruction";
import StorySliderView from "./StorySliderView";

const StorySliderContent: React.FC<{
  stories?: Story[];
  setNext: (id: string) => void;
  intialSlide: number;
  close: () => void;
}> = ({ stories, setNext, intialSlide, close }) => {
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
              className="swiper-slide"
              style={{ top: `${virtualData.offset}px` }}
            >
              {story && <StorySliderView close={close} story={story} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AnimatedDialogOverlay = animated(DialogOverlay);

const StorySlider: React.FC<{
  stories?: Story[];
  setNext: (id: string) => void;
  intialSlide: number;
  active: boolean;
  close(): void;
}> = ({ stories, setNext, intialSlide, active, close }) => {
  const { t } = useI18n();

  const transitions = useSpring({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0%)" : "translateY(100%)",
    config: springConfig.slow,
  });

  return (
    <AnimatedDialogOverlay
      isOpen={active}
      style={{
        backgroundColor: "rgba(18, 18, 24)",
        opacity: transitions.opacity,
      }}
      aria-label={t("story.feed.title")}
      className="overflow-hidden z-10"
      as="div"
    >
      <animated.div
        style={{ transform: transitions.transform }}
        className="h-full w-full relative select-none"
      >
        <StorySliderContent
          intialSlide={intialSlide}
          stories={stories}
          setNext={setNext}
          close={close}
        />
      </animated.div>
      <StorySliderInstruction />
    </AnimatedDialogOverlay>
  );
};

export default StorySlider;
