import React, { useEffect, useMemo, useRef, useState } from "react";
import Swiper from "swiper/bundle";
import ListenStoryView from "./ListenStoryView";
import { usePlayer } from "~/components/Player";
import { useStoryFeedQuery } from "~/graphql/gql.gen";
import ListenStoryOverlay from "./ListenStoryOverlay";
import { VirtualData } from "swiper/types/components/virtual";

const LIMIT = 10;

const ListenMain: React.FC = () => {
  const swiperRef = useRef<{ swiper: Swiper | null }>({ swiper: null });

  const [next, setNext] = useState<undefined | string>("");

  const [{ data }] = useStoryFeedQuery({
    // skip is noop, only to work around simple pagination
    variables: { id: "PUBLIC", next, limit: LIMIT },
  });

  const { playStory } = usePlayer();

  // Scroll by keyboard
  useEffect(() => {
    // scroll by keyboard
    const onKeyPress = (e: KeyboardEvent) => {
      const swiperInstance = swiperRef.current.swiper;
      if (!swiperInstance) return;
      if (e.key === "ArrowRight") swiperInstance.slideNext();
      else if (e.key === "ArrowLeft") swiperInstance.slidePrev();
    };
    document.addEventListener("keydown", onKeyPress, true);
    return () => document.removeEventListener("keydown", onKeyPress);
  }, []);

  const [virtualData, setVirtualData] = useState<VirtualData | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (!currentSlide) return;
    const storyFeed = data?.storyFeed;
    if (!storyFeed) return;
    playStory(storyFeed[currentSlide].id);

    // Load more stories (pagination)
    // should start loading the next one if it is 5 slides away
    if (storyFeed.length - currentSlide < 5) {
      setNext(storyFeed[storyFeed.length - 1].id);
    }
  }, [currentSlide, data, playStory]);

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

    // update virtual slides
    data?.storyFeed.forEach((s) => {
      if (!swiperInstance.virtual.slides.includes(s.id))
        swiperInstance.virtual.appendSlide(s.id);
    });
  }, [playStory, data?.storyFeed]);

  const VirtualSlides = useMemo(() => {
    const els: JSX.Element[] = [];
    if (!virtualData || !data?.storyFeed.length) return els;

    virtualData.slides.forEach((slide: string) => {
      const story = data.storyFeed.find((s) => s.id === slide);
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
  }, [virtualData, data?.storyFeed]);

  return (
    <div className="h-screen-layout w-full relative overflow-hidden select-none">
      <div className="swiper-container h-full" id="story-feed-swiper">
        <div className="swiper-wrapper">{VirtualSlides}</div>
      </div>
      <ListenStoryOverlay storyFeed={data?.storyFeed} />
    </div>
  );
};

export default ListenMain;
