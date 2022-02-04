import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import type { FC } from "react";
import { useDerivedValue } from "react-native-reanimated";

const BottomSheetModalBackdrop: FC<BottomSheetBackdropProps> = (props) => {
  const animatedIndex = useDerivedValue(
    () => props.animatedIndex.value + 1,
    []
  );
  return <BottomSheetBackdrop {...props} animatedIndex={animatedIndex} />;
};

export default BottomSheetModalBackdrop;
