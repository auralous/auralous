import { useWindowSize } from "@react-hook/window-size";
import { LoadingFullpage } from "components/Loading";
import { Box } from "components/View";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import LayoutAppContext from "./LayoutAppContext";

const LayoutAppDesktop = dynamic(() => import("./LayoutAppDesktop"), {
  ssr: false,
  loading: LoadingFullpage,
});
const LayoutAppMobile = dynamic(() => import("./LayoutAppMobile"), {
  ssr: false,
  loading: LoadingFullpage,
});

const LayoutApp: React.FC = ({ children }) => {
  const prevPathnameRef = useRef<string>("");

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onRouteChangeComplete = (url: string) => {
      prevPathnameRef.current = url;
      setIsLoading(false);
    };
    const onRouteChangeStart = () => {
      setIsLoading(true);
    };
    router.events.on("routeChangeStart", onRouteChangeStart);
    router.events.on("routeChangeComplete", onRouteChangeComplete);
    return () => {
      router.events.off("rotueChangeStart", onRouteChangeStart);
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
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
      <LoadingFullpage isLoading={isLoading} />
    </LayoutAppContext.Provider>
  );
};

export default LayoutApp;
