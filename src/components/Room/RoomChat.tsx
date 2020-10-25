import React, { useState } from "react";
import { Chatbox } from "~/components/Chat/index";
import {
  Room,
  RoomMembership,
  RoomState,
  useUserQuery,
} from "~/graphql/gql.gen";
import { MEMBERSHIP_NAMES } from "~/lib/constants";

const CurrentUser: React.FC<{
  userId: string;
  role: RoomMembership | null;
}> = ({ userId, role }) => {
  const [{ data }] = useUserQuery({ variables: { id: userId } });
  return (
    <div className="h-12 mb-2 w-full mr-1 flex py-2 bg-background-secondary rounded-lg">
      {
        //FIXME: Add user name
        data?.user ? (
          <>
            <div className="px-2 flex-none">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={data.user.profilePicture}
                alt={data.user.username}
                title={data.user.username}
              />
            </div>
            <div className="font-bold text-foreground flex items-center justify-between w-full">
              <div className="flex-1 w-0 leading-none truncate">
                {data.user.username}
              </div>
              <div className="px-2 flex items-center">
                <span className="py-1 px-2 text-xs rounded-full bg-background-secondary">
                  {MEMBERSHIP_NAMES[role || ""]}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mx-2 flex-none w-8 h-8 rounded-full bg-background-secondary animate-pulse" />
            <div className="bg-background-secondary animate-pulse rounded-lg w-full mr-2" />
          </>
        )
      }
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
              : room.creatorId === userId
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
