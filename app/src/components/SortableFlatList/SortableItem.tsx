import { useCallback, useContext, useMemo } from "react";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
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
    activeIndexAnim,
    spacerIndexAnim,
    drag: setDragging,
    hoverOffset,
    hasMoved,
    scrollOffset,
    getCellMeasurement,
    activeCellSizeValue,
    horizontal,
    sortableRenderItem,
  } = useContext(SortableContext);

  const cellMeasurement = useMemo(
    () => getCellMeasurement(info.index),
    [getCellMeasurement, info.index]
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
    return cellIndex.value === activeIndexAnim.value;
  });

  useAnimatedReaction(
    () => {
      // Do not calculate before moving and if is active cell
      if (!hasMoved.value || isActiveCell.value) return -1;
      // Can't measure active cellSize
      if (!activeCellSizeValue) return -1;
      const cellOffsetValue = cellMeasurement.offset;
      const cellSizeValue = cellMeasurement.length;
      // Distance between hovering cell and edge of scroll view
      const hoverOffsetValue = hoverOffset.value + scrollOffset.value;
      const hoverPlusActiveSize = hoverOffsetValue + activeCellSizeValue;

      const isAfterActive = cellIndex.value > activeIndexAnim.value;
      const isBeforeActive = cellIndex.value < activeIndexAnim.value;

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
    [activeCellSizeValue, cellMeasurement]
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
    return Object.assign(horizontal ? { height: "100%" } : { width: "100%" }, {
      transform: [
        horizontal
          ? { translateX: translateValue.value }
          : { translateY: translateValue.value },
      ],
      opacity: isActiveCell.value && hasMoved.value ? 0 : 1,
    });
  }, [horizontal]);

  return (
    <Animated.View style={style}>
      {sortableRenderItem({ ...info, drag })}
    </Animated.View>
  );
}

export default SortableItem;
