import React from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import {
  Story,
  useNowPlayingQuery,
  User,
  useStoriesQuery,
  useTrackQuery,
  useUserQuery,
} from "~/graphql/gql.gen";
import { usePlayer } from "~/components/Player";
import { useI18n } from "~/i18n/index";
import { SvgCircle, SvgPlay, SvgSettings, SvgSquare } from "~/assets/svg";
import { useCurrentUser } from "~/hooks/user";

const UserStory: React.FC<{ story: Story }> = ({ story }) => {
  const { ref, inView } = useInView();

  const { t } = useI18n();

  const {
    state: { playingStoryId },
    playStory,
    stopPlaying,
  } = usePlayer();

  const onPlayClick = () => {
    if (playingStoryId !== story.id) return playStory(story.id);
    else stopPlaying();
  };

  const [
    { data: { nowPlaying } = { nowPlaying: undefined } },
  ] = useNowPlayingQuery({
    variables: { id: story.id },
    pause: !inView,
  });

  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id: nowPlaying?.currentTrack?.trackId || "" },
    pause: !nowPlaying?.currentTrack,
  });

  return (
    <div
      ref={ref}
      className="flex items-start rounded-lg p-4 h-24 bg-blue-secondary mb-2"
    >
      <button
        onClick={onPlayClick}
        className="btn btn-primary w-12 h-12 p-2 rounded-full"
      >
        {playingStoryId === story.id ? (
          <SvgSquare className="fill-current" />
        ) : (
          <SvgPlay className="fill-current" />
        )}
      </button>
      <div className="pl-4 flex-1 w-0">
        <Link href={`/story/${story.id}`}>
          <a>
            <h3 className="font-bold text-lg hover:opacity-75 transition-opacity truncate">
              {story.text}
            </h3>
          </a>
        </Link>
        <div className="text-xs text-foreground-secondary">
          {story.createdAt.toLocaleDateString()}
        </div>
        {track && (
          <div className="mt-2 text-foreground-secondary leading-none max-w-full flex items-center">
            <span className="flex-none inline-block py-1 px-2 bg-blue text-xs rounded-full leading-none align-middle">
              <SvgCircle className="text-pink fill-current w-3 h-3 inline mr-1 animate-pulse" />
              {t("nowPlaying.title")}
            </span>
            <span className="py-1 px-2 text-sm truncate">
              <b>{track.title}</b>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const UserMain: React.FC<{ initialUser: User }> = ({ initialUser }) => {
  const { t } = useI18n();
  // initialUser is the same as story, only might be a outdated version
  const [{ data }] = useUserQuery({
    variables: { id: initialUser.id },
  });
  const user = data?.user || initialUser;

  const [{ data: { stories } = { stories: undefined } }] = useStoriesQuery({
    variables: {
      creatorId: user.id,
    },
  });

  const me = useCurrentUser();

  return (
    <div className="max-w-xl mx-auto p-4 relative">
      <div className="h-12"></div>
      <div className="px-4 py-8">
        <img
          className="w-24 h-24 md:w-40 md:h-40 rounded-full mx-auto mb-2"
          src={user.profilePicture}
          alt={user.username}
        />
        <h1 className="text-lg md:text-2xl font-bold text-center">
          {user.username}
        </h1>
      </div>
      {me?.id === user.id && (
        <Link href="/settings">
          <a
            className="sm:hidden absolute top-2 right-0 btn btn-transparent"
            title={t("settings.title")}
          >
            <SvgSettings className="w-8 h-8 stroke-1" />
          </a>
        </Link>
      )}
      {stories?.map((story) => (
        <UserStory key={story.id} story={story} />
      ))}
    </div>
  );
};

export default UserMain;
