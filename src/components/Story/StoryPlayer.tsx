import { usePlayer } from "components/Player/index";
import { PlayerImage, PlayerMeta } from "components/Player/PlayerView";
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
        <PlayerMeta track={crossTracks?.original} fetching={fetching} />
        {story.isLive && <StoryReaction story={story} />}
      </Box>
    </Box>
  );
};

export default StoryPlayer;
