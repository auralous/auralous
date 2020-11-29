import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSpring, animated } from "react-spring";
import { PlayerMinibar } from "~/components/Player/index";
import { useI18n } from "~/i18n/index";
import { SvgLogo, SvgMenu, SvgX } from "~/assets/svg";

const navBarClassName =
  "text-center py-3 font-medium px-2 mx-3 opacity-50 hover:opacity-100 transition-opacity duration-300";
const importantNavItemClassName =
  "text-center border-pink hover:border-white hover:bg-opacity-10 font-bold rounded-full border-2 px-6 py-2 mx-3 transition duration-300";

const Navbar: React.FC = () => {
  const { t } = useI18n();
  const [active, setActive] = useState(true);

  const styles = useSpring(
    active
      ? { transform: "translateY(0px)" }
      : { transform: "translateY(-120px)" }
  );

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let prev = window.scrollY;
    const scrollHandler = () => {
      if (!expanded) {
        if (window.scrollY > prev)
          // scroll down
          setActive(false);
        else setActive(true);
      }
      prev = window.scrollY;
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [expanded]);

  return (
    <>
      <animated.nav
        className="w-full z-20 py-4 bg-gradient-to-b from-blue to-transparent bg-opacity-50 fixed top-0"
        style={styles}
      >
        <div className="container flex items-center justify-between">
          <div className="flex items-center content-start overflow-hidden">
            <Link href="/">
              <a className="ml-2 mr-6 z-10" aria-label={t("common.backToHome")}>
                <SvgLogo
                  className="mx-auto fill-current"
                  width="112"
                  height="32"
                />
              </a>
            </Link>
          </div>
          <button
            className="px-2 py-1 z-10 sm:hidden"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <SvgX /> : <SvgMenu />}
          </button>
          <div
            className={`${
              expanded
                ? "flex py-4 w-full absolute justify-center bg-blue bg-opacity-75 flex-col right-0 top-0 pt-16 backdrop-blur"
                : "hidden"
            } sm:flex content-end sm:items-center flex-none`}
          >
            <Link href="/support">
              <a className={navBarClassName}>{t("support.title")}</a>
            </Link>
            <Link href="/settings">
              <a className={navBarClassName}>{t("settings.title")}</a>
            </Link>
            <Link href="/listen">
              <a className={importantNavItemClassName}>{t("player.play")}</a>
            </Link>
          </div>
        </div>
      </animated.nav>
    </>
  );
};

const Footer: React.FC = () => {
  const { t } = useI18n();
  return (
    <footer className="text-center mt-20 py-12 w-full mx-auto bg-gradient-to-t from-blue-secondary to-blue">
      <div className="mb-1 text-sm overflow-auto opacity-75">
        <a
          href="https://www.facebook.com/withstereo/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-transparent p-0 mx-2"
        >
          Facebook
        </a>
        <a
          href="https://twitter.com/withstereo_"
          target="_blank"
          rel="noreferrer"
          className="btn btn-transparent p-0 mx-2"
        >
          Twitter
        </a>
        <Link href="/privacy">
          <a className="btn btn-transparent p-0 mx-2">{t("footer.privacy")}</a>
        </Link>
        <a
          href="https://github.com/hoangvvo/stereo-web"
          target="_blank"
          rel="noreferrer"
          className="btn btn-transparent p-0 mx-2"
        >
          {t("footer.contribute")}
        </a>
        <Link href="/support">
          <a className="btn btn-transparent p-0 mx-2">{t("footer.support")}</a>
        </Link>
      </div>
      <p className="text-center opacity-50 mb-2 text-xs">
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

const IndexLayout: React.FC = ({ children }) => {
  return (
    <>
      <Navbar />
      <PlayerMinibar />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
};

export default IndexLayout;
