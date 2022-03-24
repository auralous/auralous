import { useCallback, useContext, useMemo } from "react";
import type { ViewStyle } from "react-native";
import {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { SortableContext } from "./SortableContext";
import type { PartialListRenderItemInfo } from "./types";

function SortableItem<ItemT>({
  info,
}: {
  info: PartialListRenderItemInfo<ItemT>;
}) {
  const {
    spacerIndexAnim,
    drag: setDragging,
    hoverOffset,
    scrollOffset,
    getCachableItemLayout,
    activeLayoutAnim,
    horizontal,
    sortableRenderItem,
  } = useContext(SortableContext);

  const cellMeasurement = useMemo(
    () => getCachableItemLayout(info.index),
    [getCachableItemLayout, info.index]
  );

  // Distance between active cell and edge of scroll view
  // const cellOffset = useDerivedValue(
  //   () => cellMeasurement.offset,
  //   [info.index, cellMeasurement]
  // );
  // const cellSize = useDerivedValue(
  //   () => cellMeasurement.length,
  //   [cellMeasurement.length]
  // );
  const cellIndex = useDerivedValue(() => info.index, [info.index]);

  const isActiveCell = useDerivedValue(() => {
    if (!activeLayoutAnim.value) return false;
    return cellIndex.value === activeLayoutAnim.value.index;
  });

  useAnimatedReaction(
    () => {
      // Do not calculate before moving and if is active cell
      if (isActiveCell.value) return -1;
      // Can't measure active cellSize or not currently dragging
      if (!activeLayoutAnim.value) return -1;

      const activeIndexVal = activeLayoutAnim.value.index;

      const cellOffsetValue = cellMeasurement.offset;
      const cellSizeValue = cellMeasurement.length;

      // Distance between hovering cell and edge of scroll view
      const hoverOffsetValue = hoverOffset.value + scrollOffset.value;
      const hoverPlusActiveSize =
        hoverOffsetValue + activeLayoutAnim.value.length;

      const isAfterActive = cellIndex.value > activeIndexVal;
      const isBeforeActive = cellIndex.value < activeIndexVal;

      const offsetPlusHalfSize = cellOffsetValue + cellSizeValue / 2;
      const offsetPlusSize = cellOffsetValue + cellSizeValue;

      let desiredSpacerAnim = -1;
      if (isAfterActive) {
        if (
          hoverPlusActiveSize >= cellOffsetValue &&
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
          hoverOffsetValue >= cellOffsetValue &&
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
    [cellMeasurement]
  );

  const translateValue = useDerivedValue(() => {
    if (isActiveCell.value) {
      return hoverOffset.value - (cellMeasurement.offset - scrollOffset.value);
    }
    if (!activeLayoutAnim.value) return 0;
    const isAfterActive = cellIndex.value > activeLayoutAnim.value.index;
    const shouldTranslate = isAfterActive
      ? cellIndex.value <= spacerIndexAnim.value
      : cellIndex.value >= spacerIndexAnim.value;
    return withTiming(
      shouldTranslate
        ? activeLayoutAnim.value.length * (isAfterActive ? -1 : 1)
        : 0
    );
  });

  const drag = useCallback(() => {
    setDragging(info.index);
  }, [info.index, setDragging]);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          [horizontal ? "translateX" : "translateY"]: translateValue.value,
        },
      ] as unknown as ViewStyle["transform"],
      zIndex: isActiveCell.value ? 10 : 0,
    };
  }, [horizontal]);

  return sortableRenderItem({
    ...info,
    drag,
    isDragging: false,
    animStyle: style,
  });
}

export default SortableItem;
