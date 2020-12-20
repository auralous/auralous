import React from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { Menu } from "@headlessui/react";
import { useCurrentUser } from "~/hooks/user";
import { Story, useNowPlayingQuery } from "~/graphql/gql.gen";
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
        <Menu.Button
          className="text-inline-link"
          title={t("story.menu.handle")}
        >
          <SvgMoreVertical />
        </Menu.Button>
        <Menu.Items className="absolute right-2 w-32 bg-background border-background-tertiary border-2 rounded-lg overflow-hidden outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`w-full text-xs p-2 truncate focus:outline-none ${
                  active ? "bg-primary" : ""
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
  } = usePlayer();

  const onPlayClick = () => {
    if (playingStoryId !== story.id) return playStory(story.id);
    else playStory("");
  };

  const [
    { data: { nowPlaying } = { nowPlaying: undefined } },
  ] = useNowPlayingQuery({
    variables: { id: story.id },
    pause: !inView,
  });

  const user = useCurrentUser();

  return (
    <div
      ref={ref}
      className="relative flex items-start rounded-lg p-4 h-24 bg-background-secondary mb-2"
    >
      {user?.id === story.creatorId && (
        <div className="absolute top-2 right-2">
          <UserStoryMenu story={story} />
        </div>
      )}
      <button
        onClick={onPlayClick}
        className="btn btn-primary w-12 h-12 p-2 rounded-full"
        aria-label={
          playingStoryId === story.id ? t("player.pause") : t("player.play")
        }
      >
        {playingStoryId === story.id ? (
          <SvgSquare className="fill-current" />
        ) : (
          <SvgPlay className="fill-current" />
        )}
      </button>
      <div className="pl-4 flex-1 w-0 flex flex-col items-start">
        <Link href={`/story/${story.id}`}>
          <a className="text-inline-link max-w-full">
            <h3 className="font-bold text-lg text-foreground truncate">
              {story.text}
            </h3>
          </a>
        </Link>
        <div className="text-xs text-foreground-secondary">
          {story.createdAt.toLocaleDateString()}
        </div>
        {nowPlaying?.currentTrack && (
          <div className="mt-2 text-foreground-secondary leading-none max-w-full flex items-center">
            <span className="flex-none inline-block py-1 px-2 bg-background text-xs rounded-full leading-none align-middle">
              <SvgCircle className="text-primary fill-current w-3 h-3 inline mr-1 animate-pulse" />
              {t("nowPlaying.title")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStory;
