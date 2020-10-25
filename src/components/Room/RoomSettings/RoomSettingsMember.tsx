import React, { useCallback, useMemo } from "react";
import { SvgPlus } from "~/assets/svg";
import { useModal, Modal } from "~/components/Modal";
import { useToasts } from "~/components/Toast";
import {
  useUserQuery,
  useUpdateRoomMembershipMutation,
  Room,
  RoomState,
  RoomMembership,
} from "~/graphql/gql.gen";
import { MEMBERSHIP_NAMES } from "~/lib/constants";

const RoomMember: React.FC<{
  userId: string;
  roomId: string;
  role: RoomMembership | undefined;
}> = ({ userId, roomId, role }) => {
  const toasts = useToasts();
  const [{ data }] = useUserQuery({ variables: { id: userId } });
  const [
    { fetching },
    updateRoomMembership,
  ] = useUpdateRoomMembershipMutation();

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newRole = e.currentTarget.value as RoomMembership | "";
      updateRoomMembership({
        id: roomId,
        userId,
        role: newRole || null,
      }).then(({ error }) =>
        !error && newRole
          ? toasts.success(
              `Add ${data?.user?.username} to ${MEMBERSHIP_NAMES[newRole]}`
            )
          : toasts.success(`Remove ${data?.user?.username} as a room member`)
      );
    },
    [toasts, data, roomId, updateRoomMembership, userId]
  );

  return (
    <div className="h-12 mb-2 w-full mr-1 flex shadow-lg py-2 bg-background-secondary rounded-lg">
      {
        //FIXME: Add user name
        data?.user ? (
          <>
            <div className="px-2 flex-none">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={data.user.profilePicture}
                alt={data.user.username}
                title={data.user.username}
              />
            </div>
            <div className="font-bold text-foreground flex items-center justify-between w-full">
              <div className="flex-1 w-0 leading-none truncate">
                {data.user.username}
              </div>
              <div className="px-1 flex items-center">
                {role !== RoomMembership.Host ? (
                  <>
                    <select
                      value={role || ""}
                      onChange={onChange}
                      className="input px-1 py-2 mr-1"
                      disabled={fetching}
                    >
                      <option value={RoomMembership.Collab}>
                        {MEMBERSHIP_NAMES[RoomMembership.Collab]}
                      </option>
                      <option value="">{MEMBERSHIP_NAMES[""]}</option>
                    </select>
                  </>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mx-2 flex-none w-8 h-8 rounded-full bg-background-secondary animate-pulse" />
            <div className="bg-background-secondary animate-pulse rounded-lg w-full mr-2" />
          </>
        )
      }
    </div>
  );
};

const RoomSettingsMember: React.FC<{ room: Room; roomState: RoomState }> = ({
  room,
  roomState,
}) => {
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

  const otherUserIds = useMemo(
    () => roomState.collabs.filter((uid) => !roomState.userIds.includes(uid)),
    [roomState]
  );
  return (
    <>
      <div>
        <button
          className="button button-light h-12 mr-1 w-full mb-2"
          onClick={openAdd}
        >
          <SvgPlus /> Add a member
        </button>
        {roomState.userIds.map((userId) => {
          const role =
            room.creatorId === userId
              ? RoomMembership.Host
              : roomState.collabs.includes(userId)
              ? RoomMembership.Collab
              : undefined;
          return (
            <RoomMember
              key={userId}
              userId={userId}
              roomId={room.id}
              role={role}
            />
          );
        })}
        <p className="font-bold text-sm text-foreground-secondary mb-1">
          Offline
        </p>
        {otherUserIds.map((userId) => {
          const role =
            room.creatorId === userId
              ? RoomMembership.Host
              : roomState.collabs.includes(userId)
              ? RoomMembership.Collab
              : undefined;
          return (
            <RoomMember
              key={userId}
              userId={userId}
              roomId={room.id}
              role={role}
            />
          );
        })}
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

export default RoomSettingsMember;
