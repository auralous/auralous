import React from "react";
import Link from "next/link";
import { usePlayer } from "~/components/Player";
import PlayerView from "~/components/Player/PlayerView";
import StoryNav from "~/components/Story/StoryNav";
import {
  Story,
  useNowPlayingQuery,
  useTrackQuery,
  useUserQuery,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const StorySliderAction: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId },
  });

  return (
    <div className="px-2 py-4 absolute z-10 bottom-0 w-full">
      <p className="text-lg text-foreground-secondary text-center mb-1">
        {t(story?.isLive ? "listen.promptJoin" : "listen.promptJoinNolive", {
          username: user?.username || "",
        })}
      </p>
      <Link href={`/story/${story?.id}`}>
        <a className="btn btn-primary w-full">
          {story?.isLive
            ? t("listen.actionJoin")
            : t("listen.actionJoinNoLive")}
        </a>
      </Link>
    </div>
  );
};

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

  return (
    <>
      <div className="relative w-full h-full box-border">
        <PlayerView
          Header={<StoryNav story={story} />}
          hideControl
          track={track}
          fetching={fetching}
        />
        {/* TODO: a11y */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <div
          role="button"
          tabIndex={0}
          className="absolute top-24 w-full opacity-0"
          aria-label={t("player.skipForward")}
          onClick={skipForward}
          style={{
            height: "calc(100% - 14rem)",
          }}
        />
        <StorySliderAction story={story} />
      </div>
    </>
  );
};

export default StorySliderView;
