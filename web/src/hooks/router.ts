import { LayoutAppContext } from "components/Layout/LayoutApp";
import { useRouter } from "next/router";
import { useCallback, useContext } from "react";

// router.back that defaults to /listen
export function useRouterBack() {
  const prevPathnameRef = useContext(LayoutAppContext).prevPathnameRef;
  const router = useRouter();
  const back = useCallback(() => {
    if (prevPathnameRef.current) {
      router.back();
    } else {
      router.replace("/listen");
    }
  }, [router, prevPathnameRef]);
  return back;
}
