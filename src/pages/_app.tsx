import React, { useState, useEffect } from "react";
import { AppProps } from "next/app";
import Router from "next/router";
import * as Fathom from "fathom-client";
import { DefaultSeo } from "next-seo";
import { Provider as UrqlProvider } from "urql";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { MainLayout } from "~/components/Layout/index";
import { PlayerProvider } from "~/components/Player/index";
import { ToastProvider } from "~/components/Toast/index";
import { LogInProvider } from "~/components/Auth/index";
import { createUrqlClient } from "~/graphql/urql";
import "~/assets/styles/index.css";
import "nprogress/nprogress.css";

const queryCache = new QueryCache();

export default function MyApp({ Component, pageProps }: AppProps) {
  const [urqlClient, setUrqlClient] = useState(createUrqlClient());
  useEffect(() => {
    // FIXME: Find alternative to reset urql
    (window as any).resetUrqlClient = () => setUrqlClient(createUrqlClient());
  }, []);

  useEffect(() => {
    Fathom.load(process.env.FATHOM_SITE_ID!, {
      includedDomains: ["withstereo.com"],
      honorDNT: true,
      url: "https://prairiedog.withstereo.com/script.js",
    });
    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    Router.events.on("routeChangeComplete", onRouteChangeComplete);
    return () =>
      Router.events.off("routeChangeComplete", onRouteChangeComplete);
  }, []);
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <UrqlProvider value={urqlClient}>
        <ToastProvider>
          <LogInProvider>
            <PlayerProvider>
              <MainLayout>
                <DefaultSeo
                  title=" "
                  titleTemplate="%s · Stereo"
                  facebook={{
                    appId: process.env.FACEBOOK_APP_ID as string,
                  }}
                  openGraph={{
                    type: "website",
                    locale: "en_US",
                    site_name: "Stereo",
                  }}
                />
                <Component {...pageProps} />
              </MainLayout>
            </PlayerProvider>
          </LogInProvider>
        </ToastProvider>
      </UrqlProvider>
    </ReactQueryCacheProvider>
  );
}
