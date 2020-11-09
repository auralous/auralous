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
import { useI18n } from "~/i18n/index";
import { MEMBERSHIP_NAMES } from "~/lib/constants";
import { getRole } from "~/lib/room";

const RoomMember: React.FC<{
  userId: string;
  roomId: string;
  role: RoomMembership | undefined;
}> = ({ userId, roomId, role }) => {
  const { t } = useI18n();
  const toasts = useToasts();
  const [{ data, fetching: fetchingUser }] = useUserQuery({
    variables: { id: userId },
  });
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
              t("room.settings.member.addedText", {
                username: data?.user?.username,
                role: MEMBERSHIP_NAMES[newRole],
              })
            )
          : toasts.success(
              t("room.settings.member.removedText", {
                username: data?.user?.username,
              })
            )
      );
    },
    [t, toasts, data, roomId, updateRoomMembership, userId]
  );

  return (
    <div className="h-12 mb-2 w-full mr-1 flex shadow-lg py-2 bg-background-secondary rounded-lg">
      <div className="px-2 flex-none">
        {data?.user ? (
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={data.user.profilePicture}
            alt={data.user.username}
            title={data.user.username}
          />
        ) : (
          <div
            className={`flex-none w-8 h-8 rounded-full bg-background-secondary ${
              fetchingUser ? "animate-pulse" : ""
            }`}
          />
        )}
      </div>
      <div className="font-bold text-foreground flex items-center justify-between w-full">
        {data?.user ? (
          <div className="flex-1 w-0 leading-none truncate">
            {data.user.username}
          </div>
        ) : fetchingUser ? (
          <div className="bg-background-secondary animate-pulse rounded-lg flex-1 w-0" />
        ) : (
          <div className="flex-1 w-0 text-xs text-foreground-secondary">
            {t("room.settings.member.userNotFound")}
          </div>
        )}
        <div className="px-1 flex items-center">
          {role !== RoomMembership.Host ? (
            <>
              <select
                value={role || ""}
                onChange={onChange}
                onBlur={undefined}
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
    </div>
  );
};

const RoomSettingsMember: React.FC<{ room: Room; roomState: RoomState }> = ({
  room,
  roomState,
}) => {
  const { t } = useI18n();

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
    if (!username) return toasts.error(t("room.settings.member.userNotFound"));
    const { error } = await updateRoomMembership({
      id: room.id,
      username,
      role: RoomMembership.Collab,
    });
    if (!error) {
      toasts.success(
        t("room.settings.member.addedText", {
          username: username,
          role: MEMBERSHIP_NAMES.collab,
        })
      );
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
          <SvgPlus /> {t("room.settings.member.title")}
        </button>
        {roomState.userIds.map((userId) => {
          return (
            <RoomMember
              key={userId}
              userId={userId}
              roomId={room.id}
              role={getRole(userId, room, roomState)}
            />
          );
        })}
        <p className="font-bold text-sm text-foreground-secondary mb-1">
          {t("room.settings.member.offline")}
        </p>
        {otherUserIds.map((userId) => {
          return (
            <RoomMember
              key={userId}
              userId={userId}
              roomId={room.id}
              role={getRole(userId, room, roomState)}
            />
          );
        })}
      </div>
      <Modal.Modal active={activeAdd} onOutsideClick={closeAdd}>
        <Modal.Header>
          <Modal.Title>{t("room.settings.member.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <p className="mb-2">{t("room.settings.member.helpText")}</p>
          <form onSubmit={handleAdd} className="flex">
            <input
              name="uname"
              className="input flex-1 mr-1"
              aria-label={t("room.settings.member.helpText")}
            />
            <button type="submit" className="button" disabled={fetching}>
              {t("room.settings.member.searchText")}
            </button>
          </form>
        </Modal.Content>
      </Modal.Modal>
    </>
  );
};

export default RoomSettingsMember;
