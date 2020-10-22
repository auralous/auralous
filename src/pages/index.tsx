import React from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { SvgLogo } from "~/assets/svg";

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
    <div className="flex flex-col">
      <Link href="/browse">
        <a className="button text-center px-12 py-4 rounded-full mb-2 bg-pink">
          Use Web App
        </a>
      </Link>
      <div className="button text-center px-12 py-4 rounded-full mb-2">
        iOS<div className="text-xs opacity-75 ml-2">(Coming Soon)</div>
      </div>
      <div className="button text-center  px-12 py-4 rounded-full mb-2">
        Android<div className="text-xs opacity-75 ml-2">(Coming Soon)</div>
      </div>
    </div>
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
        className="px-4 flex flex-col place-center"
        style={{ minHeight: "calc(100vh - 13rem)" }}
      >
        <IndexIntro />
        <AppLinks />
      </div>
    </>
  );
};

export default IndexPage;
