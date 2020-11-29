import React from "react";
import Link from "next/link";
import { useI18n } from "~/i18n/index";
import { SvgLogo, SvgPlay } from "~/assets/svg";

const AppLinks = () => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col mb-16">
      <Link href="/listen">
        <a className="btn text-center px-10 py-5 rounded-full mb-2 bg-pink hover:opacity-75 transition-opacity">
          {t("intro.use.action")}
        </a>
      </Link>
      <button
        onClick={() => alert("Coming soon")}
        className="btn btn-transparent font-medium text-foreground-secondary hover:text-foreground"
      >
        {t("intro.use.watch")}{" "}
        <SvgPlay className="text-pink fill-current ml-2 w-3 h-3" />
      </button>
    </div>
  );
};

const IndexHero: React.FC = () => {
  const { t } = useI18n();

  return (
    <>
      <section className="relative -mt-24 pt-36 pb-16 w-full bg-gradient-to-b from-blue-tertiary to-blue">
        <div className="relative z-10 h-full flex flex-col flex-center">
          <h1 className="font-black leading-none text-center">
            <span className="sr-only">Stereo</span>
            <SvgLogo
              width="400"
              height="60"
              className="mx-auto fill-current max-w-full"
            />
          </h1>
          <h2
            className="font-black text-2xl mt-2 mb-4"
            style={{ color: "#ff2f56" }}
          >
            {t("motto")}
          </h2>
          <p className="px-4 mb-8 font-medium text-center max-w-2xl text-foreground-tertiary">
            {t("description")}
          </p>
          <AppLinks />
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="h-24 text-background fill-current absolute bottom-0 w-full pointer-events-none"
        >
          <path d="M0,224L40,218.7C80,213,160,203,240,213.3C320,224,400,256,480,240C560,224,640,160,720,144C800,128,880,160,960,149.3C1040,139,1120,85,1200,96C1280,107,1360,181,1400,218.7L1440,256L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
        </svg>
      </section>
    </>
  );
};

export default IndexHero;
