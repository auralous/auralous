import React, { useMemo } from "react";
import { PlatformName } from "~/graphql/gql.gen";
import Link from "next/link";
import usePlayer from "./usePlayer";
import { useLogin } from "~/components/Auth";
import { useI18n } from "~/i18n/index";
import { SvgLogIn, SvgX } from "~/assets/svg";
import { PLATFORM_FULLNAMES, SvgByPlatformName } from "~/lib/constants";

const PlayerPlatformChooser: React.FC = () => {
  const { t } = useI18n();

  const { stopPlaying, setGuestPlayingPlatform } = usePlayer();

  const [, showLogin] = useLogin();

  const PlatformChoices = useMemo(
    () =>
      Object.entries(PLATFORM_FULLNAMES).map(([value, plname]) => {
        const pl = value as PlatformName;
        const SvgPlatform = SvgByPlatformName[pl];
        return (
          <button
            key={pl}
            onClick={() => setGuestPlayingPlatform(pl)}
            className={`btn m-1 h-8 py-1 px-2 brand-${pl} align-top`}
          >
            <SvgPlatform
              width="16"
              className="fill-current sm:mr-2"
              strokeWidth="0"
            />
            <span className="text-xs sr-only sm:not-sr-only">
              Listen on {plname}
            </span>
          </button>
        );
      }),
    [setGuestPlayingPlatform]
  );

  return (
    <div className="relative bg-blue-secondary h-24overflow-auto">
      <div className="font-bold text-center pt-1">
        {t("player.platformChooser.title")}
      </div>
      <div className="text-center overflow-auto">
        <button onClick={showLogin} className="m-1 btn py-1 px-2 align-top">
          <SvgLogIn width="16" className="sm:mr-2" />
          <span className="text-xs sr-only sm:not-sr-only">
            {t("common.signIn")} Stereo
          </span>
        </button>
        {PlatformChoices}
        <button
          onClick={stopPlaying}
          className="btn absolute top-2 right-2 btn-transparent p-1"
          title={t("player.stopPlaying")}
        >
          <SvgX />
        </button>
      </div>
      <div className="text-foreground-tertiary container">
        <p className="text-center py-1 text-xs">
          {t("player.platformChooser.helpText")}{" "}
          <Link href="/settings">
            <button className="underline" onClick={stopPlaying}>
              {t("settings.title")}
            </button>
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default PlayerPlatformChooser;
