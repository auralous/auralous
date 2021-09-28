import { Share } from "@/components/Share";
import { useUi, useUiDispatch } from "@/context";
import type { FC } from "react";
import { useCallback } from "react";

export const ShareModal: FC = () => {
  const { share } = useUi();
  const uiDispatch = useUiDispatch();

  const onDismiss = useCallback(
    () => uiDispatch({ type: "share", value: { visible: false } }),
    [uiDispatch]
  );

  return <Share onDismiss={onDismiss} {...share} />;
};
