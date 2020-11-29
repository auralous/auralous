import React from "react";
import Link from "next/link";
import { PlayerMinibar } from "~/components/Player/index";
import { useLogin } from "~/components/Auth";
import { useCurrentUser } from "~/hooks/user";
import { useI18n } from "~/i18n/index";
import {
  SvgLogIn,
  SvgLogo,
  SvgPlay,
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
          isActive ? "bg-white bg-opacity-10" : ""
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
      style={{ backgroundColor: "#0b0f17" }}
    >
      <div className="p-2">
        <div className="py-4">
          <SvgLogo title="Stereo" className="w-32 h-12 mx-auto fill-current" />
        </div>
        <Link href="/new">
          <a className="inline-flex flex-center w-full px-6 py-2 text-sm font-bold rounded-full border-2 border-pink hover:border-white transition duration-300 mb-2">
            {t("common.newRoom")}
          </a>
        </Link>
        <SidebarItem href="/listen-now">{t("listenNow.title")}</SidebarItem>
        <SidebarItem href="/browse">{t("browse.title")}</SidebarItem>
      </div>
      <div className="bg-white bg-opacity-5">
        {user ? (
          <div className="p-2">
            <div className="p-1 flex items-center">
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="w-0 flex-1 text-foreground-secondary py-1 px-3">
                <span className="font-medium text-sm leading-none">
                  {user.username}
                </span>
              </div>
              <Link href="/settings">
                <a
                  className="btn p-1.5 bg-white bg-opacity-25 btn-transparent opacity-75"
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
            className="btn btn-transparent text-sm w-full py-3"
          >
            {t("common.signIn")} Stereo
          </button>
        )}
      </div>
    </div>
  );
};

const AppbarItem: React.FC<{ href: string }> = ({ children, href }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link href={href}>
      <a
        className={`btn btn-transparent text-foreground border-pink py-1 font-light flex-col flex-1 rounded-none ${
          isActive ? "bg-blue border-b-2" : ""
        } truncate`}
        style={{ fontSize: ".6rem" }}
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
    <div className="flex sm:hidden fixed bottom-0 left-0 w-full bg-blue-tertiary">
      <AppbarItem href="/listen-now">
        <SvgPlay className="w-4 h-4 mb-1" />
        <span>{t("listenNow.title")}</span>
      </AppbarItem>
      <AppbarItem href="/browse">
        <SvgSearch className="w-4 h-4 mb-1" />
        <span>{t("browse.title")}</span>
      </AppbarItem>
      <AppbarItem href="/new">
        <SvgPlus className="w-4 h-4 mb-1" />
        <span>{t("common.newRoom")}</span>
      </AppbarItem>
      {user ? (
        <AppbarItem href="/settings">
          <img
            alt={user.username}
            src={user.profilePicture}
            className="h-4 w-4 shadow-md rounded-full mb-1"
          />
          <span>{user.username}</span>
        </AppbarItem>
      ) : (
        <button
          onClick={logIn}
          className="btn btn-transparent bg-pink-dark text-foreground py-1 font-light flex-col flex-1 rounded-none truncate"
          style={{ fontSize: ".6rem" }}
        >
          <SvgLogIn className="w-4 h-4 mb-1" />
          <span>{t("common.signIn")}</span>
        </button>
      )}
    </div>
  );
};

const LayoutApp: React.FC = ({ children }) => {
  return (
    <>
      <PlayerMinibar />
      <main className="pb-12 sm:pb-0 sm:pl-48">{children}</main>
      <Sidebar />
      <Appbar />
    </>
  );
};

export default LayoutApp;
