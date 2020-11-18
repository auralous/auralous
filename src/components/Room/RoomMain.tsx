import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import RoomRules from "./RoomRules";
import { usePlayer, PlayerEmbeddedControl } from "~/components/Player/index";
import { ShareDialog } from "~/components/Social/index";
import { useModal, Modal } from "~/components/Modal/index";
import { useToasts } from "~/components/Toast";
import { AuthBanner } from "~/components/Auth/index";
import { useCurrentUser } from "~/hooks/user";
import {
  Room,
  useRoomQuery,
  useRoomStateQuery,
  useOnRoomStateUpdatedSubscription,
  useJoinPrivateRoomMutation,
  useQueueQuery,
  RoomState,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import {
  SvgChevronLeft,
  SvgShare,
  SvgSettings,
  SvgBookOpen,
} from "~/assets/svg";

const RoomQueue = dynamic(() => import("./RoomQueue"), { ssr: false });
const RoomChat = dynamic(() => import("./RoomChat"), { ssr: false });

const RoomInit: React.FC<{ room: Room }> = ({ room }) => {
  const { t } = useI18n();

  const isInit = useRef<boolean>(false);
  const [shouldPromptPassword, setShouldPromptPassword] = useState(false);
  const [
    { data: { roomState } = { roomState: undefined } },
    fetchRoomState,
  ] = useRoomStateQuery({ variables: { id: room.id } });
  const toasts = useToasts();
  const [, fetchQueue] = useQueueQuery({
    variables: { id: `room:${room.id}` },
  });
  const { playRoom } = usePlayer();
  const user = useCurrentUser();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [{ fetching }, joinPrivateRoom] = useJoinPrivateRoomMutation();

  const handleJoinPrivateRoom = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!passwordRef.current || fetching) return;
      const result = await joinPrivateRoom({
        id: room.id,
        password: passwordRef.current.value,
      }).then((response) => response.data?.joinPrivateRoom);
      if (result) {
        // Joined, invalidate certain queries
        fetchRoomState({ requestPolicy: "cache-and-network" });
        fetchQueue({ requestPolicy: "cache-and-network" });
        playRoom(room.id);
      } else {
        // Bad password
        toasts.error(t("room.main.init.badPassword"));
      }
    },
    [
      t,
      toasts,
      fetchRoomState,
      room,
      joinPrivateRoom,
      passwordRef,
      fetching,
      fetchQueue,
      playRoom,
    ]
  );

  // If room is not public and user is not a collab or creator
  const shouldPrompt =
    roomState &&
    !room.isPublic &&
    room.creatorId !== user?.id &&
    !roomState.collabs.includes(user?.id || "");

  useEffect(() => {
    if (isInit.current) return;
    if (!roomState) return;

    const should: boolean = (() => {
      if (room.isPublic) return false;
      if (
        room.creatorId === user?.id ||
        roomState.collabs.includes(user?.id || "")
      )
        return false;
      return true;
    })();

    if (should) setShouldPromptPassword(should);
    else playRoom(room.id);

    isInit.current = true;
  }, [isInit, room, playRoom, roomState, user]);

  if (!shouldPrompt) return null;

  return (
    <Modal.Modal active={shouldPromptPassword}>
      <Modal.Header>
        <Modal.Title>Join {room.title}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {user ? (
          <>
            <p>{t("room.main.init.password1")}</p>
            <form className="flex my-1" onSubmit={handleJoinPrivateRoom}>
              <input
                type="password"
                autoComplete="current-password"
                aria-label="Password"
                ref={passwordRef}
                className="input w-full mr-1"
              />
              <button type="submit" className="button" disabled={fetching}>
                {t("room.main.init.join")}
              </button>
            </form>
            <p className="text-foreground-secondary text-xs mt-2">
              {t("room.main.init.password2")}
            </p>
          </>
        ) : (
          <AuthBanner prompt="Join Stereo to Enter a Private Room" />
        )}
        <div className="text-center">
          <Link href="/browse">
            <button className="text-sm font-bold text-foreground-secondary hover:text-foreground-tertiary mt-2 p-1">
              {t("room.main.init.leave")}
            </button>
          </Link>
        </div>
      </Modal.Content>
    </Modal.Modal>
  );
};

const RoomLive: React.FC<{
  room: Room;
  roomState: RoomState | undefined;
}> = ({ room, roomState }) => {
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
  roomState: RoomState | undefined | null;
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
          {room.creatorId === user?.id && roomState && (
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

const RoomMain: React.FC<{ initialRoom: Room }> = ({ initialRoom }) => {
  // initialRoom is the same as room, only might be a outdated version
  // so it can be used as backup
  const [{ data }] = useRoomQuery({
    variables: { id: initialRoom.id as string },
  });
  const room = data?.room || initialRoom;
  const [
    { data: { roomState } = { roomState: undefined } },
  ] = useRoomStateQuery({
    variables: { id: room?.id as string },
    pause: !room,
  });
  useOnRoomStateUpdatedSubscription(
    { variables: { id: room?.id as string }, pause: !room },
    (prevResposne, response) => response
  );

  const [expandedQueue, expandQueue, collapseQueue] = useModal();

  return (
    <>
      <div className="h-screen relative pt-12 overflow-hidden">
        <Navbar room={room} roomState={roomState} />
        <div className={`flex flex-col lg:flex-row h-full`}>
          <div className="relative flex-1">
            <RoomLive room={room} roomState={roomState || undefined} />
          </div>
          <div className={`w-full p-2 lg:w-96 max-w-full`}>
            <button
              onClick={expandQueue}
              className="h-12 w-full button inline-flex lg:hidden"
            >
              Queue
            </button>
            <div
              className={`bordered-box w-full h-full flex flex-col z-30 fixed inset-0 lg:static ${
                expandedQueue ? "block" : "hidden"
              } p-2 rounded-lg lg:block`}
            >
              <RoomQueue room={room} roomState={roomState || undefined} />
              <button
                onClick={collapseQueue}
                className="h-12 w-full flex-none button button-success mt-2 lg:hidden"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
      <RoomInit room={room} />
    </>
  );
};

export default RoomMain;
