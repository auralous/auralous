import React, { useCallback, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {
  PlatformName,
  QueueAction,
  Track,
  useCreateRoomMutation,
  User,
  useRoomsQuery,
  useSearchTrackQuery,
  useUpdateQueueMutation,
} from "~/graphql/gql.gen";
import { useCurrentUser, useMAuth } from "~/hooks/user";
import { useLogin } from "~/components/Auth";
import { SvgCheck, SvgX } from "~/assets/svg";

const CreateRoom: React.FC<{ initTracks?: Track[] }> = ({ initTracks }) => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [isPublic, setIsPublic] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const anyoneCanAddRef = useRef<HTMLSelectElement>(null);

  const [{ fetching }, createRoom] = useCreateRoomMutation();
  const [, updateQueue] = useUpdateQueueMutation();

  const handleRoomCreation = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (fetching) return;
      event.preventDefault();

      if (!isPublic && !passwordRef.current?.value) {
        if (
          !window.confirm(
            "The room password is not set. Anyone with the link can enter the room and become a collaborator. Continue anyway?"
          )
        )
          return;
      }

      const result = await createRoom({
        title: (titleRef.current as HTMLInputElement).value,
        description: (descriptionRef.current as HTMLTextAreaElement).value,
        isPublic,
        anyoneCanAdd: isPublic ? anyoneCanAddRef.current?.value === "1" : false,
        password: passwordRef.current?.value ?? (isPublic ? undefined : ""),
      });

      if (result.data?.createRoom) {
        if (initTracks?.length)
          await updateQueue({
            id: `room:${result.data.createRoom.id}`,
            action: QueueAction.Add,
            tracks: initTracks.map((initTrack) => initTrack.id),
          });

        router.push("/room/[roomId]", `/room/${result.data.createRoom.id}`);
      }
    },
    [initTracks, router, fetching, isPublic, createRoom, updateQueue]
  );

  useEffect(() => {
    // Default
    if (anyoneCanAddRef.current) anyoneCanAddRef.current.value = "0";
  }, [anyoneCanAddRef]);

  return (
    <form onSubmit={handleRoomCreation} autoComplete="off">
      <div className="mb-2 flex">
        <label
          className="flex items-center label mr-1 mb-0 bg-background-secondary rounded-lg px-4"
          htmlFor="roomTitle"
        >
          Title
        </label>
        <input
          id="roomTitle"
          aria-label="Enter a title for the station"
          required
          className="input w-full"
          type="text"
          ref={titleRef}
          disabled={fetching}
        />
      </div>
      <div className="mb-2 hidden">
        <label className="label" htmlFor="roomDesc">
          Description
        </label>
        <textarea
          id="roomDesc"
          aria-label="Enter a description for the station"
          className="input w-full"
          ref={descriptionRef}
          disabled={fetching}
        />
      </div>
      <div className="mb-2 flex">
        <label
          htmlFor="roomPrivacy"
          className="flex items-center label mr-1 mb-0 bg-background-secondary rounded-lg px-4"
        >
          Privacy
        </label>
        <div className="inline-flex items-center border-background-secondary border-2 p-2 rounded-lg">
          <div className="flex items-center mr-4">
            <input
              id="roomPrivacyPrivate"
              name="roomPrivacy"
              type="radio"
              value="private"
              className="input"
              checked={!isPublic}
              onChange={(e) => setIsPublic(e.currentTarget.value === "public")}
            />
            <label className="label mb-0 pl-1" htmlFor="roomPrivacyPrivate">
              Private
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="roomPrivacyPublic"
              name="roomPrivacy"
              type="radio"
              value="public"
              className="input"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.currentTarget.value === "public")}
            />
            <label className="label mb-0 pl-1" htmlFor="roomPrivacyPublic">
              Public
            </label>
          </div>
        </div>
      </div>
      <div className="h-20 mt-4 border-t-2 border-background-secondary pt-2">
        {isPublic ? (
          <>
            <div className="mb-2">
              <div className="flex">
                <label
                  className="flex items-center label mr-1 mb-0 bg-background-secondary rounded-lg px-4"
                  htmlFor="roomAnyoneCanAdd"
                >
                  Guests can add songs
                </label>
                <select
                  id="roomAnyoneCanAdd"
                  ref={anyoneCanAddRef}
                  className="input"
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
              <p className="text-xs text-foreground-tertiary px-1">
                If disabled, only room members can add songs
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-2">
              <div className="flex">
                <label
                  className="flex items-center label mr-1 mb-0 bg-background-secondary rounded-lg px-4"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  ref={passwordRef}
                  className="input flex-1 w-0"
                  maxLength={16}
                />
              </div>
              <p className="text-xs text-foreground-tertiary px-1">
                Anyone with a password will also become a collaborator
              </p>
            </div>
          </>
        )}
      </div>
      <button
        className="button mt-8"
        type="submit"
        title="Start listening"
        disabled={fetching}
      >
        <SvgCheck className="mr-2" /> Start Listening
      </button>
    </form>
  );
};

const AddExistedRoom: React.FC<{ initTracks?: Track[]; user: User }> = ({
  initTracks,
  user,
}) => {
  const router = useRouter();
  const [{ data: { rooms } = { rooms: undefined } }] = useRoomsQuery({
    variables: { creatorId: user?.id || "" },
    pause: !user,
  });
  const [, updateQueue] = useUpdateQueueMutation();

  const selectRef = useRef<HTMLSelectElement>(null);
  const onAdd = useCallback(async () => {
    if (!selectRef.current?.value) return;
    if (initTracks?.length)
      await updateQueue({
        id: `room:${selectRef.current.value}`,
        action: QueueAction.Add,
        tracks: initTracks.map((initTrack) => initTrack.id),
      });

    router.push("/room/[roomId]", `/room/${selectRef.current.value}`);
  }, [router, updateQueue, initTracks]);

  return (
    <div
      className={
        initTracks?.length
          ? ""
          : "opacity-50 pointer-events-none cursor-not-allowed"
      }
    >
      {initTracks?.length ? (
        <>
          <p className="px-4 text-center text-xs text-foreground-secondary">
            Select a room to start listening
          </p>
          <div className="flex px-4 py-2">
            <select ref={selectRef} className="input w-full rounded-r-none">
              {rooms?.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.title}
                </option>
              ))}
            </select>
            <button onClick={onAdd} className="button rounded-l-none">
              <SvgCheck />
            </button>
          </div>
        </>
      ) : (
        <p className="p-2 text-sm text-foreground-secondary text-center">
          Find something by entering a playlist link above to add to an existing
          room <i>or</i> create an empty room
        </p>
      )}
    </div>
  );
};

const isURL = (url?: string): URL | false => {
  if (!url) return false;
  try {
    return new URL(url);
  } catch (e) {
    return false;
  }
};

const getFeaturedArtists = (tracks: Track[]): string[] => {
  const o: Record<string, number> = {};
  for (const track of tracks)
    for (const artist of track.artists)
      o[artist.name] = o[artist.name] ? o[artist.name] + 1 : 1;
  return Object.entries(o)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
    .slice(0, 4);
};

const NewPage: NextPage = () => {
  const [tab, setTab] = useState<"create" | "add">("create");
  const user = useCurrentUser();
  const [, openLogin] = useLogin();
  const router = useRouter();
  const { data: mAuth } = useMAuth();
  const searchQuery = router.query.search as string | undefined;
  const inputRef = useRef<HTMLInputElement>(null);

  const [
    {
      data: { searchTrack: initTracks } = { searchTrack: undefined },
      fetching,
    },
  ] = useSearchTrackQuery({
    variables: {
      query: decodeURIComponent(searchQuery || ""),
      platform: mAuth?.platform || PlatformName.Youtube,
    },
    pause: !isURL(searchQuery),
  });

  useEffect(() => {
    inputRef.current!.value = searchQuery || "";
  }, [searchQuery]);

  return (
    <>
      <NextSeo title="Start listening together" noindex />
      <div className="container mx-auto pt-20">
        <div className="py-6 px-3 min-h-40">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const s = inputRef.current!.value.trim();
              s && router.replace(`/new?search=${encodeURIComponent(s)}`);
            }}
            className="p-4"
          >
            <input
              ref={inputRef}
              className=" w-full mb-2 px-4 py-2 text-center font-bold border-b-4 border-pink bg-transparent transition duration-300"
              placeholder="Optional: Enter a playlist link to listen together"
            />
            {initTracks?.length ? (
              <p className="text-foreground-secondary text-center">
                <SvgCheck
                  width="18"
                  height="18"
                  className="inline bg-pink text-white p-1 rounded-full mr-1"
                />
                Start listening together to{" "}
                <b className="text-foreground">{initTracks.length} tracks</b>{" "}
                featuring{" "}
                <i className="text-foreground">
                  {getFeaturedArtists(initTracks).join(", ")}
                </i>
                .
              </p>
            ) : (
              !!searchQuery &&
              (fetching ? (
                <p className="text-foreground-secondary text-center text-sm">
                  Fetching...
                </p>
              ) : (
                <p className="text-foreground-secondary text-center text-sm">
                  <SvgX
                    width="18"
                    height="18"
                    className="inline bg-foreground-tertiary text-white p-1 rounded-full mr-1"
                  />
                  No songs found from the above link
                </p>
              ))
            )}
          </form>
        </div>
        <div role="tablist" className="flex flex-none mb-2">
          <button
            role="tab"
            className={`flex-1 mx-1 p-2 text-xs rounded-lg font-bold ${
              tab === "create"
                ? "bg-pink text-white"
                : "opacity-75 hover:opacity-100 bg-white text-pink"
            } transition duration-300`}
            aria-controls="tabpanel_create"
            onClick={() => setTab("create")}
            aria-selected={tab === "create"}
          >
            Create New Room
          </button>
          <button
            role="tab"
            className={`flex-1 mx-1 p-2 text-xs rounded-lg font-bold ${
              initTracks?.length
                ? tab === "add"
                  ? "bg-pink text-white"
                  : "opacity-75 hover:opacity-100 bg-white text-pink"
                : "opacity-25"
            } transition duration-300`}
            aria-controls="tabpanel_add"
            onClick={() => setTab("add")}
            aria-selected={tab === "add"}
            disabled={!initTracks?.length}
          >
            Use an Existing Room
          </button>
        </div>
        {user ? (
          <>
            <div
              role="tabpanel"
              id="tabpanel_create"
              className="p-2"
              hidden={tab !== "create"}
            >
              <CreateRoom initTracks={initTracks} />
            </div>
            <div
              role="tabpanel"
              id="tabpanel_add"
              className="p-2"
              hidden={tab !== "add"}
            >
              <AddExistedRoom user={user} initTracks={initTracks} />
            </div>
          </>
        ) : (
          <>
            <p className="font-bold mb-2">Sign in to create your rooms</p>
            <button onClick={openLogin} className="button button-foreground">
              Sign in
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default NewPage;
