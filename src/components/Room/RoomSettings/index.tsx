import React, { useState } from "react";
import { Modal } from "~/components/Modal/index";
import RoomSettingsBasic from "./RoomSettingsBasic";
import RoomSettingsRules from "./RoomSettingsRules";
import RoomSettingsMember from "./RoomSettingsMember";
import { Room, RoomState } from "~/graphql/gql.gen";

const RoomSettingsModal: React.FC<{
  room: Room;
  roomState: RoomState;
  active: boolean;
  close: () => void;
}> = ({ room, roomState, active, close }) => {
  const [tab, setTab] = useState<"basic" | "rules" | "member">("basic");
  if (!roomState) return null;
  return (
    <Modal.Modal active={active} onOutsideClick={close}>
      <Modal.Header>
        <div
          className="flex-none flex items-center font-bold text-4xl leading-tight"
          role="tablist"
        >
          <button
            role="tab"
            className={`font-bold ${
              tab === "basic" ? "opacity-100" : "opacity-25"
            } transition-opacity duration-200`}
            onClick={() => setTab("basic")}
            aria-selected={tab === "basic"}
            aria-controls="tabpanel_basic"
          >
            Info
          </button>
          <span className="font-bold opacity-25 mx-2 text-lg">{" • "}</span>
          <button
            role="tab"
            className={`font-bold ${
              tab === "rules" ? "opacity-100" : "opacity-25"
            } transition-opacity duration-200`}
            onClick={() => setTab("rules")}
            aria-selected={tab === "rules"}
            aria-controls="tabpanel_rules"
          >
            Rule
          </button>
          <span className="font-bold opacity-25 mx-2 text-lg">{" • "}</span>
          <button
            role="tab"
            className={`font-bold ${
              tab === "member" ? "opacity-100" : "opacity-25"
            } transition-opacity duration-200`}
            onClick={() => setTab("member")}
            aria-selected={tab === "member"}
            aria-controls="tabpanel_member"
          >
            Member
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
          aria-labelledby="tabpanel_rules"
          role="tabpanel"
          aria-hidden={tab !== "rules"}
          hidden={tab !== "rules"}
        >
          <RoomSettingsRules room={room} roomState={roomState} />
        </div>
        <div
          aria-labelledby="tabpanel_member"
          role="tabpanel"
          aria-hidden={tab !== "member"}
          hidden={tab !== "member"}
        >
          <RoomSettingsMember room={room} roomState={roomState} />
        </div>
      </Modal.Content>
    </Modal.Modal>
  );
};

export default RoomSettingsModal;
