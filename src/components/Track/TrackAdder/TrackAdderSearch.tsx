import { SvgSpinnerAlt } from "assets/svg";
import { Input } from "components/Form";
import { Typography } from "components/Typography";
import { Box } from "components/View";
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
import { useCallback, useRef, useState } from "react";
import { useClient } from "urql";
import { maybeGetTrackOrPlaylistIdFromUri } from "utils/platform";
import { default as TrackAdderResults } from "./TrackAdderResults";
import { AddTracksCallbackFn, RemoveTrackCallbackFn } from "./types";

const TrackAdderSearch: React.FC<{
  onAdd: AddTracksCallbackFn;
  onRemove: RemoveTrackCallbackFn;
  addedTracks: string[];
}> = ({ addedTracks, onAdd, onRemove }) => {
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
    <Box fullWidth fullHeight position="relative">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="p-2"
        autoComplete="off"
      >
        <Input
          fullWidth
          type="text"
          name="search"
          accessibilityLabel={t("trackAdder.search.title")}
          placeholder={t("trackAdder.search.placeholder")}
          required
        />
      </form>
      {isSearching && (
        <div className="absolute-center">
          <SvgSpinnerAlt className="animate-spin" />
        </div>
      )}
      {isEmpty && (
        <div className="absolute-center p-4">
          <Typography.Paragraph
            noMargin
            color="foreground-secondary"
            align="center"
          >
            {t("trackAdder.search.helpText")}
          </Typography.Paragraph>
        </div>
      )}
      <TrackAdderResults
        addedTracks={addedTracks}
        onAdd={onAdd}
        onRemove={onRemove}
        results={queryResults.map(({ id }) => id)}
      />
    </Box>
  );
};

export default TrackAdderSearch;
