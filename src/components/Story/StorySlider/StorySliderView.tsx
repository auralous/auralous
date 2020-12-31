import React from "react";
import Link from "next/link";
import { usePlayer } from "~/components/Player";
import { PlayerImage, PlayerMeta } from "~/components/Player/PlayerView";
import StoryNav from "~/components/Story/StoryNav";
import {
  Story,
  useNowPlayingQuery,
  useTrackQuery,
  useUserQuery,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const StorySliderView: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const {
    state: { fetching: fetchingPlayer, crossTracks, playingStoryId },
    skipForward,
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

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId },
  });

  return (
    <div className="p-4 relative box-border w-full h-full flex flex-col justify-center">
      <StoryNav story={story} />
      <PlayerImage track={track} />
      <PlayerMeta track={track} fetching={fetching && !track} />
      <div className="w-full">
        <p className="text-lg text-foreground-secondary text-center mb-1 truncate">
          {t(story?.isLive ? "listen.promptJoin" : "listen.promptJoinNolive", {
            username: user?.username || "",
          })}
        </p>
        <Link href={`/story/${story?.id}`}>
          <a className="btn bg-opacity-75 w-full">
            {story?.isLive
              ? t("listen.actionJoin")
              : t("listen.actionJoinNoLive")}
          </a>
        </Link>
      </div>
      {/* TODO: a11y */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        role="button"
        tabIndex={0}
        className="absolute top-24 left-0 w-full opacity-0"
        aria-label={t("player.skipForward")}
        onClick={skipForward}
        style={{
          height: "calc(100% - 14rem)",
        }}
      />
    </div>
  );
};

export default StorySliderView;
