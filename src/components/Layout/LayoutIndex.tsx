import { SvgLogo, SvgMenu, SvgX } from "assets/svg";
import clsx from "clsx";
import { usePlayer } from "components/Player";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useI18n } from "i18n/index";
import { Locale } from "i18n/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
        className="w-full flex justify-center z-20 py-4 fixed top-0"
        style={styles}
      >
        <Box
          maxWidth="4xl"
          fullWidth
          paddingX={4}
          row
          alignItems="center"
          justifyContent="between"
        >
          <Box alignItems="center">
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
          </Box>
          <button
            className="px-2 py-1 z-10 md:hidden"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <SvgX /> : <SvgMenu />}
          </button>
          <div
            className={clsx(
              expanded
                ? "flex py-4 w-full absolute justify-center bg-background-secondary flex-col right-0 top-0 pt-16"
                : "hidden",
              "md:flex content-end md:items-center flex-none"
            )}
          >
            <Link href="/contact">
              <a className={navBarClassName}>{t("contact.title")}</a>
            </Link>
            <NavbarLanguageSelector />
            <Link href="/listen">
              <a className={importantNavItemClassName}>{t("player.play")}</a>
            </Link>
          </div>
        </Box>
      </animated.nav>
    </>
  );
};

const Footer: React.FC = () => {
  const { t } = useI18n();
  return (
    <footer className="py-12 w-full mx-auto">
      <Spacer size={8} axis="vertical" />
      <Spacer size={8} axis="vertical" />
      <div className="space-x-4 overflow-auto text-center">
        <Typography.Link strong href="/goto/facebook" target="_blank">
          Facebook
        </Typography.Link>
        <Typography.Link strong href="/goto/twitter" target="_blank">
          Twitter
        </Typography.Link>
        <Link passHref href="/privacy">
          <Typography.Link strong>{t("footer.privacy")}</Typography.Link>
        </Link>
        <Typography.Link href="/goto/github" target="_blank" strong>
          GitHub
        </Typography.Link>
        <Link href="/contact">
          <Typography.Link strong>{t("footer.contact")}</Typography.Link>
        </Link>
      </div>
      <Spacer size={1} axis="vertical" />
      <Typography.Paragraph
        align="center"
        size="xs"
        color="foreground-tertiary"
      >
        {"© 2019. Made with ❤️, 🔥, and a ⌨️, by "}
        <Typography.Link
          color="foreground-secondary"
          strong
          href="https://hoangvvo.com/"
        >
          Hoang
        </Typography.Link>{" "}
        and{" "}
        <Typography.Link
          color="foreground-secondary"
          strong
          href="/goto/github"
        >
          contributors
        </Typography.Link>
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
