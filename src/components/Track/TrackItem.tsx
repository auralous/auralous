import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { useTrackQuery } from "gql/gql.gen";
import { SvgByPlatformName } from "utils/constants";
import { parseMs } from "utils/editor-utils";

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
            className="h-12 w-12 rounded flex-none overflow-hidden"
            src={track.image}
          />
        ) : (
          <div className="block-skeleton rounded h-12 w-12 flex-none" />
        )}
        <Spacer size={2} axis="horizontal" />
        <div className="w-full overflow-hidden">
          {track ? (
            <>
              <div className="truncate content-start text-left">
                {SvgPlatformName && (
                  <SvgPlatformName className="fill-current inline w-4 h-4" />
                )}{" "}
                <Spacer size={1} axis="horizontal" />
                <Typography.Text strong size="sm">
                  {track.title}
                </Typography.Text>
              </div>
              <div className="flex text-xs text-foreground-secondary font-normal">
                <span className="flex-none">
                  {(() => {
                    const [sec, min] = parseMs(track.duration, true);
                    return `${min}:${sec}`;
                  })()}
                  {" • "}
                </span>
                <Spacer size={1} axis="horizontal" />
                <Typography.Text truncate>
                  {track.artists.map(({ name }) => name).join(", ")}
                </Typography.Text>
                {extraInfo && (
                  <>
                    <Spacer size={1} axis="horizontal" />
                    {" • "}
                    <Spacer size={1} axis="horizontal" />
                    {extraInfo}
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="block-skeleton rounded h-6" />
              <Spacer size={1} axis="vertical" />
              <div className="block-skeleton rounded h-4 w-3/4" />
            </>
          )}
        </div>
      </div>
    </>
  );
};
