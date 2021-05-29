import { useSearchTrackQuery } from "@/gql/gql.gen";
import React from "react";
import {
  SelectableTrackList,
  SelectableTrackListProps,
} from "../SelectableTrackList";

interface SelectBySongsProps extends SelectableTrackListProps {
  search: string;
}

const SelectBySongs: React.FC<SelectBySongsProps> = ({
  search,
  selectedTracks,
  addTracks,
  removeTrack,
}) => {
  const [
    { data: { searchTrack } = { searchTrack: undefined }, fetching },
  ] = useSearchTrackQuery({ variables: { query: search }, pause: !search });

  if (!search) return null;

  return (
    <SelectableTrackList
      selectedTracks={selectedTracks}
      data={searchTrack || []}
      addTracks={addTracks}
      removeTrack={removeTrack}
      fetching={fetching}
    />
  );
};

export default SelectBySongs;
