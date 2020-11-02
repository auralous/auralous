import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { SvgLogo, SvgSpotify, SvgYoutube } from "~/assets/svg";

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
        Listen Together
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

const ListenEverywhereSection: React.FC = () => {
  return (
    <section className="py-16 container mx-auto max-w-3xl text-sm sm:text-md">
      <h2 className="text-center font-bold text-2xl sm:text-4xl mb-4">
        Listen Anywhere
      </h2>
      <p className="text-center text-foreground-secondary">
        Stereo integrates with the music applications you know and love. All you
        need is a YouTube or Spotify account.
      </p>
      <div className="flex justify-center py-4 opacity-50">
        <SvgYoutube width="52" height="52" className="fill-current mx-4" />
        <SvgSpotify width="52" height="52" className="fill-current mx-4" />
      </div>
      <p className="text-center text-foreground-secondary">
        <i>Your friend listens on a different music application?</i> No worry,
        you can still listen together by letting Stereo find and play that same
        song on your application instead.
      </p>
      <div className="flex justify-center py-2 mt-4">
        <Link href="/new">
          <a className="button">Start Listening</a>
        </Link>
      </div>
    </section>
  );
};

const StartWithPlaylistSection: React.FC = () => {
  const router = useRouter();
  return (
    <section className="py-16 container mx-auto max-w-3xl text-sm sm:text-md">
      <h2 className="text-center font-bold text-2xl sm:text-4xl mb-4">
        Quick Start
      </h2>
      <p className="text-center text-foreground-secondary mb-2">
        It takes less than 30 seconds to start listening together. Just
        copy-paste the playlist link and start right away.
      </p>
      <p className="text-center text-foreground-secondary mb-4">
        Have a good playlist to share with friends? Did your favorite artist
        just release their new album? Grab the link and start listening
        together!
      </p>
      <form
        className="flex justify-center"
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
    </section>
  );
};

const RoomRuleSection: React.FC = () => {
  return (
    <section className="py-16 container mx-auto max-w-3xl text-sm sm:text-md">
      <h2 className="text-center font-bold text-2xl sm:text-4xl mb-4">
        Your Room. Your Rule.
      </h2>
      <p className="text-center text-foreground-secondary mb-4">
        Listen either in public or private room. Only assigned collaborators can
        add songs. Need some help in managing your room? Invite your close
        friends to be moderators.
      </p>
    </section>
  );
};

const IndexPage: React.FC = () => {
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
        <IndexIntro />
        <AppLinks />
        <ListenEverywhereSection />
        <StartWithPlaylistSection />
        <RoomRuleSection />
      </div>
    </>
  );
};

export default IndexPage;
