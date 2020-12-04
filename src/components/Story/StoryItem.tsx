import React from "react";
import Link from "next/link";
import { Story, useNowPlayingQuery, useTrackQuery } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgLock } from "~/assets/svg";

const StoryItem: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useI18n();

  const [{ data: { nowPlaying } = { nowPlaying: null } }] = useNowPlayingQuery({
    variables: { id: story.id },
  });

  const [{ data: trackData }] = useTrackQuery({
    variables: { id: nowPlaying?.currentTrack?.trackId || "" },
    pause: !nowPlaying?.currentTrack?.trackId,
  });

  const currentTrack = nowPlaying?.currentTrack ? trackData?.track : null;

  return (
    <Link href={`/story/${story.id}`}>
      <a className="block overflow-hidden border-2 border-background-secondary hover:border-white focus:border-white focus:outline-none pb-4/3 rounded-lg relative transition">
        <div className="absolute inset-0 py-2 justify-center flex flex-col">
          <h3 className="flex-none mb-2 text-xl font-bold truncate text-center">
            {story.isPublic === false && (
              <SvgLock
                className="inline mr-1 p-1 rounded-lg bg-white text-black"
                width="20"
                height="20"
                title={t("story.privacy.private")}
              />
            )}
            {story.title}
          </h3>
          <h4 className="text-white flex-none text-center text-opacity-50 font-semibold text-xs mb-1 uppercase">
            {t("nowPlaying.title")}
          </h4>
          <div className="relative w-32 h-32 mx-auto mb-2">
            <img
              className={`absolute inset-0 w-full h-full object-cover ${
                currentTrack ? "animate-spin-slow" : ""
              } rounded-full shadow-lg overflow-hidden`}
              alt={`Now Playing on ${story.title}`}
              src={currentTrack?.image || story.image}
            />
          </div>
          <div className="px-2 h-12 text-center">
            {currentTrack && (
              <>
                <div className="font-semibold truncate w-full">
                  {currentTrack.title}
                </div>
                <div className="font-semibold text-xs text-white text-opacity-50 truncate w-full">
                  {currentTrack.artists.map(({ name }) => name).join(", ")}
                </div>
              </>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default StoryItem;
