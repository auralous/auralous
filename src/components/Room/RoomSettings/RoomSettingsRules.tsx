import React, { useRef, useEffect, useState } from "react";
import { Room, useUpdateRoomMutation, RoomState } from "~/graphql/gql.gen";

const RoomSettingsRules: React.FC<{
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
    </>
  );
};

export default RoomSettingsRules;
