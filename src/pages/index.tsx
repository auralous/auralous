import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
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
        Music Together
      </h2>
    </div>
  );
};

const AppLinks = () => {
  return (
    <div className="flex flex-col mb-16">
      <Link href="/browse">
        <a className="button text-center px-12 py-4 rounded-full mb-2 bg-pink">
          Use Web App
        </a>
      </Link>
      <div className="button bg-transparent opacity-50 text-center px-12 py-4 rounded-full mb-2">
        iOS<div className="text-xs opacity-75 ml-2">(Coming Soon)</div>
      </div>
      <div className="button bg-transparent opacity-50 text-center px-12 py-4 rounded-full mb-2">
        Android<div className="text-xs opacity-75 ml-2">(Coming Soon)</div>
      </div>
    </div>
  );
};

const IndexListen: React.FC = () => {
  return (
    <IndexSection>
      <IndexTitle>Listen Anywhere</IndexTitle>
      <IndexParagraph>
        Stereo integrates with the music applications you know and love. All you
        need is a YouTube or Spotify account.
      </IndexParagraph>
      <div className="flex justify-center py-4 opacity-50">
        <SvgYoutube width="52" height="52" className="fill-current mx-4" />
        <SvgSpotify width="52" height="52" className="fill-current mx-4" />
      </div>
      <IndexParagraph>
        <i>Your friend listens to a different music application?</i> No worry,
        you can still listen together by letting Stereo find and play that same
        song on your application instead.
      </IndexParagraph>
      <div className="flex justify-center py-2 mt-4">
        <Link href="/new">
          <a className="button">Start Listening</a>
        </Link>
      </div>
    </IndexSection>
  );
};

const IndexPlaylist: React.FC = () => {
  const router = useRouter();
  return (
    <IndexSection>
      <IndexTitle>Quick Start</IndexTitle>
      <IndexParagraph>
        It takes less than 30 seconds to start listening together. Just
        copy-paste the playlist link and start right away.
      </IndexParagraph>
      <IndexParagraph>
        Have a good playlist to share with friends? Did your favorite artist
        just release their new album? Just grab the link and go!
      </IndexParagraph>
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
        />
        <button className="button flex-none ml-1">Go</button>
      </form>
    </IndexSection>
  );
};

const IndexRoomRules: React.FC = () => {
  return (
    <IndexSection>
      <IndexTitle>Your Room. Your Rule.</IndexTitle>
      <IndexParagraph>
        Listen either in public or private rooms. Set a password to avoid
        unwelcome guests. Only collaborators can add songs, but everyone can
        chat and add their reactions.
      </IndexParagraph>
      <IndexParagraph>
        Invite your close friends to be moderators. Ban offended messages and
        people. Customize room rules so that your friends know what songs can be
        added. <b>You are in control</b>.
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
  return (
    <>
      <NextSeo
        title="Stereo"
        titleTemplate="%s · Share music in realtime"
        description="Stereo is a free internet music community. Join a room."
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
