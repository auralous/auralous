import { SvgLogo, SvgPlay } from "assets/svg";
import { Typography } from "components/Typography";
import { useI18n } from "i18n/index";
import Link from "next/link";
import React from "react";

const AppLinks = () => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col mb-16">
      <Link href="/listen">
        <a className="btn text-center px-10 py-5 rounded-full mb-2 bg-primary hover:opacity-75 transition-opacity">
          {t("intro.use.action")}
        </a>
      </Link>
      <button
        onClick={() => alert("Coming soon")}
        className="btn btn-transparent font-medium text-foreground-secondary hover:text-foreground"
      >
        {t("intro.use.watch")}{" "}
        <SvgPlay className="text-primary fill-current ml-2 w-3 h-3" />
      </button>
    </div>
  );
};

const IndexHero: React.FC = () => {
  const { t } = useI18n();

  return (
    <>
      <section className="relative -mt-24 pt-36 pb-16 w-full bg-background-secondary">
        <div className="relative z-10 h-full flex flex-col flex-center">
          <Typography.Title>
            <span className="sr-only">Stereo</span>
            <SvgLogo className="w-52 h-12 fill-current max-w-full" />
          </Typography.Title>
          <Typography.Title level={2} color="primary-dark" align="center">
            {t("motto")}
          </Typography.Title>
          <div className="max-w-2xl mx-auto">
            <Typography.Paragraph color="foreground-tertiary" align="center">
              {t("description")}
            </Typography.Paragraph>
          </div>
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
