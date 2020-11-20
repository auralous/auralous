import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import RoomRules from "./RoomRules";
import { usePlayer, PlayerEmbeddedControl } from "~/components/Player/index";
import { ShareDialog } from "~/components/Social/index";
import { useModal } from "~/components/Modal/index";
import { useToasts } from "~/components/Toast";
import { AuthBanner } from "~/components/Auth/index";
import { useCurrentUser } from "~/hooks/user";
import {
  Room,
  useRoomQuery,
  useRoomStateQuery,
  useJoinPrivateRoomMutation,
  useOnRoomStateUpdatedSubscription,
  RoomState,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import {
  SvgChevronLeft,
  SvgShare,
  SvgSettings,
  SvgBookOpen,
  SvgCheck,
  SvgLock,
} from "~/assets/svg";

const RoomQueue = dynamic(() => import("./RoomQueue"), { ssr: false });
const RoomChat = dynamic(() => import("./RoomChat"), { ssr: false });

const RoomPrivate: React.FC<{
  room: Room;
  roomState: RoomState;
  reloadFn: () => void;
}> = ({ room, reloadFn }) => {
  const { t } = useI18n();
  const toasts = useToasts();
  const passwordRef = useRef<HTMLInputElement>(null);

  const user = useCurrentUser();
  const [{ fetching }, joinPrivateRoom] = useJoinPrivateRoomMutation();

  const handleJoinPrivateRoom = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!passwordRef.current || fetching) return;
      const result = await joinPrivateRoom({
        id: room.id,
        password: passwordRef.current.value,
      }).then((response) => response.data?.joinPrivateRoom);
      result ? reloadFn() : toasts.error(t("room.main.private.badPassword"));
    },
    [t, toasts, room, joinPrivateRoom, fetching, reloadFn]
  );

  return (
    <div className="w-full h-full flex flex-col flex-center p-4">
      {user ? (
        <>
          <div className="mb-8 p-6 rounded-full bg-background-secondary">
            <SvgLock className="w-16 h-16" />
          </div>
          <p>{t("room.main.private.password1")}</p>
          <form className="flex my-2" onSubmit={handleJoinPrivateRoom}>
            <input
              type="password"
              autoComplete="current-password"
              aria-label="Password"
              ref={passwordRef}
              className="input w-full mr-1"
            />
            <button type="submit" className="button" disabled={fetching}>
              {t("room.main.private.join")}
            </button>
          </form>
          <p className="text-foreground-secondary text-xs mt-2">
            {t("room.main.private.password2")}
          </p>
        </>
      ) : (
        <AuthBanner prompt="Join Stereo to Enter a Private Room" />
      )}
    </div>
  );
};

const RoomLive: React.FC<{ room: Room; roomState: RoomState }> = ({
  room,
  roomState,
}) => {
  return (
    <>
      <div className="w-full h-full flex flex-col relative overflow-hidden p-2">
        <div className="mb-2 bordered-box rounded-lg overflow-hidden">
          <PlayerEmbeddedControl roomId={room.id} />
        </div>
        <div className="bordered-box rounded-lg pt-1 flex-1 overflow-hidden">
          <RoomChat room={room} roomState={roomState} />
        </div>
      </div>
    </>
  );
};

const Navbar: React.FC<{
  room: Room;
  roomState: RoomState | null | undefined;
}> = ({ room, roomState }) => {
  const { t } = useI18n();

  const user = useCurrentUser();
  const router = useRouter();
  const [activeShare, openShare, closeShare] = useModal();
  const [activeRules, openRules, closeRules] = useModal();

  return (
    <>
      <div className="nav px-2 overflow-hidden">
        <div className="flex flex-1 w-0 items-center justify-start h-full">
          <button
            onClick={() => router.push("/browse")}
            className="button button-transparent p-1 mr-2"
            title={t("common.backToHome")}
          >
            <SvgChevronLeft />
          </button>
          <h4 className="text-md font-bold leading-tight truncate mr-2">
            {room.title}
          </h4>
        </div>
        <div className="flex items justify-end">
          <button onClick={openShare} className="button p-2 mr-1">
            <SvgShare width="14" height="14" className="sm:mr-1" />
            <span className="text-sm sr-only sm:not-sr-only leading-none">
              {t("share.title")}
            </span>
          </button>
          {roomState && (
            <>
              <button onClick={openRules} className="button p-2 mr-1">
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
            <Link
              href="/room/[roomId]/settings"
              as={`/room/${room.id}/settings`}
            >
              <a className="button p-2">
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

  const [expandedQueue, expandQueue, collapseQueue] = useModal();

  return (
    <div className={`flex flex-col lg:flex-row h-full`}>
      <div className="relative flex-1 lg:w-0">
        <RoomLive room={room} roomState={roomState} />
      </div>
      <div className={`w-full p-2 lg:w-96 max-w-full`}>
        <button
          onClick={expandQueue}
          className="h-12 w-full button inline-flex lg:hidden"
        >
          {t("room.queue.title")}
        </button>
        <div
          className={`bordered-box w-full h-full flex flex-col z-30 fixed inset-0 lg:static ${
            expandedQueue ? "block" : "hidden"
          } p-2 rounded-lg lg:block`}
        >
          <RoomQueue roomState={roomState} room={room} />
          <button
            onClick={collapseQueue}
            aria-label="OK"
            className="h-12 w-full flex-none button button-success mt-2 lg:hidden"
          >
            <SvgCheck />
          </button>
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

  useOnRoomStateUpdatedSubscription({
    variables: { id: room.id || "" },
    pause: !roomState?.permission.viewable,
  });

  return (
    <>
      <div className="h-screen relative pt-12 overflow-hidden">
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
