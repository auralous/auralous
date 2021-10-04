import { scrollTo } from "@/utils/animation";
import type { ReactElement } from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  FlatListProps,
  LayoutChangeEvent,
  ListRenderItem,
  ListRenderItemInfo,
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
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  useWorkletCallback,
  withTiming,
} from "react-native-reanimated";

const Context = createContext(
  {} as {
    activeCellSizeValue: number | undefined;
    scrollOffset: Animated.SharedValue<number>;
    activeIndexAnim: Animated.SharedValue<number>;
    spacerIndexAnim: Animated.SharedValue<number>;
    hoverOffset: Animated.SharedValue<number>;
    hasMoved: Animated.SharedValue<boolean>;
    drag(index: number): void;
    getCellMeasurement(index: number): GetItemLayoutResult;
  }
);

const styles = StyleSheet.create({ list: { flex: 1, overflow: "hidden" } });

export interface DraggableListRenderItemInfo<ItemT>
  extends ListRenderItemInfo<ItemT> {
  drag(): void;
}

export type DraggableListRenderItem<ItemT> = (
  info: DraggableListRenderItemInfo<ItemT>
) => ReactElement;

type DraggableListProps<ItemT> = Omit<
  FlatListProps<ItemT>,
  "renderItem" | "keyExtractor" | "itemHeight"
> & {
  onDragEnd(from: number, to: number): void;
  renderItem: DraggableListRenderItem<ItemT>;
  keyExtractor: NonNullable<FlatListProps<ItemT>["keyExtractor"]>;
  getItemLayout: NonNullable<FlatListProps<ItemT>["getItemLayout"]>;
};

type GetItemLayoutResult = ReturnType<
  NonNullable<FlatListProps<any>["getItemLayout"]>
>;

interface DraggableItemProps<ItemT> {
  info: ListRenderItemInfo<ItemT>;
  renderItem: DraggableListRenderItem<ItemT>;
}

function ClonedDraggableItem<ItemT>({
  info,
  renderItem,
}: DraggableItemProps<ItemT>) {
  const { hoverOffset, hasMoved } = useContext(Context);

  const drag = useCallback(() => {
    // noop
  }, []);

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      width: "100%",
      top: hoverOffset.value,
      zIndex: 1,
      opacity: 0.5,
      transform: hasMoved.value ? undefined : [{ scale: 0 }],
    };
  }, []);

  return (
    <Animated.View style={style}>{renderItem({ ...info, drag })}</Animated.View>
  );
}

function DraggableItem<ItemT>({ info, renderItem }: DraggableItemProps<ItemT>) {
  const {
    activeIndexAnim,
    spacerIndexAnim,
    drag: setDragging,
    hoverOffset,
    hasMoved,
    scrollOffset,
    getCellMeasurement,
    activeCellSizeValue,
  } = useContext(Context);

  const cellMeasurement = useMemo(
    () => getCellMeasurement(info.index),
    [getCellMeasurement, info.index]
  );

  // Distance between active cell and edge of scroll view
  const cellOffset = useDerivedValue(
    () => cellMeasurement.offset,
    [info.index, cellMeasurement]
  );
  const cellSize = useDerivedValue(
    () => cellMeasurement.length,
    [cellMeasurement.length]
  );
  const cellIndex = useDerivedValue(() => info.index, [info.index]);

  const isActiveCell = useDerivedValue(() => {
    return cellIndex.value === activeIndexAnim.value;
  });

  useAnimatedReaction(
    () => {
      // Do not calculate before moving and if is active cell
      if (!hasMoved.value || isActiveCell.value) return -1;
      // Can't measure active cellSize
      if (!activeCellSizeValue) return -1;
      // Distance between hovering cell and edge of scroll view
      const hoverOffsetValue = hoverOffset.value + scrollOffset.value;
      const hoverPlusActiveSize = hoverOffsetValue + activeCellSizeValue;

      const isAfterActive = cellIndex.value > activeIndexAnim.value;
      const isBeforeActive = cellIndex.value < activeIndexAnim.value;

      const offsetPlusHalfSize = cellOffset.value + cellSize.value / 2;
      const offsetPlusSize = cellOffset.value + cellSize.value;

      let desiredSpacerAnim = -1;
      if (isAfterActive) {
        if (
          hoverPlusActiveSize >= cellOffset.value &&
          hoverPlusActiveSize < offsetPlusHalfSize
        ) {
          // bottom edge of active cell overlaps top half of current cell
          desiredSpacerAnim = cellIndex.value - 1;
        } else if (
          hoverPlusActiveSize >= offsetPlusHalfSize &&
          hoverPlusActiveSize < offsetPlusSize
        ) {
          // bottom edge of active cell overlaps bottom half of current cell
          // This will push the current cell up later
          desiredSpacerAnim = cellIndex.value;
        }
      } else if (isBeforeActive) {
        if (
          hoverOffsetValue < offsetPlusSize &&
          hoverOffsetValue >= offsetPlusHalfSize
        ) {
          // top edge of active cell overlaps bottom half of current cell
          desiredSpacerAnim = cellIndex.value + 1;
        } else if (
          hoverOffsetValue >= cellOffset.value &&
          hoverOffsetValue < offsetPlusHalfSize
        ) {
          // top edge of active cell overlaps top half of current cell
          // This will push the current cell down later
          desiredSpacerAnim = cellIndex.value;
        }
      }
      return desiredSpacerAnim;
    },
    (desiredSpacerAnim) => {
      if (
        desiredSpacerAnim !== -1 &&
        desiredSpacerAnim !== spacerIndexAnim.value
      ) {
        spacerIndexAnim.value = desiredSpacerAnim;
      }
    },
    [activeCellSizeValue]
  );

  const translateValue = useSharedValue(0);

  useAnimatedReaction(
    () => {
      if (isActiveCell.value) return null;
      if (!activeCellSizeValue) return null;
      const isAfterActive = cellIndex.value > activeIndexAnim.value;
      const shouldTranslate = isAfterActive
        ? cellIndex.value <= spacerIndexAnim.value
        : cellIndex.value >= spacerIndexAnim.value;
      return shouldTranslate
        ? activeCellSizeValue * (isAfterActive ? -1 : 1)
        : 0;
    },
    (isActiveCellValue) => {
      if (typeof isActiveCellValue === "number")
        translateValue.value = withTiming(isActiveCellValue);
    },
    [activeCellSizeValue]
  );

  const drag = useCallback(() => {
    setDragging(info.index);
  }, [info.index, setDragging]);

  const style = useAnimatedStyle(() => {
    return {
      width: "100%",
      transform: [{ translateY: translateValue.value }],
      opacity: isActiveCell.value && hasMoved.value ? 0 : 1,
    };
  }, []);

  return (
    <Animated.View style={style}>{renderItem({ ...info, drag })}</Animated.View>
  );
}

const MemoizedDraggableItem = memo(DraggableItem);

const autoscrollSpeed = 10;
const autoscrollThreshold = 30;
const SCROLL_POSITION_TOLERANCE = 2;

export default function DraggableList<ItemT>({
  renderItem: renderItemProp,
  onDragEnd,
  onScroll: onScrollProp,
  onContentSizeChange: onContentSizeChangeProp,
  keyExtractor,
  getItemLayout,
  style,
  data,
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
      containerSize.value = event.nativeEvent.layout.height;
    },
    [containerSize]
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

  const panRef = useRef<PanGestureHandler>(null);

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

  // const autoScrollTargetOffset = useSharedValue(-1);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScrollProp?.(event);
      scrollOffset.value = event.nativeEvent.contentOffset.y;
      // if (autoScrollTargetOffset.value !== -1) {
      //   if (
      //     Math.abs(autoScrollTargetOffset.value - scrollOffset.value) <=
      //     SCROLL_POSITION_TOLERANCE
      //   ) {
      //     autoScrollTargetOffset.value = -1;
      //   }
      // }
    },
    [onScrollProp, scrollOffset]
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
      ); // must be greater than 0 while < max scroll offset

      if (
        Math.abs(calculatedTargetOffset - scrollOffsetValue) <
        SCROLL_POSITION_TOLERANCE
      )
        return;

      // autoScrollTargetOffset.value = calculatedTargetOffset;
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
        if (!isHovering.value) return;
        if (!activeCellMeasurement) return;
        if (hasMoved.value === false) {
          // We cannot use onStart because it is fired before activeIndex is set
          // so we workaround by depending on hasMoved
          touchInset.value =
            event.y - (activeCellMeasurement.offset - scrollOffset.value); // Distance from touch to the edge of active cell
          hasMoved.value = true;
        }
        touchAbsolute.value = event.y;
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
    [onDragEnd, clearAnimState, activeCellMeasurement]
  );

  const renderItem: ListRenderItem<ItemT> = useCallback(
    (info) => {
      return (
        <MemoizedDraggableItem
          key={keyExtractor(info.item, info.index)}
          info={info}
          renderItem={renderItemProp as any}
        />
      );
    },
    [renderItemProp, keyExtractor]
  );

  return (
    <Context.Provider
      value={{
        drag,
        activeCellSizeValue: activeCellMeasurement?.length,
        activeIndexAnim,
        spacerIndexAnim,
        hoverOffset,
        scrollOffset,
        hasMoved,
        getCellMeasurement,
      }}
    >
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={eventHandler}
        maxPointers={1}
      >
        <Animated.View style={style} onLayout={onContainerLayout}>
          {activeIndex !== -1 && data?.[activeIndex] && (
            <ClonedDraggableItem
              info={{
                index: activeIndex,
                // FIXME: Support separators
                separators: undefined as unknown as any,
                item: data[activeIndex],
              }}
              renderItem={renderItemProp}
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
            scrollEnabled={!scrollDisabled}
          />
        </Animated.View>
      </PanGestureHandler>
    </Context.Provider>
  );
}
