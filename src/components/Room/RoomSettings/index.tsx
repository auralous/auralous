import React, { useState } from "react";
import { Modal } from "~/components/Modal/index";
import RoomSettingsBasic from "./RoomSettingsBasic";
import RoomSettingsQueue from "./RoomSettingsQueue";
import { Room, RoomState } from "~/graphql/gql.gen";

const RoomSettingsModal: React.FC<{
  room: Room;
  roomState: RoomState;
  active: boolean;
  close: () => void;
}> = ({ room, roomState, active, close }) => {
  const [tab, setTab] = useState<"basic" | "queue">("basic");
  if (!roomState) return null;
  return (
    <Modal.Modal active={active} onOutsideClick={close}>
      <Modal.Header>
        <div className="flex-none flex" role="tablist">
          <button
            role="tab"
            className={`font-bold text-4xl leading-tight ${
              tab === "basic" ? "opacity-100" : "opacity-25"
            } transition-opacity duration-200 mr-3`}
            onClick={() => setTab("basic")}
            aria-selected={tab === "basic"}
            aria-controls="tabpanel_basic"
          >
            Info
          </button>
          <button
            role="tab"
            className={`font-bold text-4xl leading-tight ${
              tab === "queue" ? "opacity-100" : "opacity-25"
            } transition-opacity duration-200`}
            onClick={() => setTab("queue")}
            aria-selected={tab === "queue"}
            aria-controls="tabpanel_queue"
          >
            Rule
          </button>
        </div>
      </Modal.Header>
      <Modal.Content>
        <div
          aria-labelledby="tabpanel_basic"
          role="tabpanel"
          aria-hidden={tab !== "basic"}
          hidden={tab !== "basic"}
        >
          <RoomSettingsBasic room={room} />
        </div>
        <div
          aria-labelledby="tabpanel_queue"
          role="tabpanel"
          aria-hidden={tab !== "queue"}
          hidden={tab !== "queue"}
        >
          <RoomSettingsQueue room={room} roomState={roomState} />
        </div>
      </Modal.Content>
    </Modal.Modal>
  );
};

export default RoomSettingsModal;
