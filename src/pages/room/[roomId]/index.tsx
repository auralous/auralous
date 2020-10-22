import React, { useState, useEffect, useRef, useCallback } from "react";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";
import { usePlayer, PlayerEmbeddedControl } from "~/components/Player/index";
import { ShareDialog } from "~/components/Social/Share";
import { useModal, Modal } from "~/components/Modal/index";
import { useNowPlaying } from "~/components/NowPlaying";
import { useToasts } from "~/components/Toast";
import { useLogin } from "~/components/Auth/index";
import { useCurrentUser } from "~/hooks/user";
import NotFoundPage from "../../404";
import { forwardSSRHeaders } from "~/lib/ssr-utils";
import {
  Room,
  useRoomQuery,
  useRoomStateQuery,
  useOnRoomStateUpdatedSubscription,
  RoomState,
  useSkipNowPlayingMutation,
  useJoinPrivateRoomMutation,
  useQueueQuery,
} from "~/graphql/gql.gen";
import {
  SvgChevronLeft,
  SvgShare,
  SvgSettings,
  SvgPlay,
  SvgBookOpen,
} from "~/assets/svg";
import { QUERY_ROOM } from "~/graphql/room";
import { CONFIG } from "~/lib/constants";

// FIXME: types: should be inferred
const RoomSettingsModal = dynamic<{
  room: Room;
  roomState: RoomState;
  active: boolean;
  close: () => void;
}>(
  () => import("~/components/Room/index").then((mod) => mod.RoomSettingsModal),
  { ssr: false }
);

const RoomQueue = dynamic<{ room: Room; roomState?: RoomState }>(
  () => import("~/components/Room/index").then((mod) => mod.RoomQueue),
  { ssr: false }
);

const RoomChat = dynamic<{ room: Room; roomState?: RoomState }>(
  () => import("~/components/Room/index").then((mod) => mod.RoomChat),
  { ssr: false }
);

const RoomInit: React.FC<{ room: Room }> = ({ room }) => {
  const isInit = useRef<boolean>(false);
  const [shouldPromptPassword, setShouldPromptPassword] = useState(false);
  const [
    { data: { roomState } = { roomState: undefined } },
    fetchRoomState,
  ] = useRoomStateQuery({ variables: { id: room.id } });
  const toasts = useToasts();
  const [, openLogin] = useLogin();
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
        toasts.error("Incorrect room password");
      }
    },
    [
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
            <p>
              Enter room password to join <b>{room.title}</b>. Leave empty if it
              has no password.
            </p>
            <form className="flex my-1" onSubmit={handleJoinPrivateRoom}>
              <input
                ref={passwordRef}
                className="input w-full mr-1"
                placeholder="Room Password"
              />
              <button type="submit" className="button" disabled={fetching}>
                Join
              </button>
            </form>
            <p className="text-foreground-secondary text-xs mt-2">
              You can also join by asking the host to add you as a collaborator
            </p>
          </>
        ) : (
          <div>
            <p className="font-bold mb-2">Sign in to join a private room</p>
            <button onClick={openLogin} className="button button-foreground">
              Sign in
            </button>
          </div>
        )}

        <Link href="/browse">
          <button className="text-sm text-foreground-secondary hover:text-foreground-tertiary mt-2 p-1">
            ← Leave
          </button>
        </Link>
      </Modal.Content>
    </Modal.Modal>
  );
};

const RoomSettingsButton: React.FC<{ room: Room }> = ({ room }) => {
  const [active, open, close] = useModal();
  const [
    { data: { roomState } = { roomState: undefined } },
  ] = useRoomStateQuery({ variables: { id: room.id } });
  if (!roomState) return null;
  return (
    <>
      <button
        title="Room Settings"
        onClick={open}
        className="button button-light absolute top-2 left-2"
      >
        <SvgSettings />
      </button>
      <RoomSettingsModal
        roomState={roomState}
        active={active}
        close={close}
        room={room}
      />
    </>
  );
};

const RoomRulesButton: React.FC<{ room: Room }> = ({ room }) => {
  const [
    { data: { roomState } = { roomState: undefined } },
  ] = useRoomStateQuery({ variables: { id: room.id } });
  const [active, open, close] = useModal();
  const [isViewed, setIsViewed] = useState(false);
  return (
    <>
      <button
        aria-label="Room Rules"
        onClick={() => {
          open();
          setIsViewed(true);
        }}
        className="button button-light absolute top-2 right-2"
        title="Room Rules"
      >
        {!isViewed && (
          <span className="animate-ping absolute top-0 right-0 -m-1 w-3 h-3 rounded-full bg-pink" />
        )}
        <SvgBookOpen />
      </button>
      <Modal.Modal active={active} onOutsideClick={close}>
        <Modal.Header>
          <Modal.Title>Room Rules</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <ul className="py-4 text-xl mb-4">
            <li className="px-4 py-2 mb-2 rounded-lg">
              {roomState?.anyoneCanAdd ? (
                "Anyone can add songs"
              ) : (
                <span>
                  <b className="text-success-light">Only member</b> can add
                  songs
                </span>
              )}
            </li>
          </ul>
        </Modal.Content>
        <Modal.Footer>
          <button onClick={close} className="button">
            Got it!
          </button>
        </Modal.Footer>
      </Modal.Modal>
    </>
  );
};

const RoomSkipNowPlaying: React.FC<{ room: Room }> = ({ room }) => {
  const user = useCurrentUser();
  const [nowPlaying] = useNowPlaying("room", room.id);
  const [{ fetching }, skipNowPlaying] = useSkipNowPlayingMutation();
  return (
    <div className="flex justify-center h-6 mt-4">
      {!!user &&
        (user.id === room.creatorId ||
          nowPlaying?.currentTrack?.creatorId === user.id) && (
          <button
            className="text-xs py-1 px-2 text-white font-bold text-opacity-50 hover:text-opacity-75 transition-colors duration-300"
            onClick={() => skipNowPlaying({ id: `room:${room.id}` })}
            disabled={fetching}
          >
            Skip song
          </button>
        )}
    </div>
  );
};

const RoomLive: React.FC<{
  room: Room;
}> = ({ room }) => {
  const {
    state: { playerControl },
    playRoom,
  } = usePlayer();

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <div className="p-2 flex-1 flex flex-col justify-center overflow-auto">
        {playerControl !== `room:${room.id}` ? (
          <div className="flex justify-center py-16">
            <button
              onClick={() => playRoom(room.id)}
              className="button button-light rounded-full px-10 py-4"
            >
              <SvgPlay className="mr-1 fill-current" width="18" /> Start
              Listening
            </button>
          </div>
        ) : (
          <>
            <PlayerEmbeddedControl nowPlayingReactionId={`room:${room.id}`} />
            <RoomSkipNowPlaying room={room} />
          </>
        )}
      </div>
    </div>
  );
};

const Navbar: React.FC<{
  room: Room;
  tab: "live" | "chat" | "queue";
  setTab: React.Dispatch<React.SetStateAction<"live" | "chat" | "queue">>;
}> = ({ room, tab, setTab }) => {
  const [activeShare, openShare, closeShare] = useModal();
  return (
    <>
      <div className="nav px-2 overflow-hidden">
        <div className="flex flex-1 w-0 items-center justify-start h-full">
          <Link href="/browse">
            <button className="p-1 mr-2" title="Go back">
              <SvgChevronLeft />
            </button>
          </Link>
          <h4 className="text-md font-bold leading-tight truncate mr-2">
            {room.title}
          </h4>
          <button onClick={openShare} className="button p-1 mx-1" title="Share">
            <SvgShare width="14" height="14" />
          </button>
        </div>
        <div className="flex items justify-end">
          <div className="flex-none lg:hidden flex" role="tablist">
            <button
              role="tab"
              className={`text-lg font-bold mx-1 p-1 ${
                tab === "live" ? "opacity-100" : "opacity-25"
              } transition-opacity duration-200`}
              aria-controls="tabpanel_main"
              onClick={() => setTab("live")}
              aria-selected={tab === "live"}
            >
              Live
            </button>
            <button
              role="tab"
              className={`text-lg font-bold mx-1 p-1 ${
                tab === "queue" ? "opacity-100" : "opacity-25"
              } transition-opacity duration-200`}
              aria-controls="tabpanel_queue"
              onClick={() => setTab("queue")}
              aria-selected={tab === "queue"}
            >
              Queue
            </button>
            <button
              role="tab"
              className={`text-lg font-bold mx-1 p-1 ${
                tab === "chat" ? "opacity-100" : "opacity-25"
              } transition-opacity duration-200`}
              aria-controls="tabpanel_chat"
              onClick={() => setTab("chat")}
              aria-selected={tab === "chat"}
            >
              Chat
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

const RoomPage: NextPage<{
  room: Room | null;
}> = ({ room: initialRoom }) => {
  // initialRoom is the same as room, only might be a outdated version
  // so it can be used as backup
  const [{ data: { room } = { room: initialRoom } }] = useRoomQuery({
    variables: { id: initialRoom?.id as string },
    pause: !initialRoom,
  });
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

  if (!room) return <NotFoundPage />;
  return (
    <>
      <NextSeo
        title={room.title}
        description={
          room.description ||
          `Join ${room.title} on Stereo and listen to music together.`
        }
        canonical={`${process.env.APP_URI}/room/${room.id}`}
        openGraph={{
          images: [
            {
              url: room.image,
              alt: room.title,
            },
          ],
        }}
        noindex={!room.isPublic}
      />
      <div className="h-screen relative pt-12 overflow-hidden">
        <Navbar room={room} tab={tab} setTab={setTab} />
        <div className="flex h-full overflow-hidden">
          <div
            className={`w-full ${
              tab === "queue" ? "" : "hidden"
            } lg:block flex-1`}
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
            {room.creatorId === user?.id && <RoomSettingsButton room={room} />}
            <RoomRulesButton room={room} />
          </div>
          <div
            className={`w-full ${
              tab === "chat" ? "" : "hidden"
            } lg:block flex-1`}
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

export const getServerSideProps: GetServerSideProps<{
  room: Room | null;
}> = async ({ params, req, res }) => {
  const result = await fetch(
    `${process.env.API_URI}/graphql?query=${QUERY_ROOM.replace(
      /([\s,]|#[^\n\r]+)+/g,
      " "
    ).trim()}&variables=${JSON.stringify({ id: params?.roomId })}`,
    { headers: forwardSSRHeaders(req) }
  ).then((res) => res.json());
  const room = result.data?.room || null;
  if (!room) res.statusCode = 404;
  else {
    room.createdAt = JSON.stringify(room.createdAt);
    res.setHeader("cache-control", `public, max-age=${CONFIG.roomMaxAge}`);
  }
  return { props: { room } };
};

export default RoomPage;
