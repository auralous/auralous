import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { animated, useTransition, config as springConfig } from "react-spring";
import { useI18n } from "~/i18n/index";
import CreateStory from "./CreateStory";
import SelectFromSearch from "./SelectFromSearch";
import { Track } from "~/graphql/gql.gen";
import SelectFromPlaylists from "./SelectFromPlaylists";
import { usePlayer } from "~/components/Player";
import LayoutBackButton from "~/components/Layout/LayoutBackButton";

const getFeaturedArtists = (tracks: Track[]): string[] => {
  const o: Record<string, number> = {};
  for (const track of tracks)
    for (const artist of track.artists)
      o[artist.name] = o[artist.name] ? o[artist.name] + 1 : 1;
  return Object.entries(o)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
    .slice(0, 4);
};

const transitionConfig = {
  from: {
    opacity: 0,
    transform: "translateY(10px)",
    position: "static" as const,
  },
  enter: {
    opacity: 1,
    transform: "translateY(0px)",
    position: "static" as const,
  },
  leave: {
    opacity: 0,
    transform: "translateY(10px)",
    position: "absolute" as const,
  },
  config: springConfig.stiff,
};

const SelectTracksView: React.FC<{
  setInitTracks: React.Dispatch<React.SetStateAction<Track[] | null>>;
}> = ({ setInitTracks }) => {
  const { t } = useI18n();
  const [from, setFrom] = useState<"search" | "playlist">("search");

  const router = useRouter();

  useEffect(() => {
    if (router.query.playlist) setFrom("playlist");
    else if (router.query.search) setFrom("search");
  }, [router]);

  const transitionsFrom = useTransition(from, null, transitionConfig);

  return (
    <>
      {transitionsFrom.map(({ item: from, key, props }) =>
        from === "search" ? (
          <animated.div
            key={key}
            className="flex w-full absolute top-0 flex-col flex-center h-48"
            style={props}
          >
            <SelectFromSearch onSelected={setInitTracks} />
          </animated.div>
        ) : (
          <animated.div
            key={key}
            className="flex w-full absolute top-0 flex-col flex-center h-48"
            style={props}
          >
            <SelectFromPlaylists onSelected={setInitTracks} />
          </animated.div>
        )
      )}
      <div className="pt-48 flex flex-col items-center">
        <span className="text-foreground-tertiary text-sm font-bold my-8 uppercase">
          {t("new.or")}
        </span>
        <button
          onClick={() =>
            from === "search" ? setFrom("playlist") : setFrom("search")
          }
          className="btn btn-transparent text-sm rounded-full border-foreground-secondary border-2 mb-1"
        >
          {from === "search"
            ? t("new.fromPlaylist.title")
            : t("new.fromSearch.title")}
        </button>
        <button
          onClick={() => setInitTracks([])}
          className="opacity-75 py-2 px-4 text-sm text-inline-link"
        >
          {t("new.startEmpty")}
        </button>
      </div>
    </>
  );
};

const CreateStoryView: React.FC<{ initTracks: Track[] }> = ({ initTracks }) => {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <>
      <div className="text-lg text-center text-foreground-secondary pb-6">
        {initTracks.length ? (
          <p>
            {t("new.fromResult.startListeningTo")}{" "}
            <b className="text-foreground">
              {initTracks.length} {t("common.tracks")}
            </b>{" "}
            {t("new.fromResult.featuring")}{" "}
            <i className="text-foreground">
              {getFeaturedArtists(initTracks).join(", ")}
            </i>
          </p>
        ) : null}
      </div>
      <CreateStory initTracks={initTracks} />
      <div className="w-full flex mt-1 justify-center">
        <button
          className="py-1 font-bold text-sm text-inline-link"
          onClick={() => router.replace("/new")}
        >
          {t("new.backText")}
        </button>
      </div>
    </>
  );
};

const NewMain: React.FC = () => {
  const { t } = useI18n();
  const { playStory } = usePlayer();

  const [initTracks, setInitTracks] = useState<Track[] | null>(null);

  const router = useRouter();

  useEffect(() => {
    // stop ongoing story
    playStory("");
  }, [playStory]);

  useEffect(() => {
    if (router.asPath === "/new") setInitTracks(null);
  }, [router]);

  const transitionsCreate = useTransition(!!initTracks, null, transitionConfig);

  return (
    <>
      <div className="h-10 p-2 w-full">
        <LayoutBackButton />
      </div>
      <div className="px-4 max-w-xl mx-auto">
        <h2 className="font-bold text-4xl text-center py-6">
          {initTracks ? t("new.promptAlmost") : t("new.prompt")}
        </h2>
        <div className="relative pb-8">
          {transitionsCreate.map(({ item: doneSelected, key, props }) =>
            doneSelected ? (
              <animated.div key={key} style={props} className="w-full">
                <CreateStoryView initTracks={initTracks || []} />
              </animated.div>
            ) : (
              <animated.div key={key} style={props} className="w-full">
                <SelectTracksView setInitTracks={setInitTracks} />
              </animated.div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default NewMain;
