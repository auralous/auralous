import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useI18n } from "~/i18n/index";
import CreateRoom from "./CreateRoom";
import SelectFromSearch from "./SelectFromSearch";
import { Track } from "~/graphql/gql.gen";
import SelectFromPlaylists from "./SelectFromPlaylists";

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

const NewMain: React.FC = () => {
  const { t } = useI18n();

  const [initTracks, setInitTracks] = useState<Track[] | null>(null);
  const [from, setFrom] = useState<"search" | "playlist">("search");

  const router = useRouter();

  useEffect(() => {
    if (router.asPath === "/new") setInitTracks(null);
    else if (router.query.playlist) setFrom("playlist");
    else if (router.query.search) setFrom("search");
  }, [router]);

  return (
    <div className="p-4 h-screen-no-appbar sm:h-screen pt-12 overflow-auto">
      <h2 className="font-bold text-4xl text-center mb-6">
        {initTracks ? t("new.promptAlmost") : t("new.prompt")}
      </h2>
      <div className="flex flex-col mx-auto max-w-xl">
        {initTracks ? (
          <>
            <p className="text-lg text-center text-foreground-secondary mb-6">
              {initTracks.length ? (
                <>
                  {t("new.fromResult.startListeningTo")}{" "}
                  <b className="text-foreground">
                    {initTracks.length} {t("common.tracks")}
                  </b>{" "}
                  {t("new.fromResult.featuring")}{" "}
                  <i className="text-foreground">
                    {getFeaturedArtists(initTracks).join(", ")}
                  </i>
                </>
              ) : (
                t("new.fromResult.empty")
              )}
            </p>
            <CreateRoom initTracks={initTracks} />
            <button
              className="inline-flex mx-auto py-1 font-bold text-sm mt-1 text-foreground-secondary hover:text-foreground transition-colors"
              onClick={() => router.replace("/new")}
            >
              {t("new.backText")}
            </button>
          </>
        ) : (
          <>
            {from === "search" ? (
              <SelectFromSearch onSelected={setInitTracks} />
            ) : (
              <SelectFromPlaylists onSelected={setInitTracks} />
            )}
            <div className="flex flex-col items-center">
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
        )}
      </div>
    </div>
  );
};

export default NewMain;
