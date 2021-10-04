import { StopLiveIntention } from "@/player-component/components/StopLiveIntention";
import type { FC } from "react";
import { AddToPlaylistModal } from "./AddToPlaylist";
import { BottomSheetActionMenuModal } from "./BottomSheetActionMenu";
import { ShareModal } from "./ShareModal";
import { SignInModal } from "./SignIn";

export const RootModalsComponents: FC = () => {
  return (
    <>
      <AddToPlaylistModal />
      <BottomSheetActionMenuModal />
      <StopLiveIntention />
      <ShareModal />
      <SignInModal />
    </>
  );
};
