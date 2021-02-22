import { useWindowSize } from "@react-hook/window-size";
import { Box } from "components/View";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import LayoutAppContext from "./LayoutAppContext";

const LayoutAppDesktop = dynamic(() => import("./LayoutAppDesktop"));
const LayoutAppMobile = dynamic(() => import("./LayoutAppMobile"));

const LayoutApp: React.FC = ({ children }) => {
  const prevPathnameRef = useRef<string>("");

  const router = useRouter();

  useEffect(() => {
    const onRouteChangeComplete = (url: string) => {
      prevPathnameRef.current = url;
    };
    router.events.on("routeChangeComplete", onRouteChangeComplete);
    return () =>
      router.events.off("routeChangeComplete", onRouteChangeComplete);
  }, [router]);

  const [viewWidth, viewHeight] = useWindowSize();

  return (
    <LayoutAppContext.Provider value={{ prevPathname: prevPathnameRef }}>
      <Box alignItems="start" row justifyContent="center">
        {viewWidth > 768 ? (
          <LayoutAppDesktop height={viewHeight} />
        ) : (
          <LayoutAppMobile />
        )}
        <main className="max-w-full" style={{ width: 600 }}>
          {children}
        </main>
      </Box>
    </LayoutAppContext.Provider>
  );
};

export default LayoutApp;
