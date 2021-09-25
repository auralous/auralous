import { useUi, useUiDispatch } from "@/context";
import { RouteName } from "@/screens/types";
import { StopLiveIntention } from "@/views/Player";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useEffect } from "react";
import { AddToPlaylistModal } from "./AddToPlaylist";
import { BottomSheetActionMenuModal } from "./BottomSheetActionMenu";

export const RootModalsComponents: FC = () => {
  const { signIn } = useUi();
  const uiDispatch = useUiDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    // We don't have a sign in modal in native
    // so we navigate to Sign In screen
    if (signIn.visible) {
      uiDispatch({ type: "signIn", value: { visible: false } });
      navigation.navigate(RouteName.SignIn);
    }
  }, [signIn.visible, uiDispatch, navigation]);

  return (
    <>
      <AddToPlaylistModal />
      <BottomSheetActionMenuModal />
      <StopLiveIntention />
    </>
  );
};
