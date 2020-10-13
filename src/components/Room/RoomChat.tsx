import React, { useState } from "react";
import { Chatbox } from "~/components/Chat/index";
import {
  Room,
  RoomMembership,
  RoomState,
  useUserQuery,
} from "~/graphql/gql.gen";

const CurrentUser: React.FC<{
  userId: string;
  role: RoomMembership | null;
}> = ({ userId, role }) => {
  const [{ data }] = useUserQuery({ variables: { id: userId } });
  return (
    <div className="flex items-start p-2 rounded-lg mb-2 mr-2">
      {data?.user ? (
        <img
          className="rounded-full w-10 h-10 object-cover"
          src={data.user.profilePicture}
          alt={data.user.username}
        />
      ) : (
        <div className="rounded-full w-10 h-10 bg-background-secondary animate-pulse" />
      )}
      <div className="ml-2 overflow-hidden">
        <h5 className="font-bold truncate leading-none">
          {data?.user?.username || (
            <div className="bg-background-secondary animate-pulse h-6 w-32 rounded" />
          )}
        </h5>
        {role === RoomMembership.Host && (
          <span className="px-1 rounded-lg text-xs bg-pink font-semibold">
            Host
          </span>
        )}
        {role === RoomMembership.Collab && (
          <span className="px-1 rounded-lg text-xs bg-white text-black font-semibold">
            Collab
          </span>
        )}
      </div>
    </div>
  );
};

const RoomUsers: React.FC<{ roomState: RoomState; room: Room }> = ({
  room,
  roomState,
}) => {
  return (
    <div className="h-full p-2">
      {roomState.userIds.map((userId) => (
        // TODO: react-window
        <CurrentUser
          key={userId}
          userId={userId}
          role={
            roomState.collabs.includes(userId)
              ? RoomMembership.Collab
              : room.creator.id === userId
              ? RoomMembership.Host
              : null
          }
        />
      ))}
    </div>
  );
};

const RoomChat: React.FC<{ room: Room; roomState?: RoomState }> = ({
  room,
  roomState,
}) => {
  const [tab, setTab] = useState<"chat" | "users">("chat");
  return (
    <div className="h-full flex flex-col">
      <div role="tablist" className="flex flex-none">
        <button
          role="tab"
          className={`flex-1 mx-1 p-1 text-sm rounded-lg font-bold ${
            tab === "chat"
              ? "bg-foreground bg-opacity-25 text-white"
              : "opacity-75"
          }`}
          aria-controls="tabpanel_chat"
          onClick={() => setTab("chat")}
          aria-selected={tab === "chat"}
        >
          Chat
        </button>
        <button
          role="tab"
          className={`flex-1 mx-1 p-1 text-sm rounded-lg font-bold ${
            tab === "users"
              ? "bg-foreground bg-opacity-25 text-white"
              : "opacity-75"
          }`}
          aria-controls="tabpanel_users"
          onClick={() => setTab("users")}
          aria-selected={tab === "users"}
        >
          Listeners ({roomState?.userIds.length || 0})
        </button>
      </div>
      <div hidden={tab !== "chat"} className="flex-1">
        <Chatbox roomId={`room:${room.id}`} />
      </div>
      <div hidden={tab !== "users"} className="flex-1">
        {roomState && <RoomUsers room={room} roomState={roomState} />}
      </div>
    </div>
  );
};

export default RoomChat;
