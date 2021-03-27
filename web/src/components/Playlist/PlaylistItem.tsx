import { Typography } from "components/Typography";
import { Box } from "components/View";
import { Playlist } from "gql/gql.gen";
import { PLATFORM_FULLNAMES } from "utils/constants";

const PlaylistItem: React.FC<{
  playlist: Playlist;
}> = ({ playlist }) => {
  return (
    <Box row justifyContent="start" alignItems="center" gap="sm">
      <img
        className="h-12 w-12 flex-none"
        src={playlist.image}
        alt={playlist.name}
      />
      <Box>
        <Typography.Paragraph noMargin strong size="sm" align="left">
          {playlist.name}
        </Typography.Paragraph>
        <Typography.Paragraph
          noMargin
          size="xs"
          color="foreground-secondary"
          align="left"
        >
          {PLATFORM_FULLNAMES[playlist.platform]}
        </Typography.Paragraph>
      </Box>
    </Box>
  );
};

export default PlaylistItem;
