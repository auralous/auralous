import React, { useCallback, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useCreateRoomMutation } from "~/graphql/gql.gen";
import { useCurrentUser } from "~/hooks/user";
import { useLogin } from "~/components/Auth";

const CreateRoomContent: React.FC = () => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [isPublic, setIsPublic] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const anyoneCanAddRef = useRef<HTMLSelectElement>(null);

  const [{ fetching }, createRoom] = useCreateRoomMutation();

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
        router.push("/room/[roomId]", `/room/${result.data.createRoom.id}`);
      }
    },
    [createRoom, router, fetching, isPublic]
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
                  className="input"
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
        className="button button-success mt-8"
        type="submit"
        disabled={fetching}
      >
        Create Room
      </button>
    </form>
  );
};

const NewPage: NextPage = () => {
  const user = useCurrentUser();
  const [, openLogin] = useLogin();
  return (
    <>
      <NextSeo title="Create New" />
      <div className="container mx-auto pt-20">
        <h1 className="mb-4 text-2xl font-bold">Create new room</h1>
        {user ? (
          <CreateRoomContent />
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
