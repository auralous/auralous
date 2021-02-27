import { Skeleton } from "components/Loading";
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
        <Skeleton show={!track}>
          <img alt={track?.title} className="h-12 w-12" src={track?.image} />
        </Skeleton>
        <Spacer size={2} axis="horizontal" />
        <Box flex={1} minWidth={0} gap="xs">
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
                color="foregroundSecondary"
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
              <Skeleton show height={6} width={40} />
              <Skeleton show height={4} width={32} />
            </>
          )}
        </Box>
      </Box>
    </>
  );
};
