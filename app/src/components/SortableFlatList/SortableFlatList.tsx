import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import type {
  LayoutChangeEvent,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { StyleSheet } from "react-native";
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { FlatList, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useSharedValue,
  useWorkletCallback,
} from "react-native-reanimated";
import { SortableContext } from "./SortableContext";
import SortableItem from "./SortableItem";
import type { DraggableListProps, GetItemLayoutResult } from "./types";

const styles = StyleSheet.create({ list: { flex: 1, overflow: "hidden" } });

const MemoizedSortableItem = memo(
  SortableItem,
  (prevProps, nextProps) =>
    prevProps.info.index === nextProps.info.index &&
    prevProps.info.item === nextProps.info.item &&
    prevProps.info.separators === nextProps.info.separators
);

const autoscrollSpeed = 80;
const autoscrollThreshold = 30;
const activationDistance = 0;

const CellRendererComponent: FC = ({ children }) => <>{children}</>;
export default function SortableFlatList<ItemT>({
  renderItem: renderItemProp,
  onDragEnd,
  onScroll: onScrollProp,
  onContentSizeChange: onContentSizeChangeProp,
  getItemLayout,
  style,
  data,
  horizontal,
  ...props
}: DraggableListProps<ItemT>) {
  const getCachableItemLayout = useMemo(() => {
    const c = new Map<number, GetItemLayoutResult>();
    return (index: number) => {
      if (c.has(index)) {
        return c.get(index) as GetItemLayoutResult;
      }
      const measured = getItemLayout(data as ItemT[] | null | undefined, index);
      c.set(index, measured);
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

  const activeLayoutAnim = useSharedValue<GetItemLayoutResult | null>(null); // measurement of hovering cell

  const spacerIndexAnim = useSharedValue(-1); // Index of hovered-over cell

  const scrollRef = useRef<FlatList>(null);

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
      const offset = event.nativeEvent.contentOffset[horizontal ? "x" : "y"];
      scrollOffset.value = offset;
    },
    [onScrollProp, scrollOffset, horizontal]
  );

  const initialHoverOffset = useSharedValue(0);
  const hoverOffset = useSharedValue(0);

  const doAutoScroll = useMemo(() => {
    let throttled = false;
    return (offset: number) => {
      if (throttled) return;
      throttled = true;
      setTimeout(() => (throttled = false), 100);
      scrollRef.current?.scrollToOffset({ animated: true, offset });
    };
  }, []);

  // AutoScroll
  useAnimatedReaction(
    () => {
      return {
        hoverOffsetValue: hoverOffset.value,
        scrollOffsetValue: scrollOffset.value,
        containerSizeValue: containerSize.value,
        scrollContentSizeValue: scrollContentSize.value,
        activeLayoutAnimValue: activeLayoutAnim.value,
      };
    },
    ({
      hoverOffsetValue,
      scrollOffsetValue,
      containerSizeValue,
      scrollContentSizeValue,
      activeLayoutAnimValue,
    }) => {
      if (!activeLayoutAnimValue) return;

      let scrollDelta = 0;

      const hoverOffsetEndValue =
        hoverOffsetValue + activeLayoutAnimValue.length;

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

      runOnJS(doAutoScroll)(calculatedTargetOffset);
    },
    [doAutoScroll]
  );

  const drag = useCallback(
    (index: number) => {
      const activeLayout = (activeLayoutAnim.value =
        getCachableItemLayout(index));
      spacerIndexAnim.value = index;

      // set the initial hover offset
      initialHoverOffset.value = hoverOffset.value =
        activeLayout.offset - scrollOffset.value;
    },
    [
      spacerIndexAnim,
      activeLayoutAnim,
      initialHoverOffset,
      hoverOffset,
      scrollOffset,
      getCachableItemLayout,
    ]
  );

  const clearAnimState = useWorkletCallback(() => {
    activeLayoutAnim.value = null;
    spacerIndexAnim.value = -1;
  }, []);

  useEffect(clearAnimState, [data, clearAnimState]);

  const eventHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
    {
      onActive: (event) => {
        if (!activeLayoutAnim.value) return;
        hoverOffset.value =
          initialHoverOffset.value +
          (horizontal ? event.translationX : event.translationY);
      },
      // BEGAN ------> ACTIVE ------> END
      onEnd: () => {
        if (!activeLayoutAnim.value) return;
        const from = activeLayoutAnim.value.index;
        const to = spacerIndexAnim.value;
        if (from !== -1 && to !== -1 && from !== to) {
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
    [onDragEnd, clearAnimState, horizontal]
  );

  const renderItem: ListRenderItem<ItemT> = useCallback((info) => {
    return <MemoizedSortableItem info={info} />;
  }, []);

  return (
    <SortableContext.Provider
      value={{
        drag,
        activeLayoutAnim,
        spacerIndexAnim,
        hoverOffset,
        scrollOffset,
        getCachableItemLayout,
        horizontal,
        sortableRenderItem: renderItemProp,
      }}
    >
      <PanGestureHandler
        onGestureEvent={eventHandler}
        maxPointers={1}
        activeOffsetX={activationDistance}
        activeOffsetY={activationDistance}
      >
        <Animated.View style={style} onLayout={onContainerLayout}>
          <FlatList
            {...props}
            ref={scrollRef}
            data={data}
            getItemLayout={getItemLayout}
            renderItem={renderItem}
            onScroll={onScroll}
            onContentSizeChange={onContentSizeChange}
            style={styles.list}
            horizontal={horizontal}
            CellRendererComponent={CellRendererComponent}
          />
        </Animated.View>
      </PanGestureHandler>
    </SortableContext.Provider>
  );
}
