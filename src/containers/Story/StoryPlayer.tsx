import { PlayerImage, PlayerMeta, usePlayer } from "components/Player";
import { Box } from "components/View";
import { Story } from "gql/gql.gen";
import StoryReaction from "./StoryReaction";

const StoryPlayer: React.FC<{ story: Story }> = ({ story }) => {
  const {
    state: { crossTracks, fetching },
  } = usePlayer();

  return (
    <Box maxWidth="lg" fullWidth fullHeight>
      <PlayerImage track={crossTracks?.original} />
      <Box row justifyContent="between">
        <Box row flex={1} minWidth={0}>
          <PlayerMeta track={crossTracks?.original} fetching={fetching} />
        </Box>
        {story.isLive && <StoryReaction story={story} />}
      </Box>
    </Box>
  );
};

export default StoryPlayer;
