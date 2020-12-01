import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useI18n } from "~/i18n/index";
import CreateRoom from "./CreateRoom";
import AddToExisted from "./AddToExisted";
import SelectFromSearch from "./SelectFromSearch";
import { Track } from "~/graphql/gql.gen";
import SelectFromPlaylists from "./SelectFromPlaylists";
import { animated, useTransition, config as springConfig } from "react-spring";

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
  from: { opacity: 0, transform: "translateY(10px)" },
  enter: { opacity: 1, transform: "translateY(0px)" },
  leave: { opacity: 0, transform: "translateY(10px)" },
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
          className="py-2 px-4 text-sm underline text-foreground-secondary hover:text-foreground transition-colors"
        >
          {t("new.startEmpty")}
        </button>
      </div>
    </>
  );
};

const CreateRoomView: React.FC<{ initTracks: Track[] }> = ({ initTracks }) => {
  const { t } = useI18n();
  const router = useRouter();

  const [addExisted, setAddExisted] = useState(false);

  return (
    <>
      <div className="text-lg text-center text-foreground-secondary mb-6">
        {initTracks.length ? (
          <>
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
            <div className="flex justify-center py-1">
              <button
                className={`p-1 mx-1 text-xs ${
                  addExisted
                    ? "text-foreground-tertiary"
                    : "text-foreground-secondary font-bold"
                } focus:outline-none focus:text-foreground-secondary`}
                onClick={() => setAddExisted(false)}
              >
                {t("new.addNew.title")}
              </button>
              <button
                className={`p-1 mx-1 text-xs ${
                  !addExisted
                    ? "text-foreground-tertiary"
                    : "text-foreground-secondary font-bold"
                } focus:outline-none focus:text-foreground-secondary`}
                onClick={() => setAddExisted(true)}
              >
                {t("new.addExisted.title")}
              </button>
            </div>
          </>
        ) : (
          t("new.fromResult.empty")
        )}
      </div>
      {addExisted ? (
        <AddToExisted initTracks={initTracks} />
      ) : (
        <CreateRoom initTracks={initTracks} />
      )}
      <button
        className="inline-flex mx-auto py-1 font-bold text-sm mt-1 text-foreground-secondary hover:text-foreground transition-colors"
        onClick={() => router.replace("/new")}
      >
        {t("new.backText")}
      </button>
    </>
  );
};

const NewMain: React.FC = () => {
  const { t } = useI18n();

  const [initTracks, setInitTracks] = useState<Track[] | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (router.asPath === "/new") setInitTracks(null);
  }, [router]);

  const transitionsCreate = useTransition(!!initTracks, null, transitionConfig);

  return (
    <div className="p-4 h-screen-no-appbar sm:h-screen pt-12 overflow-auto">
      <h2 className="font-bold text-4xl text-center mb-6">
        {initTracks ? t("new.promptAlmost") : t("new.prompt")}
      </h2>
      <div className="flex flex-col mx-auto max-w-xl relative">
        {transitionsCreate.map(({ item: doneSelected, key, props }) =>
          doneSelected ? (
            <animated.div
              key={key}
              style={props}
              className="flex flex-col max-w-xl absolute w-full"
            >
              <CreateRoomView initTracks={initTracks || []} />
            </animated.div>
          ) : (
            <animated.div
              key={key}
              style={props}
              className="flex flex-col max-w-xl absolute w-full"
            >
              <SelectTracksView setInitTracks={setInitTracks} />
            </animated.div>
          )
        )}
      </div>
    </div>
  );
};

export default NewMain;
