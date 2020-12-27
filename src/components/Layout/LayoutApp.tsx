import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import LayoutContext from "./LayoutContext";
import { PlayerMinibar } from "~/components/Player/index";
import { useLogin } from "~/components/Auth";
import { useCurrentUser } from "~/hooks/user";
import { useI18n } from "~/i18n/index";
import {
  SvgLogo,
  SvgMapPin,
  SvgPlayCircle,
  SvgPlus,
  SvgSettings,
} from "~/assets/svg";

const sidebarColor = "rgb(18, 18, 24)";

const boldClasses = "bg-gradient-to-l from-warning to-primary flex-none px-8";

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
  const user = useCurrentUser();
  const [, logIn] = useLogin();

  return (
    <div
      className="hidden sm:block w-48 fixed left-0 top-0 h-full"
      style={{ backgroundColor: sidebarColor }}
    >
      <div className="p-2">
        <div className="py-4">
          <SvgLogo title="Stereo" className="w-32 h-12 mx-auto fill-current" />
        </div>
        <SidebarItem href="/new" isBold>
          {t("common.newStory")}
        </SidebarItem>
        <SidebarItem href="/listen">{t("listen.title")}</SidebarItem>
        <SidebarItem href="/map">{t("map.title")}</SidebarItem>
      </div>
      <div className="p-1 rounded-lg">
        {user ? (
          <div className="px-2 py-1 border-t-2 border-background-secondary">
            <div className="p-1 flex items-center">
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="w-0 flex-1 text-foreground-secondary py-1 px-3 truncate leading-none">
                <div className="font-medium text-sm">{user.username}</div>
                <Link href={`/user/${user.username}`}>
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
          <button
            onClick={logIn}
            className="btn btn-transparent rounded-none border-t-2 border-background-secondary text-sm w-full py-3"
          >
            {t("common.signIn")}
          </button>
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
        className={`btn btn-transparent text-foreground border-primary py-1 font-light rounded-none ${
          isActive && !isBold ? "border-b-2" : ""
        } ${isBold ? boldClasses : "flex-1"}`}
        title={title}
      >
        {children}
      </a>
    </Link>
  );
};

const Appbar: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <>
      <div
        className={`${
          router.pathname === "/story/[storyId]" ? "hidden" : ""
        } h-10 w-full `}
      />
      <div
        className={`${
          router.pathname === "/story/[storyId]" ? "hidden" : "flex"
        } z-10 sm:hidden fixed bottom-0 left-0 w-full h-10 overflow-hidden`}
        style={{ backgroundColor: sidebarColor }}
      >
        <AppbarItem href="/listen" title={t("listen.title")}>
          <SvgPlayCircle className="w-4 h-4" />
        </AppbarItem>
        <AppbarItem isBold href="/new" title={t("common.newStory")}>
          <SvgPlus className="w-6 h-6" />
        </AppbarItem>
        <AppbarItem href="/map" title={t("map.title")}>
          <SvgMapPin className="w-4 h-4" />
        </AppbarItem>
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
      <main className="sm:pl-48">{children}</main>
      <Sidebar />
      <Appbar />
    </LayoutContext.Provider>
  );
};

export default LayoutApp;
