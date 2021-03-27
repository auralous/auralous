import { LoadingFullpage } from "components/Loading";
import { Box } from "components/View";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import LayoutAppContext from "./LayoutAppContext";
import LayoutAppMobile from "./LayoutAppMobile";

const LayoutApp: React.FC = ({ children }) => {
  const prevPathnameRef = useRef<string>("");

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const back = useCallback(() => {
    if (prevPathnameRef.current) {
      router.back();
    } else {
      router.replace("/listen");
    }
  }, [router]);

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

  return (
    <LayoutAppContext.Provider value={{ prevPathnameRef }}>
      <Box alignItems="center" justifyContent="center">
        <LayoutAppMobile />
        <main className="w-full max-w-2xl">{children}</main>
      </Box>
      <LoadingFullpage isLoading={isLoading} />
    </LayoutAppContext.Provider>
  );
};

export default LayoutApp;
