import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
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
      <Box fullWidth row alignItems="center">
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
              <Typography.Paragraph noMargin truncate align="left">
                {SvgPlatformName && (
                  <SvgPlatformName className="fill-current inline w-4 h-4" />
                )}{" "}
                <Spacer size={1} axis="horizontal" />
                <Typography.Text strong size="sm">
                  {track.title}
                </Typography.Text>
              </Typography.Paragraph>
              <Typography.Paragraph
                normal
                size="xs"
                noMargin
                truncate
                align="left"
                color="foreground-secondary"
              >
                {(() => {
                  const [sec, min] = parseMs(track.duration, true);
                  return `${min}:${sec}`;
                })()}
                {" • "}
                <Typography.Text truncate>
                  {track.artists.map(({ name }) => name).join(", ")}
                </Typography.Text>
                {extraInfo && (
                  <>
                    {" • "}
                    {extraInfo}
                  </>
                )}
              </Typography.Paragraph>
            </>
          ) : (
            <>
              <div className="block-skeleton rounded h-6 mb-1" />
              <div className="block-skeleton rounded h-4 w-3/4" />
            </>
          )}
        </div>
      </Box>
    </>
  );
};
