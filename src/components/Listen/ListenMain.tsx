import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper";
import ListenStoryView from "./ListenStoryView";
import { usePlayer } from "~/components/Player";
import { useStoryFeedQuery } from "~/graphql/gql.gen";
import ListenStoryOverlay from "./ListenStoryOverlay";

const ListenMain: React.FC = () => {
  const swiperRef = useRef<{ swiper: SwiperClass | null }>({ swiper: null });

  const [{ data }] = useStoryFeedQuery();
  const { playStory } = usePlayer();

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

  useEffect(() => {
    const swiperInstance = swiperRef.current.swiper;
    const storyFeed = data?.storyFeed;
    if (!swiperInstance || !storyFeed) return;

    playStory(storyFeed[swiperInstance.activeIndex]?.id);

    const onSlideChange: NonNullable<Swiper["onSwiper"]> = (swiper) => {
      playStory(storyFeed[swiper.activeIndex]?.id);
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
