import {
  SvgActivity,
  SvgLogIn,
  SvgLogo,
  SvgMapPin,
  SvgPlayCircle,
  SvgPlus,
  SvgSettings,
  SvgUser,
} from "assets/svg";
import { useLogin } from "components/Auth";
import { Button } from "components/Button";
import { PlayerMinibar } from "components/Player/index";
import { useNotificationAddedSubscription, User } from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import LayoutContext from "./LayoutContext";

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

const sidebarColor = "rgb(18, 18, 24)";

const boldClasses = "bg-gradient-to-l from-warning to-primary";

const SidebarItem: React.FC<{ href: string; isBold?: boolean }> = ({
  children,
  href,
  isBold,
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link href={href}>
      <a
        className={`btn btn-transparent font-medium text-sm ${
          isActive ? "bg-background-secondary" : ""
        } ${isBold ? boldClasses : ""} w-full mb-2`}
      >
        {children}
      </a>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { t } = useI18n();
  const me = useMe();
  const [, logIn] = useLogin();

  const hasNotification = useHasNotification(me?.user);

  return (
    <div
      className="hidden md:block w-56 fixed left-0 top-0 h-full"
      style={{ backgroundColor: sidebarColor }}
    >
      <div className="p-2">
        <div className="py-4">
          <SvgLogo title="Stereo" className="w-32 h-12 mx-auto fill-current" />
        </div>
        <SidebarItem href="/new" isBold>
          {t("story.create")}
        </SidebarItem>
        <SidebarItem href="/listen">{t("listen.title")}</SidebarItem>
        <SidebarItem href="/map">{t("map.title")}</SidebarItem>
        <SidebarItem href="/notifications">
          {t("notification.title")}
          {hasNotification && (
            <span className="w-2 h-2 ml-1 rounded-full bg-primary animate-pulse" />
          )}
        </SidebarItem>
      </div>
      <div className="p-1 rounded-lg">
        {me ? (
          <div className="px-2 py-1 border-t-2 border-background-secondary">
            <div className="p-1 flex items-center">
              <img
                src={me.user.profilePicture}
                alt={me.user.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="w-0 flex-1 text-foreground-secondary py-1 px-3 truncate leading-none">
                <div className="font-medium text-sm">{me.user.username}</div>
                <Link href={`/user/${me.user.username}`}>
                  <a className="text-xs text-primary hover:text-primary-dark">
                    {t("user.profile")}
                  </a>
                </Link>
              </div>
              <Link href="/settings">
                <a
                  className="btn p-1.5 bg-foreground-backdrop btn-transparent"
                  title={t("settings.title")}
                >
                  <SvgSettings className="w-3 h-3" />
                </a>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-1 border-b-2 border-foreground-backdrop" />
            <Button
              styling="link"
              onPress={logIn}
              fullWidth
              title={t("common.signIn")}
            />
          </>
        )}
      </div>
    </div>
  );
};

const AppbarItem: React.FC<{
  title: string;
  href: string;
  as?: string;
  isBold?: boolean;
}> = ({ children, href, as, title, isBold }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link href={href} as={as}>
      <a
        className={`relative btn btn-transparent text-foreground border-primary py-1 font-light rounded-none flex-1 ${
          isActive && !isBold ? "border-b-2" : ""
        } ${isBold ? boldClasses : ""}`}
        title={title}
      >
        {children}
      </a>
    </Link>
  );
};

const noAppbarPathname = ["/story/[storyId]", "/new"];

const Appbar: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const me = useMe();
  const [, logIn] = useLogin();

  const hasNotification = useHasNotification(me?.user);

  return (
    <>
      <div
        className={`${
          noAppbarPathname.includes(router.pathname) ? "hidden" : ""
        } h-10 w-full `}
      />
      <div
        className={`${
          noAppbarPathname.includes(router.pathname) ? "hidden" : "flex"
        } z-10 md:hidden fixed bottom-0 left-0 w-full h-10 overflow-hidden`}
        style={{ backgroundColor: sidebarColor }}
      >
        <AppbarItem href="/listen" title={t("listen.title")}>
          <SvgPlayCircle className="w-4 h-4" />
        </AppbarItem>
        <AppbarItem href="/map" title={t("map.title")}>
          <SvgMapPin className="w-4 h-4" />
        </AppbarItem>
        <AppbarItem isBold href="/new" title={t("story.create")}>
          <SvgPlus className="w-6 h-6" />
        </AppbarItem>
        <AppbarItem href="/notifications" title={t("notification.title")}>
          <SvgActivity className="w-4 h-4" />
          {hasNotification && (
            <span className="w-2 h-2 rounded-full bg-primary absolute top-2 left-1/2 ml-2 animate-pulse" />
          )}
        </AppbarItem>
        {me ? (
          <AppbarItem
            as={`/user/${me.user.username}`}
            href="/user/[username]"
            title={t("user.profile")}
          >
            <SvgUser className="w-4 h-4" />
          </AppbarItem>
        ) : (
          <button
            className="btn btn-transparent text-foreground border-primary py-1 font-light rounded-none flex-1"
            title={t("common.signIn")}
            onClick={logIn}
          >
            <SvgLogIn className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  );
};

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

  return (
    <LayoutContext.Provider value={{ prevPathname: prevPathnameRef }}>
      <PlayerMinibar />
      <main className="md:pl-56">{children}</main>
      <Sidebar />
      <Appbar />
    </LayoutContext.Provider>
  );
};

export default LayoutApp;
