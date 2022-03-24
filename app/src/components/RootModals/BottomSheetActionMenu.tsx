import { BottomSheetActionMenu } from "@/components/BottomSheet";
import { useUI, useUIDispatch } from "@/ui-context";
import type { FC } from "react";
import { useCallback } from "react";

export const BottomSheetActionMenuModal: FC = () => {
  const { contextMenu } = useUI();
  const uiDispatch = useUIDispatch();
  const onDismiss = useCallback(
    () =>
      uiDispatch({ type: "contextMenu", value: { visible: false, items: [] } }),
    [uiDispatch]
  );
  return <BottomSheetActionMenu onDismiss={onDismiss} {...contextMenu} />;
};
