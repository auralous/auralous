import React, { useState, useEffect, useMemo } from "react";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";
import { usePlayer, PlayerEmbeddedControl } from "~/components/Player/index";
import { ShareDialog } from "~/components/Social/Share";
import { useModal, Modal } from "~/components/Modal/index";
import { QueuePermission } from "~/components/Queue";
import { useCurrentUser } from "~/hooks/user";
import NotFoundPage from "../../404";
import { forwardSSRHeaders } from "~/lib/ssr-utils";
import {
  Room,
  useRoomQuery,
  useUserQuery,
  useRoomStateQuery,
  useOnRoomStateUpdatedSubscription,
  RoomMembership,
  RoomState,
} from "~/graphql/gql.gen";
import {
  SvgChevronLeft,
  SvgShare,
  SvgSettings,
  SvgUser,
  SvgPlay,
  SvgMaximize2,
} from "~/assets/svg";
import { useLogin } from "~/components/Auth";
import { useQueue } from "~/components/Queue/index";
import { QUERY_ROOM } from "~/graphql/room";
import { CONFIG } from "~/lib/constants";
import { TrackItem } from "~/components/Track/TrackItem";
import { QueueRules } from "~/components/Queue/types";

// FIXME: types: should be inferred
const RoomSettingsModal = dynamic<{
  room: Room;
  roomState: RoomState;
  active: boolean;
  close: () => void;
}>(() =>
  import("~/components/Room/index").then((mod) => mod.RoomSettingsModal)
);

const QueueManager = dynamic<{
  queueId: string;
  permission: QueuePermission;
  rules: QueueRules;
}>(() => import("~/components/Queue/index").then((mod) => mod.QueueManager), {
  ssr: false,
});

const QueueViewer = dynamic<{
  queueId: string;
  reverse?: boolean | undefined;
}>(() => import("~/components/Queue/index").then((mod) => mod.QueueViewer), {
  ssr: false,
});

const Chatbox = dynamic<{ roomId: string }>(() =>
  import("~/components/Chat/index").then((mod) => mod.Chatbox)
);

const CurrentUser: React.FC<{
  userId: string;
  role: RoomMembership | null;
}> = ({ userId, role }) => {
  const [{ data }] = useUserQuery({ variables: { id: userId } });
  return (
    <div className="flex items-start w-56 p-2 hover:bg-background-secondary rounded-lg mb-2 mr-2">
      {data?.user ? (
        <img
          className="rounded-full w-12 h-12 object-cover"
          src={data.user.profilePicture}
          alt={data.user.username}
        />
      ) : (
        <div className="rounded-full w-12 h-12 bg-background-secondary animate-pulse" />
      )}
      <div className="ml-2 overflow-hidden">
        <h5 className="font-bold truncate leading-tight">
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

const CurrentUserButton: React.FC<{ room: Room }> = ({ room }) => {
  const [
    { data: { roomState } = { roomState: undefined } },
  ] = useRoomStateQuery({ variables: { id: room.id } });
  const [active, show, close] = useModal();
  if (!roomState) return null;
  return (
    <>
      <button
        className="button text-xs px-1 py-0 h-6 mx-1"
        onClick={show}
        aria-label="Show current listeners"
      >
        <SvgUser width="14" height="14" className="mr-1" />{" "}
        {roomState.userIds.length || "0"}
      </button>
      <Modal.Modal active={active} onOutsideClick={close}>
        <Modal.Header>
          <Modal.Title>In this room</Modal.Title>
        </Modal.Header>
        <Modal.Content className="flex flex-wrap">
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
        </Modal.Content>
      </Modal.Modal>
    </>
  );
};

const RoomQueue: React.FC<{ room: Room }> = ({ room }) => {
  const [
    { data: { roomState } = { roomState: undefined } },
  ] = useRoomStateQuery({ variables: { id: room.id } });
  const user = useCurrentUser();
  const [, logIn] = useLogin();
  const permission = useMemo(
    () => ({
      canEditOthers: user?.id === room.creator.id,
      canAdd:
        !!user &&
        Boolean(
          room.creator.id === user.id ||
            roomState?.anyoneCanAdd ||
            roomState?.collabs.includes(user.id)
        ),
    }),
    [user, room, roomState]
  );

  return (
    <>
      {!user && (
        <div className="p-2">
          <button
            onClick={logIn}
            className="button button-foreground text-xs flex-none w-full"
          >
            Sign in to add songs
          </button>
        </div>
      )}
      <QueueManager
        queueId={`room:${room.id}`}
        permission={permission}
        rules={{ maxSongs: roomState?.queueMax ?? 0 }}
      />
    </>
  );
};

const TrackListModal: React.FC<{
  room: Room;
  active: boolean;
  close: () => void;
}> = ({ room, active, close }) => {
  const [tab, setTab] = useState<"played" | "next">("next");
  return (
    <Modal.Modal active={active} onOutsideClick={close}>
      <Modal.Header>
        <div role="tablist">
          <button
            role="tab"
            className={`font-bold text-xl leading-tight ${
              tab === "next" ? "opacity-100" : "opacity-25"
            } transition-opacity duration-200 mr-4`}
            aria-controls="tabpanel_next"
            onClick={() => setTab("next")}
            aria-selected={tab === "next"}
          >
            Up Next
          </button>
          <button
            role="tab"
            className={`font-bold text-xl leading-tight ${
              tab === "played" ? "opacity-100" : "opacity-25"
            } transition-opacity duration-200 mr-2`}
            aria-controls="tabpanel_played"
            onClick={() => setTab("played")}
            aria-selected={tab === "played"}
          >
            Recently Played
          </button>
        </div>
      </Modal.Header>
      <div className="flex-1 overflow-hidden">
        <div
          style={{ height: "85vh" }}
          aria-labelledby="tabpanel_next"
          role="tabpanel"
          aria-hidden={tab !== "next"}
          hidden={tab !== "next"}
        >
          <RoomQueue room={room} />
        </div>
        <div
          style={{ height: "85vh" }}
          aria-labelledby="tabpanel_played"
          role="tabpanel"
          aria-hidden={tab !== "played"}
          hidden={tab !== "played"}
        >
          <QueueViewer reverse queueId={`room:${room.id}:played`} />
        </div>
      </div>
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
        aria-label="Room Settings"
        onClick={open}
        className="button bg-white bg-opacity-25 absolute top-2 left-2"
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
      >
        {!isViewed && (
          <span className="animate-ping absolute top-0 right-0 -m-1 w-3 h-3 rounded-full bg-pink" />
        )}
        Rules
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
            <li className="px-4 py-2 mb-2 rounded-lg">
              {roomState?.queueMax ? (
                <span>
                  One can only add{" "}
                  <b className="text-warning-light">
                    {roomState?.queueMax} songs
                  </b>{" "}
                  at a time
                </span>
              ) : (
                `One can add as many songs as they wish. Be considerate, though!`
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

const QueueSection: React.FC<{ room: Room }> = ({ room }) => {
  const [activeList, openList, closeList] = useModal();

  const [queue] = useQueue(`room:${room.id}`);

  return (
    <>
      <div className="w-full flex-none p-2 overflow-hidden">
        <div
          role="button"
          onClick={openList}
          className="rounded-lg relative p-2 outline-none bg-background-secondary focus:bg-background-tertiary hover:bg-background-tertiary transition-colors duration-200"
          tabIndex={0}
          onKeyDown={(ev) =>
            (ev.key === "Enter" || ev.key === " ") && openList()
          }
        >
          <span className="absolute top-2 right-2">
            <SvgMaximize2 width="14" />
          </span>
          <div className="text-xs font-bold mb-1">Up Next</div>
          {queue?.items[0] ? (
            <TrackItem id={queue.items[0].trackId} />
          ) : (
            <div className="h-12 p-1 px-2">
              <p className="text-sm leading-noney text-foreground-secondary font-semibold">
                No upcoming track
              </p>
              <span className="text-success-light text-sm font-bold">
                Add a song
              </span>
            </div>
          )}
        </div>
      </div>
      <TrackListModal room={room} active={activeList} close={closeList} />
    </>
  );
};

const RoomMain: React.FC<{
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
          <PlayerEmbeddedControl nowPlayingReactionId={`room:${room.id}`} />
        )}
      </div>
      <QueueSection room={room} />
    </div>
  );
};

const Navbar: React.FC<{
  room: Room;
  tab: "main" | "chat";
  setTab: React.Dispatch<React.SetStateAction<"main" | "chat">>;
}> = ({ room, tab, setTab }) => {
  const [activeShare, openShare, closeShare] = useModal();
  return (
    <>
      <div className="nav px-2">
        <div className="flex flex-1 items-center justify-start h-full">
          <Link href="/explore">
            <button className="p-1 mr-2" title="Go back">
              <SvgChevronLeft />
            </button>
          </Link>
          <img
            alt={room.title}
            src={room.image}
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
          <h4 className="text-md font-bold leading-tight truncate mr-2">
            {room.title}
          </h4>
          <button onClick={openShare} className="button p-1 mx-1" title="Share">
            <SvgShare width="14" height="14" />
          </button>
          <CurrentUserButton room={room} />
        </div>
        <div className="flex items justify-end">
          <div className="flex-none md:hidden flex  " role="tablist">
            <button
              role="tab"
              className={`text-lg font-bold mx-1 p-1 ${
                tab === "main" ? "opacity-100" : "opacity-25"
              } transition-opacity duration-200`}
              aria-controls="tabpanel_next"
              onClick={() => setTab("main")}
              aria-selected={tab === "main"}
            >
              Live
            </button>
            <button
              role="tab"
              className={`text-lg font-bold mx-1 p-1 ${
                tab === "chat" ? "opacity-100" : "opacity-25"
              } transition-opacity duration-200`}
              aria-controls="tabpanel_played"
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
  const {
    playRoom,
    state: { playerPlaying },
  } = usePlayer();
  // initialRoom is the same as room, only might be a outdated version
  // so it can be used as backup
  const [{ data: { room } = { room: initialRoom } }] = useRoomQuery({
    variables: { id: initialRoom?.id as string },
    pause: !initialRoom,
  });

  useEffect(() => {
    if (room?.id) playRoom(room?.id);
  }, [room, playRoom]);

  const [tab, setTab] = useState<"main" | "chat">("main");
  const user = useCurrentUser();
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
      />
      <div className="h-screen relative pt-12 overflow-hidden">
        <Navbar room={room} tab={tab} setTab={setTab} />
        <div className="flex h-full overflow-hidden">
          <div
            className="w-full h-full transform scale-105 absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${playerPlaying?.image || room.image})`,
              filter: "blur(14px) brightness(0.3)",
              zIndex: -1,
            }}
          />
          <div
            className={`w-full relative ${
              tab === "main" ? "" : "hidden"
            } md:block md:w-1/2 lg:w-3/4`}
          >
            <RoomMain room={room} />
            {room.creator && room.creator.id === user?.id && (
              <RoomSettingsButton room={room} />
            )}
            <RoomRulesButton room={room} />
          </div>
          <div
            className={`w-full ${
              tab === "chat" ? "" : "hidden"
            } md:block flex-1`}
            style={{ background: "linear-gradient(0deg, black, transparent)" }}
          >
            <Chatbox roomId={`room:${room.id}`} />
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  room: Room | null;
}> = async ({ params, req, res }) => {
  const result = await fetch(`${process.env.API_URI}/graphql`, {
    method: "POST",
    headers: {
      ...forwardSSRHeaders(req),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: QUERY_ROOM,
      variables: { id: params?.roomId },
    }),
  }).then((res) => res.json());
  const room = result.data?.room || null;
  if (!room) res.statusCode = 404;
  else {
    room.createdAt = JSON.stringify(room.createdAt);
    res.setHeader("cache-control", `public, max-age=${CONFIG.roomMaxAge}`);
  }
  return { props: { room } };
};

export default RoomPage;
