import { useSearchTrackQuery } from "@/gql/gql.gen";
import React from "react";
import SelectableTrackList from "./SelectableTrackList";

interface SelectBySongsProps {
  search: string;
}

const SelectBySongs: React.FC<SelectBySongsProps> = ({ search }) => {
  const [{ data: { searchTrack } = { searchTrack: undefined }, fetching }] =
    useSearchTrackQuery({ variables: { query: search }, pause: !search });

  if (!search) return null;

  return <SelectableTrackList data={searchTrack || []} fetching={fetching} />;
};

export default SelectBySongs;
