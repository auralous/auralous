import React from "react";
import Link from "next/link";
import { Room, useNowPlayingQuery, useTrackQuery } from "~/graphql/gql.gen";
import { SvgLock } from "~/assets/svg";

const RoomItem: React.FC<{ room: Room }> = ({ room }) => {
  const [{ data: { nowPlaying } = { nowPlaying: null } }] = useNowPlayingQuery({
    variables: { id: `room:${room.id}` },
  });

  const [{ data: trackData }] = useTrackQuery({
    variables: { id: nowPlaying?.currentTrack?.trackId || "" },
    pause: !nowPlaying?.currentTrack?.trackId,
  });

  const currentTrack = nowPlaying?.currentTrack ? trackData?.track : null;

  return (
    <Link href="/room/[roomId]" as={`/room/${room.id}`}>
      <a className="block overflow-hidden border-2 border-background-secondary hover:border-white pb-4/3 rounded-lg relative transition ease-in-out duration-300">
        <div className="absolute inset-0 py-2 justify-center flex flex-col">
          <h3 className="flex-none mb-2 text-xl font-bold truncate text-center">
            {room.isPublic === false && (
              <SvgLock
                className="inline mr-1 p-1 rounded-lg bg-white text-black"
                width="20"
                height="20"
                title="Private Room"
              />
            )}
            {room.title}
          </h3>
          <h4 className="text-white flex-none text-center text-opacity-50 font-semibold text-xs mb-1">
            NOW PLAYING
          </h4>
          <div className="relative w-32 h-32 mx-auto mb-2 rounded-full shadow-lg overflow-hidden">
            <img
              className={`absolute inset-0 w-full h-full object-cover ${
                currentTrack ? "animate-spin-slow" : ""
              }`}
              alt={`Now Playing on ${room.title}`}
              src={currentTrack?.image || room.image}
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

export default RoomItem;
