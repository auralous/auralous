import React from "react";
import { parseMs } from "~/lib/editor-utils";
import { useTrackQuery } from "~/graphql/gql.gen";
import { SvgByPlatformName } from "~/lib/constants";

export const TrackItem: React.FC<{
  id: string;
  extraInfo?: string | React.ReactElement;
}> = ({ id, extraInfo }) => {
  const [{ data: { track } = { track: null } }] = useTrackQuery({
    variables: { id },
  });
  const SvgPlatformName = track?.platform
    ? SvgByPlatformName[track.platform]
    : null;
  return (
    <div className="flex items-center overflow-hidden w-full">
      {track ? (
        <img
          alt={track.title}
          className="h-12 w-12 rounded-lg flex-none overflow-hidden mr-3"
          src={track.image}
        />
      ) : (
        <div className="h-12 w-12 rounded-lg flex-none overflow-hidden mr-3 animate-pulse bg-black bg-opacity-25" />
      )}
      <div className="w-full overflow-hidden">
        {track ? (
          <>
            <div className="truncate content-start text-left">
              <span className="inline-flex h-6 align-middle px-1">
                {SvgPlatformName && (
                  <SvgPlatformName width="16" fill="currentColor" />
                )}
              </span>
              <h4 className="inline align-middle font-bold text-sm">
                {" "}
                {track.title}
              </h4>
            </div>
            <div className="flex text-xs text-foreground-secondary">
              <span className="mr-1 flex-none">
                {(() => {
                  const [sec, min] = parseMs(track.duration, true);
                  return `${min}:${sec}`;
                })()}
                {" • "}
              </span>
              <span className="truncate mr-1">
                {track.artists.map(({ name }) => name).join(", ")}
              </span>
              {extraInfo && (
                <>
                  {" • "}
                  {extraInfo}
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="h-6 animate-pulse bg-black bg-opacity-25 rounded-lg mb-1" />
            <div className="h-4 animate-pulse bg-black bg-opacity-25 rounded-lg w-3/4" />
          </>
        )}
      </div>
    </div>
  );
};
