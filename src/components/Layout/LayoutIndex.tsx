import { SvgLogo, SvgMenu, SvgX } from "assets/svg";
import { usePlayer } from "components/Player/index";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { useI18n } from "i18n/index";
import { Locale } from "i18n/types";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { animated, useSpring } from "react-spring";
import { LANGUAGES } from "utils/constants";

const baseNavbarClassname = `text-center mx-1 focus:outline-none transition duration-300`;

const navBarClassName = `${baseNavbarClassname} py-3 font-bold px-2 opacity-50 focus:opacity-100 hover:opacity-100`;
const importantNavItemClassName = `${baseNavbarClassname} font-bold py-2 px-6 border-2 border-primary hover:border-white rounded-full`;

const NavbarLanguageSelector: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const LanguageChoices = useMemo(
    () =>
      Object.entries(LANGUAGES).map(([value, name]) => (
        <option key={value} value={value}>
          {name}
        </option>
      )),
    []
  );

  return (
    <select
      aria-label={t("settings.language.title")}
      value={locale}
      onChange={(e) => setLocale(e.currentTarget.value as Locale)}
      onBlur={undefined}
      className={`bg-transparent ${navBarClassName}`}
      style={{ textAlignLast: "center" }}
    >
      {LanguageChoices}
    </select>
  );
};

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
        className="w-full z-20 py-4 bg-gradient-to-b from-background to-transparent bg-opacity-50 fixed top-0"
        style={styles}
      >
        <div className="container flex items-center justify-between">
          <div className="flex items-center content-start overflow-hidden">
            <Spacer size={2} axis="horizontal" />
            <Link href="/">
              <a className="z-10" title={t("common.back")}>
                <SvgLogo
                  className="mx-auto fill-current"
                  width="112"
                  height="32"
                />
              </a>
            </Link>
            <Spacer size={8} axis="horizontal" />
          </div>
          <button
            className="px-2 py-1 z-10 md:hidden"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <SvgX /> : <SvgMenu />}
          </button>
          <div
            className={`${
              expanded
                ? "flex py-4 w-full absolute justify-center bg-background bg-opacity-75 flex-col right-0 top-0 pt-16 backdrop-blur"
                : "hidden"
            } md:flex content-end md:items-center flex-none`}
          >
            <Link href="/support">
              <a className={navBarClassName}>{t("support.title")}</a>
            </Link>
            <NavbarLanguageSelector />
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
    <footer className="text-center py-12 w-full mx-auto">
      <Spacer size={8} axis="vertical" />
      <Spacer size={8} axis="vertical" />
      <div className="space-x-4 overflow-scroll">
        <Typography.Link
          strong
          href="https://www.facebook.com/withstereo/"
          target="_blank"
        >
          Facebook
        </Typography.Link>
        <Typography.Link
          strong
          href="https://twitter.com/withstereo_"
          target="_blank"
        >
          Twitter
        </Typography.Link>
        <Link href="/privacy">
          <Typography.Link strong>{t("footer.privacy")}</Typography.Link>
        </Link>
        <Typography.Link
          href="https://www.facebook.com/withstereo/"
          target="_blank"
          strong
        >
          {t("footer.contribute")}
        </Typography.Link>
        <Link href="/support">
          <Typography.Link strong>{t("footer.support")}</Typography.Link>
        </Link>
      </div>
      <Spacer size={1} axis="vertical" />
      <Typography.Paragraph
        align="center"
        size="xs"
        color="foreground-tertiary"
      >
        {"© 2019. Made with ❤️, 🔥, and a ⌨️, by "}
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
      </Typography.Paragraph>
    </footer>
  );
};

const IndexLayout: React.FC = ({ children }) => {
  const { playStory } = usePlayer();
  // Stop playing since we have existed app pages
  useEffect(() => playStory(""), [playStory]);
  return (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
};

export default IndexLayout;
