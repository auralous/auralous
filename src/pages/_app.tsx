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
import { useMAuth } from "~/hooks/user";
import { I18n } from "~/i18n/index";
import { createUrqlClient } from "~/graphql/urql";
import "~/styles/index.css";

const queryCache = new QueryCache();

const MAuthRefresher: React.FC = () => {
  // MAuth - Refetch on token expiry
  const mAuthResp = useMAuth();
  useEffect(() => {
    let t: number | undefined;
    if (mAuthResp.data?.expiredAt) {
      const tm = mAuthResp.data.expiredAt.getTime() - Date.now();
      // TODO: This indicates an error, report it
      if (tm < 0) return;
      t = window.setTimeout(mAuthResp.refetch, tm);
    }
    return () => window.clearTimeout(t);
  }, [mAuthResp.data, mAuthResp.refetch]);
  return null;
};

export default function MyApp({ Component, pageProps }: AppProps) {
  // URQL
  const [urqlClient, setUrqlClient] = useState(createUrqlClient());
  useEffect(() => {
    // FIXME: Find alternative to reset urql
    window.resetUrqlClient = () => setUrqlClient(createUrqlClient());
  }, []);

  // Fathom
  useEffect(() => {
    if (!process.env.FATHOM_SITE_ID) return;
    Fathom.load(process.env.FATHOM_SITE_ID, {
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
    <I18n>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <UrqlProvider value={urqlClient}>
          <ToastProvider>
            <LogInProvider>
              <MAuthRefresher />
              <PlayerProvider>
                <MainLayout>
                  <DefaultSeo
                    title=" "
                    titleTemplate="%s · Stereo"
                    facebook={{ appId: process.env.FACEBOOK_APP_ID || "" }}
                    openGraph={{
                      type: "website",
                      locale: "en_US",
                      site_name: "Stereo",
                      images: [
                        {
                          url: `${process.env.APP_URI}/images/banner.png`,
                          width: 2400,
                          height: 1260,
                          alt: "Stereo",
                        },
                      ],
                    }}
                  />
                  <Component {...pageProps} />
                </MainLayout>
              </PlayerProvider>
            </LogInProvider>
          </ToastProvider>
        </UrqlProvider>
      </ReactQueryCacheProvider>
    </I18n>
  );
}
