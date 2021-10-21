import { BottomSheetActionMenu } from "@/components/BottomSheet";
import { useUi, useUiDispatch } from "@/ui-context";
import type { FC } from "react";
import { useCallback } from "react";

export const BottomSheetActionMenuModal: FC = () => {
  const { contextMenu } = useUi();
  const uiDispatch = useUiDispatch();
  const onDismiss = useCallback(
    () =>
      uiDispatch({ type: "contextMenu", value: { visible: false, items: [] } }),
    [uiDispatch]
  );
  return <BottomSheetActionMenu onDismiss={onDismiss} {...contextMenu} />;
};
