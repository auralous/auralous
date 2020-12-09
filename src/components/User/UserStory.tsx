import React from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { Menu } from "@headlessui/react";
import { useCurrentUser } from "~/hooks/user";
import { Story, useNowPlayingQuery, useTrackQuery } from "~/graphql/gql.gen";
import { usePlayer } from "~/components/Player";
import { useModal } from "~/components/Modal";
import DeleteStory from "~/components/Story/StoryDelete";
import { useI18n } from "~/i18n/index";
import { SvgCircle, SvgMoreVertical, SvgPlay, SvgSquare } from "~/assets/svg";

const UserStoryMenu: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const [activeDelete, openDelete, closeDelete] = useModal();

  return (
    <>
      <Menu>
        <Menu.Button className="" title={t("story.menu.handle")}>
          <SvgMoreVertical />
        </Menu.Button>
        <Menu.Items className="absolute right-0 w-32 bg-blue rounded-lg overflow-hidden">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`w-full p-2 truncate focus:border-none ${
                  active ? "bg-pink" : ""
                }`}
                onClick={openDelete}
              >
                {t("story.delete.title")}
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <DeleteStory story={story} active={activeDelete} close={closeDelete} />
    </>
  );
};

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

  const user = useCurrentUser();

  return (
    <div
      ref={ref}
      className="relative flex items-start rounded-lg p-4 h-24 bg-blue-secondary mb-2"
    >
      {user?.id === story.creatorId && (
        <div className="absolute top-2 right-2">
          <UserStoryMenu story={story} />
        </div>
      )}
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
      <div className="pl-4 flex-1 w-0 flex flex-col items-start">
        <Link href={`/story/${story.id}`}>
          <a className="w-full">
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

export default UserStory;
