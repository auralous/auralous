import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import RoomRules from "./RoomRules";
import {
  usePlayer,
  PlayerEmbeddedControl,
  PlayerEmbeddedNotification,
} from "~/components/Player/index";
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
    <div className="w-full h-full lg:pr-96 relative">
      {/* Main */}
      <div className="w-full h-full flex flex-col relative overflow-hidden p-2">
        <div className="mb-1 bordered-box rounded-lg overflow-hidden">
          <PlayerEmbeddedControl roomId={room.id} />
        </div>
        <PlayerEmbeddedNotification />
        <div className="mt-1 bordered-box rounded-lg flex-1 overflow-hidden">
          <RoomQueue roomState={roomState} room={room} />
        </div>
      </div>
      {/* Chat */}
      <button
        aria-label={t("room.chat.title")}
        className="btn w-14 h-14 p-1 rounded-full border-2 border-background-tertiary fixed z-40 right-2 bottom-12 md:bottom-2 lg:hidden"
        onClick={() => setExpandedChat(!expandedChat)}
      >
        {expandedChat ? <SvgX /> : <SvgMessageSquare />}
      </button>
      <div
        id="room-chat"
        className={`absolute z-10 right-0 top-0 h-full w-full transform ${
          expandedChat ? "traslate-y-0" : "translate-y-full lg:translate-y-0"
        } lg:pb-0 lg:w-96 bg-blue bg-opacity-75 lg:bg-transparent backdrop-blur lg:backdrop-none transition-transform duration-500`}
      >
        <RoomChat room={room} roomState={roomState} />
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
      <div className="h-screen-layout relative pt-12 overflow-hidden">
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
