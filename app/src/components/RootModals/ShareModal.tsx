import { Share } from "@/components/Share";
import { useUI, useUIDispatch } from "@/ui-context";
import type { FC } from "react";
import { useCallback } from "react";

export const ShareModal: FC = () => {
  const { share } = useUI();
  const uiDispatch = useUIDispatch();

  const onDismiss = useCallback(
    () => uiDispatch({ type: "share", value: { visible: false } }),
    [uiDispatch]
  );

  return <Share onDismiss={onDismiss} {...share} />;
};
