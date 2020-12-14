import React from "react";
import { Playlist } from "~/types/index";
import { SvgByPlatformName } from "~/lib/constants";
import { useI18n } from "~/i18n/index";

const PlaylistItem: React.FC<{
  playlist: Playlist;
  extraInfo?: string | React.ReactElement;
}> = ({ playlist, extraInfo }) => {
  const { t } = useI18n();
  const SvgPlatformName = SvgByPlatformName[playlist.platform];
  return (
    <div className="flex justify-start font-normal">
      <img
        className="w-12 h-12 rounded object-cover"
        src={playlist.image}
        alt={playlist.title}
      />
      <div className="ml-2 text-left">
        <p>
          <span className="mr-1 align-middle text-white text-opacity-50">
            <SvgPlatformName
              className="inline fill-current stroke-0"
              width="18"
            />
          </span>
          {playlist.title}
        </p>
        <p className="text-foreground-tertiary text-sm">
          {playlist.tracks.length} {t("common.tracks")}
          {extraInfo && (
            <>
              {" • "}
              {extraInfo}
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default PlaylistItem;
