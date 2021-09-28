import {
  Children,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { View } from "react-native";
import type { Swiper as SwiperClass } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import type { PagerViewMethods, PagerViewProps } from "./types";

const PagerView = forwardRef<PagerViewMethods, PagerViewProps>(
  function PagerView({ children, style, onSelected, orientation }, ref) {
    const swiperRef = useRef<SwiperClass>();
    useImperativeHandle(
      ref,
      () => ({
        setPage(newPage) {
          swiperRef.current?.slideTo(newPage);
        },
      }),
      []
    );

    const onPageSelected = useCallback(
      (swiper: SwiperClass) => {
        onSelected?.(swiper.activeIndex);
      },
      [onSelected]
    );

    return (
      <View style={style}>
        <Swiper
          direction={orientation}
          onSlideChange={onPageSelected}
          onSwiper={(swiper: SwiperClass) => (swiperRef.current = swiper)}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ width: "100%", height: "100%" }}
          loop={false}
          slidesPerView={1}
        >
          {Children.map(children, (child) => (
            <SwiperSlide>{child}</SwiperSlide>
          ))}
          {children}
        </Swiper>
      </View>
    );
  }
);

export default PagerView;
