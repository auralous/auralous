import { StopLiveIntention } from "@/player-components/StopLiveIntention";
import type { FC } from "react";
import { AddToPlaylistModal } from "./AddToPlaylist";
import { BottomSheetActionMenuModal } from "./BottomSheetActionMenu";
import { CreateSessionModal } from "./CreateSessionModal";
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
      <CreateSessionModal />
    </>
  );
};
