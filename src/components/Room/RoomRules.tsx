import React from "react";
import { Modal } from "~/components/Modal/index";
import { RoomState } from "~/graphql/gql.gen";

const RoomRules: React.FC<{
  active: boolean;
  close: () => void;
  roomState: RoomState;
}> = ({ roomState, active, close }) => {
  return (
    <Modal.Modal active={active} onOutsideClick={close}>
      <Modal.Header>
        <Modal.Title>Room Rules</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <ul className="py-4 text-xl mb-4">
          <li className="px-4 py-2 mb-2 rounded-lg">
            {roomState?.anyoneCanAdd ? (
              "Anyone can add songs"
            ) : (
              <span>
                <b className="text-success-light">Only member</b> can add songs
              </span>
            )}
          </li>
        </ul>
      </Modal.Content>
      <Modal.Footer>
        <button onClick={close} className="button">
          Got it!
        </button>
      </Modal.Footer>
    </Modal.Modal>
  );
};

export default RoomRules;
