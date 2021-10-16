import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { View } from "react-native";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import type { PagerViewMethods, PagerViewProps } from "./types";

const PagerView = forwardRef<PagerViewMethods, PagerViewProps>(
  function PagerView({ children, style, onSelected, orientation }, ref) {
    const swiperRef = useRef<SwiperClass>();

    const firstOnPageSelected = useRef(false);

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

    useEffect(() => {
      if (Children.count(children) > 0 && !firstOnPageSelected.current) {
        onSelected?.(0);
        firstOnPageSelected.current = true;
      }
    }, [children, onSelected]);

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
