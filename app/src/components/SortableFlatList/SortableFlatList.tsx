import { scrollTo } from "@/styles/animation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type {
  LayoutChangeEvent,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { FlatList, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
  useWorkletCallback,
} from "react-native-reanimated";
import ClonedItem from "./ClonedItem";
import { SortableContext } from "./SortableContext";
import SortableItem from "./SortableItem";
import type { DraggableListProps, GetItemLayoutResult } from "./types";

const styles = StyleSheet.create({ list: { flex: 1, overflow: "hidden" } });

const MemoizedSortableItem = memo(
  SortableItem,
  (prevProps, nextProps) =>
    prevProps.info.index === nextProps.info.index &&
    prevProps.info.item === prevProps.info.item &&
    prevProps.info.separators === prevProps.info.separators
);

const autoscrollSpeed = 10;
const autoscrollThreshold = 30;
const SCROLL_POSITION_TOLERANCE = 2;

export default function SortableFlatList<ItemT>({
  renderItem: renderItemProp,
  onDragEnd,
  onScroll: onScrollProp,
  onContentSizeChange: onContentSizeChangeProp,
  keyExtractor,
  getItemLayout,
  style,
  data,
  horizontal,
  ...props
}: DraggableListProps<ItemT>) {
  const getCellMeasurement = useMemo(() => {
    const measurementCache = new Map<number, GetItemLayoutResult>();
    return (index: number) => {
      if (measurementCache.has(index)) {
        return measurementCache.get(index) as GetItemLayoutResult;
      }
      const measured = getItemLayout(data as ItemT[] | null | undefined, index);
      measurementCache.set(index, measured);
      return measured;
    };
  }, [getItemLayout, data]);

  const containerSize = useSharedValue(0);
  const onContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      containerSize.value =
        event.nativeEvent.layout[horizontal ? "width" : "height"];
    },
    [containerSize, horizontal]
  );

  const touchAbsolute = useSharedValue(0); // Finger position on screen, relative to container (not scroll view)

  const touchInset = useSharedValue(0); // Distance from touch to the edge of cell

  const hasMoved = useSharedValue(false);

  const [activeIndex, setActiveIndex] = useState(-1);

  const activeIndexAnim = useSharedValue(-1); // Index of hovering cell
  const spacerIndexAnim = useSharedValue(-1); // Index of hovered-over cell

  const isHovering = useDerivedValue(() => {
    return activeIndexAnim.value > -1;
  }, []);

  const activeCellMeasurement = useMemo(() => {
    if (activeIndex === -1) return null;
    else return getCellMeasurement(activeIndex);
  }, [getCellMeasurement, activeIndex]);

  const scrollRef = useAnimatedRef<ScrollView>();

  const scrollOffset = useSharedValue(0);

  const scrollContentSize = useSharedValue(0);
  const onContentSizeChange = useCallback(
    (w: number, h: number) => {
      onContentSizeChangeProp?.(w, h);
      scrollContentSize.value = h;
    },
    [onContentSizeChangeProp, scrollContentSize]
  );

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScrollProp?.(event);
      scrollOffset.value =
        event.nativeEvent.contentOffset[horizontal ? "x" : "y"];
    },
    [onScrollProp, scrollOffset, horizontal]
  );

  // Prevent user scrolling while dragging
  const [scrollDisabled, setScrollDisabled] = useState(false);
  useAnimatedReaction(
    () => activeIndexAnim.value,
    (activeIndexAnimValue) => {
      runOnJS(setScrollDisabled)(activeIndexAnimValue !== -1);
    },
    []
  );

  // Distance between hovering cell and container
  const hoverOffset = useDerivedValue(() => {
    return touchAbsolute.value - touchInset.value;
  }, []);

  // AutoScroll
  useAnimatedReaction(
    () => {
      return {
        hoverOffsetValue: hoverOffset.value,
        scrollOffsetValue: scrollOffset.value,
        containerSizeValue: containerSize.value,
        scrollContentSizeValue: scrollContentSize.value,
        // autoScrollTargetOffsetValue: autoScrollTargetOffset.value,
      };
    },
    ({
      hoverOffsetValue,
      scrollOffsetValue,
      containerSizeValue,
      scrollContentSizeValue,
      // autoScrollTargetOffsetValue,
    }) => {
      if (!hasMoved.value || !activeCellMeasurement) return;
      // if (autoScrollTargetOffsetValue !== -1) return;

      let scrollDelta = 0;

      const hoverOffsetEndValue =
        hoverOffsetValue + activeCellMeasurement.length;

      if (hoverOffsetValue <= autoscrollThreshold) {
        // Should scroll up
        scrollDelta =
          ((hoverOffsetValue - autoscrollThreshold) / autoscrollThreshold) *
          autoscrollSpeed;
      } else if (
        hoverOffsetEndValue >=
        containerSizeValue - autoscrollThreshold
      ) {
        // Should scroll down
        scrollDelta =
          ((hoverOffsetEndValue - (containerSizeValue - autoscrollThreshold)) /
            autoscrollThreshold) *
          autoscrollSpeed;
      } else {
        return;
      }

      const calculatedTargetOffset = Math.min(
        Math.max(0, scrollOffsetValue + scrollDelta),
        scrollContentSizeValue - containerSizeValue
      );

      if (
        Math.abs(calculatedTargetOffset - scrollOffsetValue) <
        SCROLL_POSITION_TOLERANCE
      )
        return;
      scrollTo(scrollRef, 0, calculatedTargetOffset, false);
    },
    [activeCellMeasurement]
  );

  const drag = useCallback(
    (index: number) => {
      setActiveIndex(index);
      spacerIndexAnim.value = index;
      activeIndexAnim.value = index;
    },
    [spacerIndexAnim, activeIndexAnim]
  );

  const clearAnimState = useWorkletCallback(() => {
    runOnJS(setActiveIndex)(-1);
    hasMoved.value = false;
    touchAbsolute.value = -1;
    activeIndexAnim.value = -1;
    spacerIndexAnim.value = -1;
    touchInset.value = 0;
  }, []);

  useEffect(clearAnimState, [data, clearAnimState]);

  const eventHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
    {
      onActive: (event) => {
        const eventPos = horizontal ? event.x : event.y;
        if (!isHovering.value) return;
        if (!activeCellMeasurement) return;
        if (hasMoved.value === false) {
          // We cannot use onStart because it is fired before activeIndex is set
          // so we workaround by depending on hasMoved
          touchInset.value =
            eventPos - (activeCellMeasurement.offset - scrollOffset.value); // Distance from touch to the edge of active cell
          hasMoved.value = true;
        }
        touchAbsolute.value = eventPos;
      },
      // BEGAN ------> ACTIVE ------> END
      onEnd: () => {
        if (!hasMoved.value) return;
        const from = activeIndexAnim.value;
        const to = spacerIndexAnim.value;
        if (from !== -1 && to !== -1) {
          runOnJS(onDragEnd)(from, to);
        }
      },
      // BEGAN ------> FAILED
      // onFail(event, context) {},
      // BEGAN ------> ACTIVE ------> CANCELLED
      // onCancel(event, context) {},
      // BEGAN ------> ANY ------> FINISHED
      onFinish: clearAnimState,
    },
    [onDragEnd, clearAnimState, activeCellMeasurement, horizontal]
  );

  const renderItem: ListRenderItem<ItemT> = useCallback((info) => {
    return <MemoizedSortableItem info={info} />;
  }, []);

  return (
    <SortableContext.Provider
      value={{
        drag,
        activeCellSizeValue: activeCellMeasurement?.length,
        activeIndexAnim,
        spacerIndexAnim,
        hoverOffset,
        scrollOffset,
        hasMoved,
        getCellMeasurement,
        horizontal,
        sortableRenderItem: renderItemProp,
      }}
    >
      <PanGestureHandler onGestureEvent={eventHandler} maxPointers={1}>
        <Animated.View style={style} onLayout={onContainerLayout}>
          {activeIndex !== -1 && data?.[activeIndex] && (
            <ClonedItem
              info={{
                index: activeIndex,
                item: data[activeIndex],
              }}
            />
          )}
          <FlatList
            {...props}
            // @ts-ignore
            ref={scrollRef}
            data={data}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            renderItem={renderItem}
            onScroll={onScroll}
            onContentSizeChange={onContentSizeChange}
            style={styles.list}
            horizontal={horizontal}
            scrollEnabled={!scrollDisabled}
          />
        </Animated.View>
      </PanGestureHandler>
    </SortableContext.Provider>
  );
}
