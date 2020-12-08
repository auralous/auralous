import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper";
import ListenStoryView from "./ListenStoryView";
import { usePlayer } from "~/components/Player";
import { useStoryFeedQuery } from "~/graphql/gql.gen";
import ListenStoryOverlay from "./ListenStoryOverlay";

const LIMIT = 10;

const ListenMain: React.FC = () => {
  const swiperRef = useRef<{ swiper: SwiperClass | null }>({ swiper: null });

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

  // Play story on scroll
  useEffect(() => {
    const swiperInstance = swiperRef.current.swiper;
    const storyFeed = data?.storyFeed;
    if (!swiperInstance || !storyFeed) return;

    playStory(storyFeed[swiperInstance.activeIndex]?.id);

    const onSlideChange: NonNullable<Swiper["onSwiper"]> = (swiper) => {
      playStory(storyFeed[swiper.activeIndex]?.id);
      if (storyFeed.length - swiper.activeIndex < 5) {
        // should start loading the next one
        setNext(storyFeed[storyFeed.length - 1].id);
      }
    };

    swiperInstance.on("slideChange", onSlideChange);
    return () => swiperInstance.off("slideChange", onSlideChange);
  }, [data, playStory]);

  return (
    <div className="h-screen-layout w-full relative overflow-hidden select-none">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current.swiper = swiper)}
        className="h-full"
      >
        {data?.storyFeed.map((story) => {
          return (
            <SwiperSlide key={story.id} className="h-screen-layout">
              <ListenStoryView story={story} />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <ListenStoryOverlay storyFeed={data?.storyFeed} />
    </div>
  );
};

export default ListenMain;
