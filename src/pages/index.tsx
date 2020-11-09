import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useI18n } from "~/i18n/index";
import { SvgChevronDown, SvgLogo, SvgSpotify, SvgYoutube } from "~/assets/svg";

const IndexSection: React.FC = ({ children }) => {
  return (
    <section className="py-16 container mx-auto max-w-3xl text-sm sm:text-md">
      {children}
    </section>
  );
};

const IndexParagraph: React.FC = ({ children }) => (
  <p className="text-center text-foreground-secondary mb-2">{children}</p>
);

const IndexTitle: React.FC = ({ children }) => (
  <h2 className="text-center font-bold text-2xl sm:text-4xl mb-4">
    {children}
  </h2>
);

const IndexIntro = () => {
  const { t } = useI18n();
  return (
    <div className="container py-16 text-center">
      <h1 className="font-black leading-none text-center">
        <span className="sr-only">Stereo</span>
        <SvgLogo
          width="400"
          height="60"
          className="mx-auto fill-current max-w-full"
        />
      </h1>
      <h2 className="font-medium text-2xl mt-6" style={{ color: "#ff2f56" }}>
        {t("motto")}
      </h2>
    </div>
  );
};

const AppLinks = () => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col mb-16">
      <Link href="/browse">
        <a className="button text-center px-12 py-4 rounded-full mb-2 bg-pink">
          {t("intro.use.action")} {t("intro.use.web")}
        </a>
      </Link>
      <div className="button bg-transparent opacity-50 text-center px-12 py-4 rounded-full mb-2">
        iOS
        <div className="text-xs opacity-75 ml-2">
          {t("intro.use.comingSoon")}
        </div>
      </div>
      <div className="button bg-transparent opacity-50 text-center px-12 py-4 rounded-full mb-2">
        Android
        <div className="text-xs opacity-75 ml-2">
          {t("intro.use.comingSoon")}
        </div>
      </div>
    </div>
  );
};

const IndexListen: React.FC = () => {
  const { t } = useI18n();
  return (
    <IndexSection>
      <IndexTitle>{t("intro.listen.title")}</IndexTitle>
      <IndexParagraph>{t("intro.listen.description")}</IndexParagraph>
      <div className="flex justify-center py-4 opacity-50">
        <SvgYoutube width="52" height="52" className="fill-current mx-4" />
        <SvgSpotify width="52" height="52" className="fill-current mx-4" />
      </div>
      <IndexParagraph>{t("intro.listen.p")}</IndexParagraph>
      <div className="flex justify-center py-2 mt-4">
        <Link href="/new">
          <a className="button">{t("intro.listen.action")}</a>
        </Link>
      </div>
    </IndexSection>
  );
};

const IndexPlaylist: React.FC = () => {
  const router = useRouter();
  const { t } = useI18n();
  return (
    <IndexSection>
      <IndexTitle>{t("intro.playlist.title")}</IndexTitle>
      <IndexParagraph>{t("intro.playlist.p1")}</IndexParagraph>
      <IndexParagraph>{t("intro.playlist.p2")}</IndexParagraph>
      <form
        className="flex justify-center mt-2"
        onSubmit={(event) => {
          event.preventDefault();
          const val = event.currentTarget.playlistLink.value.trim();
          val && router.push(`/new?search=${val}`);
        }}
      >
        <input
          name="playlistLink"
          className="input"
          placeholder="Enter a playlist link"
          aria-label="Playlist Link"
        />
        <button className="button flex-none ml-1">
          {t("intro.playlist.action")}
        </button>
      </form>
    </IndexSection>
  );
};

const IndexRoomRules: React.FC = () => {
  const { t } = useI18n();
  return (
    <IndexSection>
      <IndexTitle>{t("intro.rules.title")}</IndexTitle>
      <IndexParagraph>{t("intro.rules.p1")}</IndexParagraph>
      <IndexParagraph>
        {t("intro.rules.p2")} <b>{t("intro.rules.p2Bold")}</b>.
      </IndexParagraph>
    </IndexSection>
  );
};

const IndexPage: React.FC = () => {
  const aboveIntro = useRef<HTMLDivElement>(null);
  const scrollToSection = () => {
    aboveIntro.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title="Stereo"
        titleTemplate={`%s · ${t("motto")}`}
        description={t("description")}
        canonical={`${process.env.APP_URI}/`}
      />
      <div
        className="px-4 flex flex-col items-center"
        style={{ minHeight: "calc(100vh - 13rem)" }}
      >
        <div className="relative min-h-screen flex flex-col flex-center">
          <IndexIntro />
          <AppLinks />
          <button
            onClick={scrollToSection}
            className="absolute-center opacity-50 hover:opacity-100 top-auto bottom-8"
            aria-label="Scroll down"
          >
            <SvgChevronDown
              width={32}
              height={32}
              className="animate-bounce "
            />
          </button>
        </div>
        <div ref={aboveIntro} />
        <IndexListen />
        <IndexPlaylist />
        <IndexRoomRules />
      </div>
    </>
  );
};

export default IndexPage;
