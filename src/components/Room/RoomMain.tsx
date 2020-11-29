import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import RoomRules from "./RoomRules";
import { usePlayer, PlayerEmbeddedControl } from "~/components/Player/index";
import { ShareDialog } from "~/components/Social/index";
import { useModal } from "~/components/Modal/index";
import { useCurrentUser } from "~/hooks/user";
import {
  Room,
  useRoomQuery,
  useRoomStateQuery,
  useOnRoomStateUpdatedSubscription,
  RoomState,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import {
  SvgShare,
  SvgSettings,
  SvgBookOpen,
  SvgMessageSquare,
  SvgX,
} from "~/assets/svg";

const RoomQueue = dynamic(() => import("./RoomQueue"), { ssr: false });
const RoomChat = dynamic(() => import("./RoomChat"), { ssr: false });
const RoomPrivate = dynamic(() => import("./RoomPrivate"), { ssr: false });

const Navbar: React.FC<{
  room: Room;
  roomState: RoomState | null | undefined;
}> = ({ room, roomState }) => {
  const { t } = useI18n();

  const user = useCurrentUser();
  const [activeShare, openShare, closeShare] = useModal();
  const [activeRules, openRules, closeRules] = useModal();

  return (
    <>
      <div className="nav px-2 overflow-hidden">
        <div className="flex flex-1 w-0 items-center justify-start h-full">
          <img
            alt={room.title}
            src={room.image}
            className="w-6 h-6 rounded-lg mr-2"
          />
          <h4 className="text-lg font-bold leading-tight truncate mr-2">
            {room.title}
          </h4>
        </div>
        <div className="flex items justify-end">
          <button onClick={openShare} className="btn p-2 mr-1">
            <SvgShare width="14" height="14" className="sm:mr-1" />
            <span className="text-sm sr-only sm:not-sr-only leading-none">
              {t("share.title")}
            </span>
          </button>
          {roomState && (
            <>
              <button onClick={openRules} className="btn p-2 mr-1">
                <SvgBookOpen width="14" height="14" className="sm:mr-1" />
                <span className="text-sm sr-only sm:not-sr-only leading-none">
                  {t("room.rules.shortTitle")}
                </span>
              </button>
              <RoomRules
                active={activeRules}
                close={closeRules}
                roomState={roomState}
              />
            </>
          )}
          {room.creatorId === user?.id && (
            <Link href={`/room/${room.id}/settings`}>
              <a className="btn p-2">
                <SvgSettings width="14" height="14" className="sm:mr-1" />
                <span className="text-sm sr-only sm:not-sr-only leading-none">
                  {t("room.settings.shortTitle")}
                </span>
              </a>
            </Link>
          )}
        </div>
      </div>
      <ShareDialog
        uri={`/room/${room.id}`}
        name={room.title}
        active={activeShare}
        close={closeShare}
      />
    </>
  );
};

const RoomContent: React.FC<{ room: Room; roomState: RoomState }> = ({
  room,
  roomState,
}) => {
  const { t } = useI18n();
  const { playRoom } = usePlayer();
  useEffect(() => {
    playRoom(room.id);
  }, [room, playRoom]);

  const [expandedChat, setExpandedChat] = useState(false);

  return (
    <div className={`flex flex-col lg:flex-row h-full`}>
      <div className="relative flex-1 lg:w-0">
        <div className="w-full h-full flex flex-col relative overflow-hidden p-2">
          <div className="mb-2 bordered-box rounded-lg overflow-hidden">
            <PlayerEmbeddedControl roomId={room.id} />
          </div>
          <div className="bordered-box rounded-lg flex-1 overflow-hidden">
            <RoomQueue roomState={roomState} room={room} />
          </div>
        </div>
      </div>
      <div className="w-full lg:w-96">
        <button
          className="btn lg:hidden fixed z-40 rounded-b-none rounded-r-none bottom-0 right-0"
          onClick={() => setExpandedChat(!expandedChat)}
          style={{ backdropFilter: "blur(5px)" }}
          aria-label={t("room.chat.title")}
        >
          {expandedChat ? <SvgX /> : <SvgMessageSquare />}
        </button>
        <div
          className={`p-2 bg-opacity-75 w-full h-full transform z-30 fixed inset-0 ${
            expandedChat ? "translate-y-0 bg-blue" : "translate-y-full"
          } lg:relative lg:translate-y-0 transition-transform duration-500`}
          style={expandedChat ? { backdropFilter: "blur(20px)" } : undefined}
        >
          <RoomChat room={room} roomState={roomState} />
        </div>
      </div>
    </div>
  );
};

const RoomLoading: React.FC<{ room: Room }> = ({ room }) => {
  const { t } = useI18n();
  return (
    <div className="w-full h-full flex flex-col flex-center">
      <h1 className="text-2xl md:text-4xl font-black">{room.title}</h1>
      <p className="text-sm md:text-md text-foreground-secondary animate-pulse">
        {t("room.main.loading.text")}
      </p>
    </div>
  );
};

const RoomMain: React.FC<{ initialRoom: Room }> = ({ initialRoom }) => {
  // initialRoom is the same as room, only might be a outdated version
  // so it can be used as backup
  const [{ data }] = useRoomQuery({
    variables: { id: initialRoom.id as string },
  });
  const room = data?.room || initialRoom;
  const [
    {
      data: { roomState } = { roomState: undefined },
      fetching: fetchingRoomState,
    },
    refetchRoomState,
  ] = useRoomStateQuery({
    variables: { id: room.id },
    pollInterval: 60 * 1000,
    requestPolicy: "cache-and-network",
  });

  useOnRoomStateUpdatedSubscription(
    {
      variables: { id: room.id || "" },
      pause: !roomState?.permission.viewable,
    },
    (prev, data) => data
  );

  return (
    <>
      <div className="h-screen-no-appbar sm:h-screen relative pt-12 overflow-hidden">
        <Navbar room={room} roomState={roomState} />
        {roomState ? (
          roomState.permission.viewable ? (
            <RoomContent room={room} roomState={roomState} />
          ) : (
            <RoomPrivate
              room={room}
              roomState={roomState}
              reloadFn={() =>
                refetchRoomState({ requestPolicy: "cache-and-network" })
              }
            />
          )
        ) : (
          fetchingRoomState && <RoomLoading room={room} />
        )}
      </div>
    </>
  );
};

export default RoomMain;
