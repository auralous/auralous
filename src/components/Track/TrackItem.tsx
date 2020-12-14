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
    <>
      <div className="flex items-center overflow-hidden w-full">
        {track ? (
          <img
            alt={track.title}
            className="h-12 w-12 rounded flex-none overflow-hidden mr-3"
            src={track.image}
          />
        ) : (
          <div className="block-skeleton rounded h-12 w-12 flex-none mr-3" />
        )}
        <div className="w-full overflow-hidden">
          {track ? (
            <>
              <div className="truncate content-start text-left">
                <span className="inline-flex h-6 align-middle px-1">
                  {SvgPlatformName && (
                    <SvgPlatformName width="16" className="fill-current" />
                  )}
                </span>{" "}
                <div className="inline align-middle font-bold text-sm">
                  {track.title}
                </div>
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
              <div className="block-skeleton rounded h-6 mb-1" />
              <div className="block-skeleton rounded h-4 w-3/4" />
            </>
          )}
        </div>
      </div>
    </>
  );
};
