import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Playlist } from "gql/gql.gen";
import { PLATFORM_FULLNAMES } from "utils/constants";

const PlaylistItem: React.FC<{
  playlist: Playlist;
}> = ({ playlist }) => {
  return (
    <div className="flex justify-start items-center">
      <img
        className="h-12 w-12 rounded flex-none"
        src={playlist.image}
        alt={playlist.name}
      />
      <Spacer size={2} axis="horizontal" />
      <div>
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
      </div>
    </div>
  );
};

export default PlaylistItem;
