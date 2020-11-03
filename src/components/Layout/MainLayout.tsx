import React, { useEffect, useMemo } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import NProgress from "nprogress";
import { usePlayer, PlayerMinibar } from "~/components/Player/index";
import { useLogin } from "~/components/Auth";
import { useCurrentUser } from "~/hooks/user";
import { SvgPlus, SvgLogo, SvgSettings } from "~/assets/svg";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const noNavbarRoutes = ["/room/[roomId]", "/", "/welcome"];
const noFooterRoutes = ["/room/[roomId]", "/welcome"];

const Navbar: React.FC = () => {
  const router = useRouter();
  const shouldHideNavFoot = useMemo(
    () => noNavbarRoutes.includes(router.pathname),
    [router]
  );
  const user = useCurrentUser();
  const [, openLogin] = useLogin();
  if (shouldHideNavFoot) return null;
  return (
    <nav className="nav relative" style={{ backdropFilter: "blur(9px)" }}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center content-start overflow-hidden">
          <Link href="/browse">
            <a className="ml-2 mr-6" aria-label="Back to Explore">
              <SvgLogo
                className="mx-auto"
                fill="currentColor"
                width="112"
                height="32"
              />
            </a>
          </Link>
        </div>
        <div className="flex content-end items-center flex-none">
          <Link href="/new">
            <a aria-label="Add new" type="button" className="button p-2 mr-2">
              <SvgPlus />
            </a>
          </Link>
          <Link href="/settings">
            <a className="button p-2 mr-2" title="Settings">
              <SvgSettings />
            </a>
          </Link>
          {user ? (
            <div className="flex p-1 rounded-lg bg-background-secondary">
              <img
                alt={user.username}
                title={user.username}
                src={user.profilePicture}
                className="w-8 h-8 bg-background-secondary object-cover rounded"
              />
            </div>
          ) : (
            <button className="button" onClick={openLogin}>
              Join
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => {
  const router = useRouter();
  const shouldHideNavFoot = useMemo(
    () => noFooterRoutes.includes(router.pathname),
    [router]
  );
  if (shouldHideNavFoot) return null;
  return (
    <footer className="text-center mt-20 border-t-4 py-4 max-w-xl mx-auto border-background-secondary">
      <div className="mb-1 text-xs">
        <a
          href="https://www.facebook.com/withstereo/"
          target="_blank"
          rel="noreferrer"
          className="mx-2 font-bold opacity-50 hover:opacity-75"
        >
          Facebook
        </a>
        <a
          href="https://twitter.com/withstereo_"
          target="_blank"
          rel="noreferrer"
          className="mx-2 font-bold opacity-50 hover:opacity-75"
        >
          Twitter
        </a>
        <Link href="/privacy">
          <a className="mx-2 font-bold opacity-50 hover:opacity-75">Privacy</a>
        </Link>
        <a
          href="https://github.com/hoangvvo/stereo-web"
          target="_blank"
          rel="noreferrer"
          className="mx-2 font-bold opacity-50 hover:opacity-75"
        >
          Contribute
        </a>
        <Link href="/contact">
          <a className="mx-2 font-bold opacity-50 hover:opacity-75">Contact</a>
        </Link>
      </div>
      <p className="text-center opacity-50 mb-2 text-sm">
        © 2019. Made with{" "}
        <span role="img" aria-label="Love">
          ❤️
        </span>
        ,{" "}
        <span role="img" aria-label="Fire">
          🔥
        </span>
        , and a{" "}
        <span role="img" aria-label="Keyboard">
          ⌨️
        </span>{" "}
        by{" "}
        <a
          className="font-bold hover:text-foreground"
          href="https://hoangvvo.com/"
        >
          Hoang
        </a>{" "}
        and{" "}
        <a
          className="font-bold hover:text-foreground"
          href="https://github.com/hoangvvo/stereo-web/contributors"
        >
          contributors
        </a>
        .
      </p>
      <p
        className="text-foreground-tertiary px-4 leading-tight"
        style={{ fontSize: "0.6rem" }}
      >
        Music data provided by{" "}
        <a
          className="italic"
          rel="noreferrer nofollow"
          target="_blank"
          href="https://www.youtube.com/"
        >
          YouTube
        </a>{" "}
        and{" "}
        <a
          className="italic"
          rel="noreferrer nofollow"
          target="_blank"
          href="https://www.spotify.com/"
        >
          Spotify
        </a>
        . Cross-platform link powered by{" "}
        <a
          className="italic"
          rel="noreferrer nofollow"
          target="_blank"
          href="https://odesli.co/"
        >
          Odesli
        </a>
        .
      </p>
    </footer>
  );
};

const LayoutBg: React.FC = () => {
  const {
    state: { playingThemeColor },
  } = usePlayer();
  useEffect(() => {
    if (playingThemeColor)
      document.body.style.backgroundColor = playingThemeColor;
  }, [playingThemeColor]);
  return null;
};

export const MainLayout: React.FC = ({ children }) => {
  return (
    <>
      <Navbar />
      <LayoutBg />
      <PlayerMinibar />
      <main>{children}</main>
      <Footer />
    </>
  );
};
