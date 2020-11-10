import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import RoomSettings from "./RoomSettings/index";
import RoomRules from "./RoomRules";
import { usePlayer, PlayerEmbeddedControl } from "~/components/Player/index";
import { ShareDialog } from "~/components/Social/index";
import { useModal, Modal } from "~/components/Modal/index";
import { useNowPlaying } from "~/components/NowPlaying";
import { useToasts } from "~/components/Toast";
import { AuthBanner } from "~/components/Auth/index";
import { useCurrentUser } from "~/hooks/user";
import {
  Room,
  useRoomQuery,
  useRoomStateQuery,
  useOnRoomStateUpdatedSubscription,
  useSkipNowPlayingMutation,
  useJoinPrivateRoomMutation,
  useQueueQuery,
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

const RoomSkipNowPlaying: React.FC<{ room: Room }> = ({ room }) => {
  const { t } = useI18n();

  const user = useCurrentUser();
  const [nowPlaying] = useNowPlaying(room.id);
  const [{ fetching }, skipNowPlaying] = useSkipNowPlayingMutation();
  return (
    <div className="flex justify-center h-6 mt-4">
      {!!user &&
        (user.id === room.creatorId ||
          nowPlaying?.currentTrack?.creatorId === user.id) && (
          <button
            className="text-xs py-1 px-2 text-white font-bold text-opacity-50 hover:text-opacity-75 transition-colors duration-300"
            onClick={() => skipNowPlaying({ id: room.id })}
            disabled={fetching}
          >
            {t("nowPlaying.skipSong")}
          </button>
        )}
    </div>
  );
};

const RoomLive: React.FC<{
  room: Room;
}> = ({ room }) => {
  return (
    <>
      <div className={`w-full h-full flex flex-col relative overflow-hidden`}>
        <div className="p-2 flex-1 flex flex-col justify-center overflow-auto">
          <PlayerEmbeddedControl roomId={room.id} />
          <RoomSkipNowPlaying room={room} />
        </div>
      </div>
    </>
  );
};

const Navbar: React.FC<{
  room: Room;
  tab: "live" | "chat" | "queue";
  setTab: React.Dispatch<React.SetStateAction<"live" | "chat" | "queue">>;
}> = ({ room, tab, setTab }) => {
  const { t } = useI18n();
  const [activeShare, openShare, closeShare] = useModal();
  const router = useRouter();
  return (
    <>
      <div className="nav px-2 overflow-hidden">
        <div className="flex flex-1 w-0 items-center justify-start h-full">
          <button
            onClick={() =>
              tab === "live" ? router.push("/browse") : setTab("live")
            }
            className="p-1 mr-2"
            title={t("common.backToHome")}
          >
            <SvgChevronLeft />
          </button>
          <h4 className="text-md font-bold leading-tight truncate mr-2">
            {room.title}
          </h4>
          <button
            onClick={openShare}
            className="button p-1 mx-1"
            title={t("share.title")}
          >
            <SvgShare width="14" height="14" />
          </button>
        </div>
        <div className="flex items justify-end">
          <div className="flex-none lg:hidden flex">
            <button
              className={`text-lg font-bold mx-1 p-1 ${
                tab === "live" ? "opacity-100" : "opacity-25"
              } transition-opacity duration-200`}
              onClick={() => setTab("live")}
            >
              {t("room.live.title")}
            </button>
            <button
              className={`text-lg font-bold mx-1 p-1 ${
                tab === "queue" ? "opacity-100" : "opacity-25"
              } transition-opacity duration-200`}
              onClick={() => setTab("queue")}
            >
              {t("room.queue.title")}
            </button>
            <button
              className={`text-lg font-bold mx-1 p-1 ${
                tab === "chat" ? "opacity-100" : "opacity-25"
              } transition-opacity duration-200`}
              onClick={() => setTab("chat")}
            >
              {t("room.chat.title")}
            </button>
          </div>
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
  const { t } = useI18n();

  // initialRoom is the same as room, only might be a outdated version
  // so it can be used as backup
  const [{ data }] = useRoomQuery({
    variables: { id: initialRoom.id as string },
  });
  const room = data?.room || initialRoom;
  const [tab, setTab] = useState<"live" | "chat" | "queue">("live");
  const user = useCurrentUser();
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

  const [activeRules, openRules, closeRules] = useModal();
  const [activeSettings, openSettings, closeSettings] = useModal();

  return (
    <>
      <div className="h-screen relative pt-12 overflow-hidden">
        <Navbar room={room} tab={tab} setTab={setTab} />
        <div className="flex h-full overflow-hidden">
          <div
            className={`w-full ${
              tab === "queue" ? "" : "hidden"
            } lg:block flex-1 overflow-hidden`}
            style={{
              background: "linear-gradient(0deg, rgba(0,0,0,.1), transparent)",
            }}
          >
            <RoomQueue room={room} roomState={roomState || undefined} />
          </div>
          <div
            className={`w-full relative ${
              tab === "live" ? "" : "hidden"
            } lg:block lg:w-1/2`}
          >
            <RoomLive room={room} />
            {room.creatorId === user?.id && roomState && (
              <>
                <button
                  title={t("room.settings.title")}
                  onClick={openSettings}
                  className="button absolute top-2 left-2"
                >
                  <SvgSettings />
                </button>
                <RoomSettings
                  roomState={roomState}
                  active={activeSettings}
                  close={closeSettings}
                  room={room}
                />
              </>
            )}
            {roomState && (
              <>
                <button
                  onClick={openRules}
                  className="button absolute top-2 right-2"
                  title={t("room.rules.title")}
                >
                  <SvgBookOpen />
                </button>
                <RoomRules
                  active={activeRules}
                  close={closeRules}
                  roomState={roomState}
                />
              </>
            )}
          </div>
          <div
            className={`w-full ${
              tab === "chat" ? "" : "hidden"
            } lg:block flex-1 overflow-hidden`}
            style={{
              background: "linear-gradient(0deg, rgba(0,0,0,.1), transparent)",
            }}
          >
            <RoomChat room={room} roomState={roomState || undefined} />
          </div>
        </div>
      </div>
      <RoomInit room={room} />
    </>
  );
};

export default RoomMain;
