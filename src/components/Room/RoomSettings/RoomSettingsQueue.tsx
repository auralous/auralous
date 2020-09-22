import React, { useRef, useEffect, useState } from "react";
import { useModal, Modal } from "~/components/Modal/index";
import { useToasts } from "~/components/Toast";
import {
  Room,
  useUserQuery,
  useUpdateRoomMutation,
  useUpdateRoomMembershipMutation,
  RoomMembership,
  RoomState,
} from "~/graphql/gql.gen";
import { SvgPlus, SvgX } from "~/assets/svg";

const RoomMember: React.FC<{ userId: string; roomId: string }> = ({
  userId,
  roomId,
}) => {
  const toasts = useToasts();
  const [{ data }] = useUserQuery({ variables: { id: userId } });
  const [
    { fetching },
    updateRoomMembership,
  ] = useUpdateRoomMembershipMutation();
  const handleDeleteMembership = async () => {
    const { error } = await updateRoomMembership({
      id: roomId,
      userId,
      role: null,
    });
    if (!error)
      toasts.success(
        `Remove ${data?.user?.username || "user"} from Collaborators`
      );
  };
  return (
    <div className="h-16 w-16 relative mr-1">
      {
        //FIXME: Add user name
        data?.user ? (
          <>
            <img
              className="w-full h-full rounded-lg object-cover"
              src={data.user.profilePicture}
              alt={data.user.username}
              title={data.user.username}
            />
          </>
        ) : (
          <div className="bg-background-secondary animate-pulse w-full h-full rounded" />
        )
      }
      <button
        className="button button-danger absolute top-0 right-0 w-5 h-5 p-0 -m-1"
        title={`Remove ${data?.user?.username || "user"}`}
        onClick={handleDeleteMembership}
        disabled={fetching}
      >
        <SvgX width="10" height="10" />
      </button>
    </div>
  );
};

const RoomMemberSection: React.FC<{
  room: Room;
  roomState: RoomState;
}> = ({ room, roomState }) => {
  const [activeAdd, openAdd, closeAdd] = useModal();
  const toasts = useToasts();
  const [
    { fetching },
    updateRoomMembership,
  ] = useUpdateRoomMembershipMutation();
  const handleAdd = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (fetching) return;
    const username = ev.currentTarget.uname.value;
    if (!username)
      return toasts.error("Enter the username of the person to be added");
    const { error } = await updateRoomMembership({
      id: room.id,
      username,
      role: RoomMembership.Collab,
    });
    if (!error) {
      toasts.success("User added to Collaborators");
      closeAdd();
    }
    return;
  };

  return (
    <>
      <div className="flex flex-wrap">
        <button className="button h-16 w-16 mr-1" onClick={openAdd}>
          <SvgPlus />
        </button>
        {roomState.collabs.map((userId) => (
          // TODO: react-window
          <RoomMember key={userId} userId={userId} roomId={room.id} />
        ))}
      </div>
      <Modal.Modal active={activeAdd} onOutsideClick={closeAdd}>
        <Modal.Header>
          <Modal.Title>Add a member</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <p className="mb-2">
            Enter the username of the one you want to add to{" "}
            <b>Collaborators</b>
          </p>
          <form onSubmit={handleAdd} className="flex">
            <input name="uname" className="input flex-1 mr-1" />
            <button type="submit" className="button" disabled={fetching}>
              Add Member
            </button>
          </form>
        </Modal.Content>
      </Modal.Modal>
    </>
  );
};

const RoomSettingsQueue: React.FC<{
  room: Room;
  roomState: RoomState;
}> = ({ room, roomState }) => {
  const anyoneCanAddRef = useRef<HTMLSelectElement>(null);
  const queueMaxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!roomState) return;
    anyoneCanAddRef.current!.value = roomState.anyoneCanAdd ? "1" : "0";
    queueMaxRef.current!.value = String(roomState.queueMax || 0);
  }, [roomState]);

  const [{ fetching }, updateRoom] = useUpdateRoomMutation();
  const [isChanged, setIsChanged] = useState(false);

  const handleSaveRules = async () => {
    const update = {
      id: room.id,
      anyoneCanAdd: anyoneCanAddRef.current!.value === "1",
      queueMax: parseInt(queueMaxRef.current!.value, 10),
    };
    if (
      update.anyoneCanAdd === roomState.anyoneCanAdd &&
      update.queueMax === roomState.queueMax
    ) {
      return setIsChanged(false);
    }
    const result = await updateRoom(update);
    if (!result.error) setIsChanged(false);
  };

  return (
    <>
      <h4 className="text-2xl font-bold bg-background-secondary rounded-lg py-1 px-2 mb-4">
        Room Rules
      </h4>
      <div className="mb-4">
        <h5 className="text-lg font-bold">Allow guests to add songs</h5>
        <p className="text-foreground-secondary mb-1">
          If disabled, only <b>room members</b> (not <b>Guest</b>) can add
          songs.
        </p>
        <select
          ref={anyoneCanAddRef}
          className="input"
          onChange={() => setIsChanged(true)}
        >
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </select>
      </div>
      <div className="mb-4">
        <h5 className="text-lg font-bold">Max songs</h5>
        <p className="text-foreground-secondary mb-1">
          Highest numbers of songs that one can add to the queue at a time. (0
          means Unlimited)
        </p>
        <input
          ref={queueMaxRef}
          className="input w-24"
          type="number"
          min="0"
          max="50"
          onChange={() => setIsChanged(true)}
        />
      </div>
      <button
        className="button  mb-6"
        onClick={handleSaveRules}
        disabled={!isChanged || fetching}
      >
        {isChanged ? "Save" : "Saved"}
      </button>
      <h4 className="text-2xl font-bold bg-background-secondary rounded-lg py-1 px-2 mb-4">
        Room Members
      </h4>
      <div className="mb-4">
        <h5 className="text-lg font-bold">Host</h5>
        <p className="text-foreground-secondary mb-1">
          PHENOMENAL COSMIC POWERS!
        </p>
        <a
          href="https://giphy.com/explore/its-you"
          className="text-success-light hover:text-success-dark font-bold"
          rel="noreferrer noopener nofollow"
          target="_blank"
        >
          This person
        </a>
      </div>
      <div className="mb-4">
        <h5 className="text-lg font-bold">Collaborator</h5>
        <p className="text-foreground-secondary mb-1">
          Can also add songs to the room. Exciting!
        </p>
        <RoomMemberSection room={room} roomState={roomState} />
      </div>
      <div className="mb-4">
        <h5 className="text-lg font-bold">Guest</h5>
        <p className="text-foreground-secondary mb-1">
          Can <b>only</b> react to songs -- that&apos;s it.
        </p>
        <p>
          <i>(everyone else)</i>
        </p>
      </div>
    </>
  );
};

export default RoomSettingsQueue;
