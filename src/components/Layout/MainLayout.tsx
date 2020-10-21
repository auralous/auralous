import React, { useEffect, useMemo, useRef } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import NProgress from "nprogress";
// @ts-ignore
import ColorThief from "colorthief";
import NowPlayingPill from "./NowPlayingPill";
import { usePlayer } from "~/components/Player/index";
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
    <nav className="nav fixed" style={{ backdropFilter: "blur(9px)" }}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center content-start overflow-hidden">
          <Link href="/explore">
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
          <NowPlayingPill />
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
            <img
              alt={user.username}
              title={user.username}
              src={user.profilePicture}
              className="w-10 h-10 bg-background-secondary object-cover rounded"
            />
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
      <div className="mb-1">
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
        <Link href="/contact">
          <a className="mx-2 font-bold opacity-50 hover:opacity-75">Contact</a>
        </Link>
      </div>
      <p className="text-center opacity-50 mb-2">
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
        </a>
        .
      </p>
      <p className="text-foreground-tertiary text-xs px-4 leading-tight">
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
    state: { playerPlaying },
  } = usePlayer();
  const colorThief = useRef<any>();
  useEffect(() => {
    if (!playerPlaying) return;
    colorThief.current = colorThief.current || new ColorThief();
    const img = new Image();
    img.addEventListener("load", async () => {
      document.body.style.backgroundColor = `rgb(${colorThief
        .current!.getColor(img)
        .join(", ")}`;
    });
    img.crossOrigin = "Anonymous";
    img.src = playerPlaying.image;
  }, [playerPlaying]);
  return null;
};

export const MainLayout: React.FC = ({ children }) => {
  return (
    <>
      <Navbar />
      <LayoutBg />
      <main>{children}</main>
      <Footer />
    </>
  );
};
