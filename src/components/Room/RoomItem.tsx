import React from "react";
import Link from "next/link";
import { Room, useNowPlayingQuery, useTrackQuery } from "~/graphql/gql.gen";

const RoomItem: React.FC<{ room: Room }> = ({ room }) => {
  const [{ data: { nowPlaying } = { nowPlaying: null } }] = useNowPlayingQuery({
    variables: { id: `room:${room.id}` },
  });

  const [{ data: trackData }] = useTrackQuery({
    variables: { id: nowPlaying?.currentTrack?.trackId },
    pause: !nowPlaying?.currentTrack?.trackId,
  });

  const currentTrack = nowPlaying?.currentTrack ? trackData?.track : null;

  return (
    <Link href="/room/[roomId]" as={`/room/${room.id}`}>
      <a className="block overflow-hidden pb-4/3 rounded-lg transform hover:-translate-y-2 transition-all ease-in-out duration-300">
        <img
          className="absolute transform scale-125 h-full w-full inset-0 object-cover"
          src={currentTrack?.image || room.image}
          alt={room.title}
          style={{ filter: "brightness(0.2) blur(14px)" }}
        />
        <div className="absolute inset-0 py-2 justify-center flex flex-col">
          <h3 className="flex-none mb-2 text-xl font-bold truncate text-center">
            {room.title}
          </h3>
          <h4 className="text-white flex-none text-center text-opacity-50 font-semibold text-xs mb-1">
            NOW PLAYING
          </h4>
          <img
            className="w-32 h-32 mx-auto mb-2 rounded-lg object-cover"
            alt={`Now Playing on ${room.title}`}
            src={currentTrack?.image || room.image}
          />
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
