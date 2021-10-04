import { scrollTo } from "@/utils/animation";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { StyleSheet } from "react-native";
import type {
  BigListProps,
  BigListRenderItem,
  BigListRenderItemInfo,
} from "react-native-big-list";
import BigList from "react-native-big-list";
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { PanGestureHandler, ScrollView } from "react-native-gesture-handler";
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
    scrollOffset: Animated.SharedValue<number>;
    activeIndexAnim: Animated.SharedValue<number>;
    spacerIndexAnim: Animated.SharedValue<number>;
    activeCellSize: Animated.SharedValue<number>;
    hoverOffset: Animated.SharedValue<number>;
    hasMoved: Animated.SharedValue<boolean>;
    drag(index: number): void;
  }
);

const styles = StyleSheet.create({ list: { flex: 1, overflow: "hidden" } });

export interface DraggableBigListRenderItemInfo<ItemT>
  extends BigListRenderItemInfo<ItemT> {
  drag(): void;
}

export type DraggableBigListRenderItem<ItemT> = (
  info: DraggableBigListRenderItemInfo<ItemT>
) => JSX.Element | JSX.Element[] | null;

type DraggableBigListProps<ItemT> = Omit<
  BigListProps<ItemT>,
  "renderItem" | "keyExtractor" | "itemHeight"
> & {
  onDragEnd(from: number, to: number): void;
  renderItem: DraggableBigListRenderItem<ItemT>;
  keyExtractor: NonNullable<BigListProps<ItemT>["keyExtractor"]>;
  itemHeight: number;
};

interface DraggableItemProps<ItemT> {
  info: BigListRenderItemInfo<ItemT>;
  renderItem: DraggableBigListRenderItem<ItemT>;
  itemHeight: number;
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
      // because display: none does not work
      // https://stackoverflow.com/questions/47378068/using-display-none-instead-of-condition-state-rendering
      transform: hasMoved.value ? undefined : [{ scale: 0 }],
    };
  }, []);

  return (
    <Animated.View style={style}>{renderItem({ ...info, drag })}</Animated.View>
  );
}

function DraggableItem<ItemT>({
  info,
  renderItem,
  itemHeight,
}: DraggableItemProps<ItemT>) {
  const {
    activeIndexAnim,
    spacerIndexAnim,
    drag: setDragging,
    activeCellSize,
    hoverOffset,
    hasMoved,
    scrollOffset,
  } = useContext(Context);

  // Distance between active cell and edge of scroll view
  const cellOffset = useDerivedValue(
    () => info.index * itemHeight,
    [info.index, itemHeight]
  );
  const cellSize = useDerivedValue(() => itemHeight, [itemHeight]);
  const cellIndex = useDerivedValue(() => info.index, [info.index]);

  const isActiveCell = useDerivedValue(() => {
    return cellIndex.value === activeIndexAnim.value;
  });

  useAnimatedReaction(
    () => {
      // Do not calculate before moving and if is active cell
      if (!hasMoved.value || isActiveCell.value) return -1;
      // Distance between hovering cell and edge of scroll view
      const hoverOffsetValue = hoverOffset.value + scrollOffset.value;
      const hoverPlusActiveSize = hoverOffsetValue + activeCellSize.value;

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
    []
  );

  const translateValue = useSharedValue(0);

  useAnimatedReaction(
    () => {
      if (isActiveCell.value) return null;
      const isAfterActive = cellIndex.value > activeIndexAnim.value;
      const shouldTranslate = isAfterActive
        ? cellIndex.value <= spacerIndexAnim.value
        : cellIndex.value >= spacerIndexAnim.value;
      return shouldTranslate
        ? activeCellSize.value * (isAfterActive ? -1 : 1)
        : 0;
    },
    (isActiveCellValue) => {
      if (typeof isActiveCellValue === "number")
        translateValue.value = withTiming(isActiveCellValue);
    },
    []
  );

  const drag = useCallback(() => {
    setDragging(info.index);
  }, [info.index, setDragging]);

  const style = useAnimatedStyle(() => {
    return {
      width: "100%",
      transform: [{ translateY: translateValue.value }],
      opacity: isActiveCell.value ? 0.5 : 1,
      display: isActiveCell.value && hasMoved.value ? "none" : "flex",
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

export default function DraggableBigList<ItemT>({
  renderItem: renderItemProp,
  onDragEnd,
  onScroll: onScrollProp,
  keyExtractor,
  style,
  ...props
}: DraggableBigListProps<ItemT>) {
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

  // Height or width of active cell
  const activeCellSize = useDerivedValue(
    () => props.itemHeight, // FIXME: force casted
    [props.itemHeight]
  );

  // Distance between active cell and edge of scroll view
  const activeCellOffset = useDerivedValue(() => {
    if (!isHovering.value) return 0;
    return activeIndexAnim.value * activeCellSize.value;
  }, []);

  const panRef = useRef<PanGestureHandler>(null);

  const scrollRef = useAnimatedRef();

  const scrollOffset = useSharedValue(0);

  const scrollContentSize = (props.data?.length || 0) * props.itemHeight;

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
        activeCellSizeValue: activeCellSize.value,
        containerSizeValue: containerSize.value,
        // autoScrollTargetOffsetValue: autoScrollTargetOffset.value,
      };
    },
    ({
      hoverOffsetValue,
      scrollOffsetValue,
      activeCellSizeValue,
      containerSizeValue,
      // autoScrollTargetOffsetValue,
    }) => {
      if (!hasMoved.value) return;
      // if (autoScrollTargetOffsetValue !== -1) return;

      let scrollDelta = 0;

      const hoverOffsetEndValue = hoverOffsetValue + activeCellSizeValue;

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
        scrollContentSize - containerSizeValue
      ); // must be greater than 0 while < max scroll offset

      if (
        Math.abs(calculatedTargetOffset - scrollOffsetValue) <
        SCROLL_POSITION_TOLERANCE
      )
        return;

      // autoScrollTargetOffset.value = calculatedTargetOffset;

      scrollTo(
        // @ts-ignore
        scrollRef,
        0,
        calculatedTargetOffset,
        false
      );
    },
    [scrollContentSize]
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

  useEffect(clearAnimState, [props.data, clearAnimState]);

  const eventHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
    {
      onActive: (event) => {
        if (!isHovering.value) return;
        if (hasMoved.value === false) {
          // We cannot use onStart because it is fired before activeIndex is set
          // so we workaround by depending on hasMoved
          touchInset.value =
            event.y - (activeCellOffset.value - scrollOffset.value); // Distance from touch to the edge of active cell
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
    [onDragEnd, clearAnimState]
  );

  const renderItem: BigListRenderItem<ItemT> = useCallback(
    (info) => {
      return (
        <MemoizedDraggableItem
          key={keyExtractor(info.item, info.index)}
          info={info}
          renderItem={renderItemProp as any}
          itemHeight={props.itemHeight}
        />
      );
    },
    [renderItemProp, keyExtractor, props.itemHeight]
  );

  return (
    <Context.Provider
      value={{
        drag,
        activeIndexAnim,
        spacerIndexAnim,
        activeCellSize,
        hoverOffset,
        scrollOffset,
        hasMoved,
      }}
    >
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={eventHandler}
        maxPointers={1}
      >
        <Animated.View style={style} onLayout={onContainerLayout}>
          {activeIndex !== -1 && props.data?.[activeIndex] && (
            <ClonedDraggableItem
              info={{
                index: activeIndex,
                // FIXME: Support separators
                separators: undefined as unknown as any,
                item: props.data[activeIndex],
              }}
              renderItem={renderItemProp}
              itemHeight={props.itemHeight}
            />
          )}
          <BigList
            {...props}
            ref={(ref) => {
              // @ts-ignore
              if (ref) scrollRef(ref.getNativeScrollRef());
            }}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={onScroll}
            style={styles.list}
            scrollEnabled={!scrollDisabled}
            // @ts-ignore
            ScrollView={ScrollView}
          />
        </Animated.View>
      </PanGestureHandler>
    </Context.Provider>
  );
}
