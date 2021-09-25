import { NavPlaceholder } from "@/components/Layout";
import { NotificationsScreenContent } from "@auralous/ui";
import type { FC } from "react";
import type { RouteComponentProps } from "react-router";

export const NotificationScreen: FC<RouteComponentProps> = () => {
  return (
    <>
      <NavPlaceholder />
      <NotificationsScreenContent />
    </>
  );
};
