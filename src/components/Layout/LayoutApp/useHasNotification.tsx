import { useNotificationAddedSubscription, User } from "gql/gql.gen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useHasNotification = (me: User | null | undefined) => {
  const [hasNotification, setHasNotification] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (router.pathname === "/notifications") setHasNotification(false);
  }, [router]);
  // return true if there is new notification and
  // user is not on notification page
  useNotificationAddedSubscription({ pause: !me }, (prev, data) => {
    if (router.pathname !== "/notifications") setHasNotification(true);
    return data;
  });
  return hasNotification;
};

export default useHasNotification;
