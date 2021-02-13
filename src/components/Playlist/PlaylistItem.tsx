import { Playlist } from "gql/gql.gen";
import React from "react";
import { PLATFORM_FULLNAMES } from "utils/constants";

const PlaylistItem: React.FC<{
  playlist: Playlist;
}> = ({ playlist }) => {
  return (
    <div className="flex justify-start items-center">
      <img
        className="w-12 h-12 mr-3 rounded object-cover"
        src={playlist.image}
        alt={playlist.name}
      />
      <div className="text-left">
        <div className="font-bold text-sm">{playlist.name}</div>
        <div className="font-normal text-xs text-foreground-secondary">
          {PLATFORM_FULLNAMES[playlist.platform]}
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
