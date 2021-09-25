import { BottomSheetActionMenu } from "@/components/BottomSheet";
import { useUi, useUiDispatch } from "@auralous/ui";
import type { FC } from "react";
import { useCallback } from "react";

export const BottomSheetActionMenuModal: FC = () => {
  const { contextMenu } = useUi();
  const uiDispatch = useUiDispatch();
  const onDismiss = useCallback(
    () => uiDispatch({ type: "contextMenu", value: { visible: false } }),
    [uiDispatch]
  );
  if (!contextMenu.meta) return null;
  return (
    <BottomSheetActionMenu
      onDismiss={onDismiss}
      visible={contextMenu.visible}
      {...contextMenu.meta}
    />
  );
};
