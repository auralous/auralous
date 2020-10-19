import React, { useRef, useEffect, useState } from "react";
import { useToasts } from "~/components/Toast";
import { Room, useUpdateRoomMutation, RoomState } from "~/graphql/gql.gen";

const RoomSettingsRules: React.FC<{
  room: Room;
  roomState: RoomState;
}> = ({ room, roomState }) => {
  const anyoneCanAddRef = useRef<HTMLSelectElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!roomState) return;
    if (anyoneCanAddRef.current)
      anyoneCanAddRef.current.value = roomState.anyoneCanAdd ? "1" : "0";
  }, [roomState]);

  const [{ fetching }, updateRoom] = useUpdateRoomMutation();
  const [isChanged, setIsChanged] = useState(false);

  const toasts = useToasts();

  const handleSaveRules = async () => {
    const update = {
      id: room.id,
      anyoneCanAdd: room.isPublic
        ? anyoneCanAddRef.current?.value === "1"
        : undefined,
      password: !room.isPublic ? passwordRef.current?.value : undefined,
    };
    const result = await updateRoom(update);
    if (!result.error) {
      setIsChanged(false);
      toasts.success("Room updated");
    }
  };

  return (
    <>
      {room.isPublic ? (
        <>
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
        </>
      ) : (
        <>
          <div className="mb-4">
            <h5 className="text-lg font-bold">New Password</h5>
            <p className="text-foreground-secondary mb-1">
              Set a new password to join. Anyone with a password will also
              become a <b>collaborator</b>.
            </p>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              className="input"
              maxLength={16}
              onChange={() => setIsChanged(true)}
            />
            <p className="text-foreground-tertiary text-xs mt-1">
              Current members are not required to enter new password
            </p>
          </div>
        </>
      )}
      <button
        className="button  mb-6"
        onClick={handleSaveRules}
        disabled={!isChanged || fetching}
      >
        {isChanged ? "Save" : "Saved"}
      </button>
    </>
  );
};

export default RoomSettingsRules;
