import { LogInProvider } from "components/Auth/index";
import { LayoutApp, LayoutIndex } from "components/Layout";
import NotificationWatcher from "components/Notification/NotificationWatcher";
import { PlayerProvider } from "components/Player";
import * as Fathom from "fathom-client";
import { createUrqlClient } from "gql/urql";
import { I18n } from "i18n/index";
// polyfill
import "intersection-observer";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import "styles/index.css";
import "swiper/swiper.scss";
import { Provider as UrqlProvider } from "urql";

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
    router.events.on("routeChangeComplete", onRouteChangeComplete);
    return () =>
      router.events.off("routeChangeComplete", onRouteChangeComplete);
  }, [router]);

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
    if (["/", "/privacy", "/contact"].includes(router.pathname))
      return LayoutIndex;
    return Fragment;
  }, [router.pathname]);

  return (
    <I18n>
      <UrqlProvider value={urqlClient}>
        <LogInProvider>
          <NotificationWatcher />
          <PlayerProvider>
            <DefaultSeo
              titleTemplate="%s · Auralous"
              facebook={{ appId: process.env.FACEBOOK_APP_ID || "" }}
              openGraph={{
                type: "website",
                locale: "en_US",
                site_name: "Auralous",
                images: [
                  {
                    url: `${process.env.APP_URI}/images/banner.png`,
                    width: 2400,
                    height: 1260,
                    alt: "Auralous",
                  },
                ],
              }}
            />
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <Toaster
              toastOptions={{
                className: "text-sm",
                style: {
                  backgroundColor: "var(--background-secondary)",
                  color: "var(--foreground)",
                },
              }}
            />
          </PlayerProvider>
        </LogInProvider>
      </UrqlProvider>
    </I18n>
  );
}
