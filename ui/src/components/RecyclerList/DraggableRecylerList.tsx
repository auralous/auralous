// Inspired by https://github.com/computerjazz/react-native-draggable-flatlist
import {
  createContext,
  createRef,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { LayoutChangeEvent, ScrollViewProps, StyleSheet } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  ScrollView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BaseScrollView, RecyclerListView } from "recyclerlistview";
import RecyclerList, {
  RecyclerListProps,
  RecyclerRenderItem,
  RecyclerRenderItemInfo,
} from "./RecyclerList";

class ExternalScrollView extends BaseScrollView {
  scrollViewRef = createRef<ScrollView>();

  scrollTo(scrollInput: { x: number; y: number; animated: boolean }) {
    this.scrollViewRef.current?.scrollTo(scrollInput);
  }

  render() {
    return (
      // @ts-ignore
      <ScrollView {...this.props} ref={this.scrollViewRef}>
        {this.props.children}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({ list: { flex: 1 } });

const Context = createContext(
  {} as {
    scrollOffset: Animated.SharedValue<number>;
    activeIndexAnim: Animated.SharedValue<number>;
    spacerIndexAnim: Animated.SharedValue<number>;
    activeCellSize: Animated.SharedValue<number>;
    hoverOffset: Animated.SharedValue<number>;
    hoverTranslate: Animated.SharedValue<number>;
    hasMoved: Animated.SharedValue<boolean>;
    drag(index: number): void;
  }
);

export interface DraggableRecyclerRenderItemInfo<ItemT>
  extends RecyclerRenderItemInfo<ItemT> {
  drag(): void;
}

export type DraggableRecyclerRenderItem<ItemT> = (
  info: DraggableRecyclerRenderItemInfo<ItemT>
) => JSX.Element | JSX.Element[] | null;

type DraggableRecyclerListProps<ItemT> = Omit<
  RecyclerListProps<ItemT>,
  "renderItem"
> & {
  onDragEnd(from: number, to: number): void;
  renderItem: DraggableRecyclerRenderItem<ItemT>;
  keyExtractor(item: ItemT): string;
};

function DraggableItem<ItemT>({
  index,
  item,
  renderItem,
  height,
}: {
  index: number;
  item: ItemT;
  renderItem: DraggableRecyclerRenderItem<ItemT>;
  height: number;
}) {
  const {
    activeIndexAnim,
    spacerIndexAnim,
    drag: setDragging,
    activeCellSize,
    hoverOffset,
    hasMoved,
    hoverTranslate,
    scrollOffset,
  } = useContext(Context);

  // Distance between active cell and edge of scroll view
  const cellOffset = useDerivedValue(() => index * height, [index, height]);
  const cellSize = useDerivedValue(() => height, [height]);
  const cellIndex = useDerivedValue(() => index, [index]);

  const isActiveCell = useDerivedValue(() => {
    return cellIndex.value === activeIndexAnim.value;
  });

  useAnimatedReaction(
    () => {
      if (!hasMoved.value) return -1;
      // Distance between hovering cell and edge of scroll view
      const hoverOffsetValue = hoverOffset.value + scrollOffset.value;
      const hoverPlusActiveSize = hoverOffsetValue + activeCellSize.value;

      const isAfterActive = index > activeIndexAnim.value;
      const isBeforeActive = index < activeIndexAnim.value;

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
    [index]
  );

  const translateValue = useSharedValue(0);

  useAnimatedReaction(
    () => {
      if (isActiveCell.value) {
        return { isActiveCellValue: true, translate: hoverTranslate.value };
      }
      const isAfterActive = cellIndex.value > activeIndexAnim.value;
      const shouldTranslate = isAfterActive
        ? cellIndex.value <= spacerIndexAnim.value
        : cellIndex.value >= spacerIndexAnim.value;
      return {
        isActiveCellValue: false,
        translate: shouldTranslate
          ? activeCellSize.value * (isAfterActive ? -1 : 1)
          : 0,
      };
    },
    ({ isActiveCellValue, translate }) => {
      if (isActiveCellValue) translateValue.value = translate;
      else translateValue.value = withTiming(translate);
    },
    []
  );

  const drag = useCallback(() => {
    setDragging(index);
  }, [index, setDragging]);

  const style = useAnimatedStyle(() => {
    return {
      width: "100%",
      transform: [{ translateY: translateValue.value }],
      zIndex: isActiveCell.value ? 1 : 0,
      opacity: isActiveCell.value ? 0.5 : 1,
    };
  });

  return (
    <Animated.View style={style}>
      {renderItem({ item, index, drag })}
    </Animated.View>
  );
}

const MemoizedDraggableItem = memo(DraggableItem);

const autoscrollSpeed = 20;
const autoscrollThreshold = 30;

export default function DraggableRecyclerList<ItemT>({
  height,
  onEndReached,
  renderItem,
  data,
  style,
  contentContainerStyle,
  contentHorizontalPadding = 0,
  ListEmptyComponent,
  onDragEnd,
  keyExtractor,
}: DraggableRecyclerListProps<ItemT>) {
  const containerSize = useSharedValue(0);
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      containerSize.value = event.nativeEvent.layout.height;
    },
    [containerSize]
  );

  const touchAbsolute = useSharedValue(0); // Finger position on screen, relative to container (not scroll view)

  const touchInset = useSharedValue(0); // Distance from touch to the edge of cell
  const initialScrollOffset = useSharedValue(0); // Scroll offset when start dragging

  const hasMoved = useSharedValue(false);

  const activeIndexAnim = useSharedValue(-1); // Index of hovering cell
  const spacerIndexAnim = useSharedValue(-1); // Index of hovered-over cell

  const isHovering = useDerivedValue(() => {
    return activeIndexAnim.value > -1;
  });

  // Height or width of active cell
  const activeCellSize = useSharedValue(height);
  activeCellSize.value = height;

  // Distance between active cell and edge of scroll view
  const activeCellOffset = useDerivedValue(() => {
    if (!isHovering.value) return 0;
    return activeIndexAnim.value * height;
  }, [activeIndexAnim, height]);

  const scrollRef = useAnimatedRef<RecyclerListView<any, any>>();
  const scrollOffset = useSharedValue(0);
  const scrollViewSize = useSharedValue(0);

  const onScroll = useCallback(
    (rawEvent: unknown, offsetX: number, offsetY: number) => {
      scrollOffset.value = offsetY;
    },
    [scrollOffset]
  );

  // Prevent user scrolling while dragging
  const [scrollDisabled, setScrollDisabled] = useState(false);
  useAnimatedReaction(
    () => activeIndexAnim.value,
    (activeIndexAnimValue) => {
      runOnJS(setScrollDisabled)(activeIndexAnimValue !== -1);
    },
    [activeIndexAnim]
  );

  const scrollViewProps = useMemo<ScrollViewProps>(
    () => ({
      scrollEnabled: !scrollDisabled,
      onLayout: (event) => {
        scrollViewSize.value = event.nativeEvent.layout.height;
      },
    }),
    [scrollDisabled, scrollViewSize]
  );

  // Distance between hovering cell and container
  const hoverOffset = useDerivedValue(() => {
    return touchAbsolute.value - touchInset.value;
  });

  const hoverTranslateBeforeOffset = useSharedValue(0);
  // hoverTranslate but also take account into scroll offset
  const hoverTranslate = useDerivedValue(() => {
    return (
      hoverTranslateBeforeOffset.value +
      (scrollOffset.value - initialScrollOffset.value)
    );
  });

  const drag = useCallback(
    (index: number) => {
      spacerIndexAnim.value = index;
      activeIndexAnim.value = index;
    },
    [spacerIndexAnim, activeIndexAnim]
  );

  // AutoScroll
  useAnimatedReaction(
    () => {
      return {
        touchAbsoluteValue: touchAbsolute.value,
        scrollOffsetValue: scrollOffset.value,
        scrollRef: scrollRef,
      };
    },
    ({ touchAbsoluteValue, scrollOffsetValue, scrollRef }) => {
      if (!hasMoved.value) return;
      let scrollDelta = 0;
      if (touchAbsoluteValue <= autoscrollThreshold) {
        // Should scroll up
        scrollDelta =
          ((touchAbsoluteValue - autoscrollThreshold) / autoscrollThreshold) *
          autoscrollSpeed;
      } else if (
        touchAbsoluteValue >=
        containerSize.value - autoscrollThreshold
      ) {
        // Should scroll down
        scrollDelta =
          ((touchAbsoluteValue - (containerSize.value - autoscrollThreshold)) /
            autoscrollThreshold) *
          autoscrollSpeed;
      } else {
        return;
      }
      scrollTo(
        // @ts-ignore
        scrollRef,
        0,
        scrollOffsetValue + scrollDelta,
        false
      );
    }
  );

  const eventHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
    {
      onActive(event) {
        if (!isHovering.value) return;
        if (hasMoved.value === false) {
          // We cannot use onStart because it is fired before activeIndex is set
          // so we workaround by depending on hasMoved
          touchInset.value =
            event.y - (activeCellOffset.value - scrollOffset.value); // Distance from touch to the edge of active cell
          hasMoved.value = true;
          initialScrollOffset.value = scrollOffset.value;
        }
        touchAbsolute.value = event.y;
        hoverTranslateBeforeOffset.value = event.translationY;
      },
      // BEGAN ------> ACTIVE ------> END
      onEnd() {
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
      onFinish() {
        hasMoved.value = false;
        touchAbsolute.value = -1;
        activeIndexAnim.value = -1;
        spacerIndexAnim.value = -1;
        touchInset.value = 0;
        hoverTranslateBeforeOffset.value = 0;
        initialScrollOffset.value = scrollOffset.value;
      },
    }
  );

  const draggableRenderItem: RecyclerRenderItem<ItemT> = useCallback(
    ({ index, item }) => {
      return (
        <MemoizedDraggableItem
          key={keyExtractor(item)}
          index={index}
          item={item}
          renderItem={renderItem as DraggableRecyclerRenderItem<unknown>}
          height={height}
        />
      );
    },
    [renderItem, keyExtractor, height]
  );

  return (
    <Context.Provider
      value={{
        drag,
        activeIndexAnim,
        spacerIndexAnim,
        activeCellSize,
        hoverTranslate,
        hoverOffset,
        scrollOffset,
        hasMoved,
      }}
    >
      <PanGestureHandler onGestureEvent={eventHandler} maxPointers={1}>
        <Animated.View style={style || styles.list} onLayout={onLayout}>
          <RecyclerList
            height={height}
            style={styles.list}
            contentContainerStyle={contentContainerStyle}
            contentHorizontalPadding={contentHorizontalPadding}
            ListEmptyComponent={ListEmptyComponent}
            onEndReached={onEndReached}
            data={data}
            renderItem={draggableRenderItem}
            scrollViewProps={scrollViewProps}
            externalScrollView={ExternalScrollView}
            onScroll={onScroll}
            _ref={scrollRef}
          />
        </Animated.View>
      </PanGestureHandler>
    </Context.Provider>
  );
}
