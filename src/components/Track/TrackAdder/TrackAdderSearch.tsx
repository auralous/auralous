import { SvgLoadingAnimated } from "assets/svg";
import { Typography } from "components/Typography";
import {
  PlaylistTracksDocument,
  PlaylistTracksQuery,
  PlaylistTracksQueryVariables,
  SearchTrackDocument,
  Track,
  TrackDocument,
  TrackQuery,
  TrackQueryVariables,
} from "gql/gql.gen";
import { useI18n } from "i18n/index";
import React, { useCallback, useRef, useState } from "react";
import { useClient } from "urql";
import { maybeGetTrackOrPlaylistIdFromUri } from "utils/platform";
import { default as TrackAdderResults } from "./TrackAdderResults";
import { TrackAdderCallbackFn } from "./types";

const TrackAdderSearch: React.FC<{
  callback: TrackAdderCallbackFn;
  addedTracks: string[];
}> = ({ addedTracks, callback }) => {
  const { t } = useI18n();

  const formRef = useRef<HTMLFormElement>(null);
  const urqlClient = useClient();
  const [queryResults, setQueryResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const query = event.currentTarget.search.value.trim();
      if (!query || isSearching) return;
      setIsEmpty(false);
      setIsSearching(true);

      const possbleFromUri = maybeGetTrackOrPlaylistIdFromUri(query);

      if (possbleFromUri?.type === "playlist") {
        urqlClient
          .query<PlaylistTracksQuery, PlaylistTracksQueryVariables>(
            PlaylistTracksDocument,
            { id: possbleFromUri.id }
          )
          .toPromise()
          .then((response) => {
            setQueryResults(response.data?.playlistTracks || []);
            setIsSearching(false);
          });
      } else if (possbleFromUri?.type === "track") {
        urqlClient
          .query<TrackQuery, TrackQueryVariables>(TrackDocument, {
            id: possbleFromUri.id,
          })
          .toPromise()
          .then((response) => {
            setQueryResults(response.data?.track ? [response.data.track] : []);
            setIsSearching(false);
          });
      } else {
        urqlClient
          .query(SearchTrackDocument, { query })
          .toPromise()
          .then((response) => {
            setQueryResults(response.data.searchTrack || []);
            setIsSearching(false);
          });
      }
    },
    [urqlClient, isSearching]
  );

  return (
    <div className="h-full w-full flex flex-col relative">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="p-2"
        autoComplete="off"
      >
        <div className="relative w-full">
          <input
            className="input w-full h-10"
            type="text"
            name="search"
            aria-label={t("track.adder.search.title")}
            placeholder={t("track.adder.search.placeholder")}
            required
          />
        </div>
      </form>
      {isSearching && <SvgLoadingAnimated className="absolute-center" />}
      {isEmpty && (
        <div className="absolute-center p-4">
          <Typography.Paragraph
            noMargin
            color="foreground-secondary"
            align="center"
          >
            {t("track.adder.search.helpText")}
          </Typography.Paragraph>
        </div>
      )}
      <TrackAdderResults
        addedTracks={addedTracks}
        callback={callback}
        results={queryResults.map(({ id }) => id)}
      />
    </div>
  );
};

export default TrackAdderSearch;
