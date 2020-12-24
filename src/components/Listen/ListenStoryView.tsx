import React from "react";
import { usePlayer } from "~/components/Player";
import { Story, useNowPlayingQuery, useTrackQuery } from "~/graphql/gql.gen";
import PlayerView from "~/components/Player/PlayerView";
import StoryNav from "~/components/Story/StoryNav";

const ListenStoryView: React.FC<{ story: Story }> = ({ story }) => {
  const {
    state: { fetching: fetchingPlayer, crossTracks, playingStoryId },
  } = usePlayer();

  const [
    { data: { nowPlaying } = { nowPlaying: undefined } },
  ] = useNowPlayingQuery({ variables: { id: story.id }, pause: !story.isLive });

  const [{ data: dataTrack, fetching: fetchingTrack }] = useTrackQuery({
    variables: { id: nowPlaying?.currentTrack?.trackId || "" },
    pause: !nowPlaying?.currentTrack,
  });

  // story.isLive === false means fetching because
  // we do not know what is the current track unless
  // user start tuning in (allowing us to know the queue item)
  const fetching = fetchingTrack || fetchingPlayer || story.isLive === false;

  // if story.isLive, show current nowPlaying track
  // otherwise, show playerPlaying/crossTracks (which is queue item)
  const track = story.isLive
    ? dataTrack?.track
    : !fetchingPlayer && playingStoryId === story.id
    ? crossTracks?.original
    : undefined;

  return (
    <>
      <div className="w-full max-w-xl mx-auto h-full box-border">
        <PlayerView
          Header={<StoryNav story={story} />}
          hideControl
          track={track}
          fetching={fetching}
        />
      </div>
    </>
  );
};

export default ListenStoryView;
