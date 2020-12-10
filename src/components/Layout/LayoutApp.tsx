import React from "react";
import Link from "next/link";
import { PlayerMinibar } from "~/components/Player/index";
import { useLogin } from "~/components/Auth";
import { useCurrentUser } from "~/hooks/user";
import { useI18n } from "~/i18n/index";
import {
  SvgLogIn,
  SvgLogo,
  SvgPlayCircle,
  SvgPlus,
  SvgSearch,
  SvgSettings,
} from "~/assets/svg";
import { useRouter } from "next/router";

const SidebarItem: React.FC<{ href: string }> = ({ children, href }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link href={href}>
      <a
        className={`btn btn-transparent rounded-full font-medium text-sm ${
          isActive ? "bg-background-secondary" : ""
        } w-full mb-2`}
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
      className="hidden sm:flex flex-col justify-between w-48 fixed left-0 top-0 h-full shadow-lg"
      style={{ backgroundColor: "#121218" }}
    >
      <div className="p-2">
        <div className="py-4">
          <SvgLogo title="Stereo" className="w-32 h-12 mx-auto fill-current" />
        </div>
        <Link href="/new">
          <a className="btn btn-primary w-full px-6 py-2 text-sm rounded-full mb-2">
            {t("common.newStory")}
          </a>
        </Link>
        <SidebarItem href="/listen">{t("listen.title")}</SidebarItem>
        <SidebarItem href="/discover">{t("discover.title")}</SidebarItem>
      </div>
      <div className="bg-background-secondary">
        {user ? (
          <div className="p-2">
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
            className="btn btn-transparent rounded-none bg-primary hover:text-foreground text-sm w-full py-3"
          >
            {t("common.signIn")}
          </button>
        )}
      </div>
    </div>
  );
};

const AppbarItem: React.FC<{ title: string; href: string; as?: string }> = ({
  children,
  href,
  as,
  title,
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link href={href} as={as}>
      <a
        className={`btn btn-transparent text-foreground border-primary py-1 font-light flex-col flex-1 rounded-none ${
          isActive ? "bg-background border-b-2" : ""
        } truncate`}
        title={title}
      >
        {children}
      </a>
    </Link>
  );
};

const Appbar: React.FC = () => {
  const { t } = useI18n();
  const user = useCurrentUser();

  const [, logIn] = useLogin();

  return (
    <div className="flex z-10 sm:hidden fixed bottom-0 left-0 w-full bg-background-tertiary h-10 overflow-hidden">
      <AppbarItem href="/listen" title={t("listen.title")}>
        <SvgPlayCircle className="w-4 h-4" />
      </AppbarItem>
      <AppbarItem href="/discover" title={t("discover.title")}>
        <SvgSearch className="w-4 h-4" />
      </AppbarItem>
      <AppbarItem href="/new" title={t("common.newStory")}>
        <SvgPlus className="w-4 h-4" />
      </AppbarItem>
      {user ? (
        <AppbarItem
          href="/user/[username]"
          as={`/user/${user.username}`}
          title={user.username}
        >
          <img
            alt={user.username}
            src={user.profilePicture}
            className="h-4 w-4 shadow-md rounded-full"
          />
        </AppbarItem>
      ) : (
        <button
          onClick={logIn}
          className="btn btn-transparent bg-primary text-primary-label py-1 font-light flex-col flex-1 rounded-none truncate"
          title={t("common.signIn")}
        >
          <SvgLogIn className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const LayoutApp: React.FC = ({ children }) => {
  return (
    <>
      <PlayerMinibar />
      <main className="pb-10 sm:pb-0 sm:pl-48">{children}</main>
      <Sidebar />
      <Appbar />
    </>
  );
};

export default LayoutApp;
