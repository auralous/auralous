import React, { useRef, useEffect, useState } from "react";
import { Room, useUpdateRoomMutation, RoomState } from "~/graphql/gql.gen";

const RoomSettingsRules: React.FC<{
  room: Room;
  roomState: RoomState;
}> = ({ room, roomState }) => {
  const anyoneCanAddRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!roomState) return;
    anyoneCanAddRef.current!.value = roomState.anyoneCanAdd ? "1" : "0";
  }, [roomState]);

  const [{ fetching }, updateRoom] = useUpdateRoomMutation();
  const [isChanged, setIsChanged] = useState(false);

  const handleSaveRules = async () => {
    const update = {
      id: room.id,
      anyoneCanAdd: anyoneCanAddRef.current!.value === "1",
    };
    if (update.anyoneCanAdd === roomState.anyoneCanAdd) {
      return setIsChanged(false);
    }
    const result = await updateRoom(update);
    if (!result.error) setIsChanged(false);
  };

  return (
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
