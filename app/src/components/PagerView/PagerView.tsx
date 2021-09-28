import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import RNPagerView from "react-native-pager-view";
import type { PagerViewMethods, PagerViewProps } from "./types";

const PagerView = forwardRef<PagerViewMethods, PagerViewProps>(
  function PagerView({ children, style, onSelected, orientation }, ref) {
    const pagerRef = useRef<RNPagerView>(null);
    useImperativeHandle(
      ref,
      () => ({
        setPage(newPage) {
          pagerRef.current?.setPage(newPage);
        },
      }),
      []
    );

    const onPageSelected = useCallback(
      (event) => onSelected?.(event.nativeEvent.position),
      [onSelected]
    );

    return (
      <RNPagerView
        orientation={orientation}
        onPageSelected={onPageSelected}
        ref={pagerRef}
        style={style}
      >
        {children}
      </RNPagerView>
    );
  }
);

export default PagerView;
