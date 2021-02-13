import { LogInProvider } from "components/Auth/index";
import { LayoutApp, LayoutIndex } from "components/Layout/index";
import NotificationWatcher from "components/Notification/NotificationWatcher";
import { PlayerProvider } from "components/Player/index";
import StoryOngoingWatcher from "components/Story/StoryOngoingWatcher";
import * as Fathom from "fathom-client";
import { createUrqlClient } from "gql/urql";
import { I18n } from "i18n/index";
// polyfill
import "intersection-observer";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import Router from "next/router";
import "notyf/notyf.min.css";
import NProgress from "nprogress";
// nprogress
import "nprogress/nprogress.css";
import React, { useEffect, useMemo, useState } from "react";
import "styles/index.css";
import "swiper/swiper.scss";
import { Provider as UrqlProvider } from "urql";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function MyApp({ Component, pageProps, router }: AppProps) {
  // URQL
  const [urqlClient, setUrqlClient] = useState(() => createUrqlClient());
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

  const Layout = useMemo(() => {
    if (
      [
        "/map",
        "/story/[storyId]",
        "/story/[storyId]/settings",
        "/settings",
        "/new",
        "/notifications",
        "/listen",
        "/user/[username]",
      ].includes(router.pathname)
    )
      return LayoutApp;
    if (
      ["/", "/privacy", "/support", "/support/[slug]"].includes(router.pathname)
    )
      return LayoutIndex;
    return React.Fragment;
  }, [router.pathname]);

  return (
    <I18n>
      <UrqlProvider value={urqlClient}>
        <LogInProvider>
          <NotificationWatcher />
          <PlayerProvider>
            <DefaultSeo
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
            <Layout>
              <Component {...pageProps} />
              <StoryOngoingWatcher />
            </Layout>
          </PlayerProvider>
        </LogInProvider>
      </UrqlProvider>
    </I18n>
  );
}
