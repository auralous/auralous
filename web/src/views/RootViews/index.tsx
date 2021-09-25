import { SignIn } from "@/views/SignIn";
import { StopLiveIntention } from "@auralous/ui";
import type { FC } from "react";

export const RootViews: FC = () => {
  return (
    <>
      <SignIn />
      <StopLiveIntention />
    </>
  );
};
