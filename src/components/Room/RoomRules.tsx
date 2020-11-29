import React from "react";
import { Modal } from "~/components/Modal/index";
import { useI18n } from "~/i18n/index";
import { RoomState } from "~/graphql/gql.gen";

const RoomRules: React.FC<{
  active: boolean;
  close: () => void;
  roomState: RoomState;
}> = ({ roomState, active, close }) => {
  const { t } = useI18n();
  return (
    <Modal.Modal active={active} onOutsideClick={close}>
      <Modal.Header>
        <Modal.Title>{t("room.rules.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <ul className="py-4 text-xl mb-4">
          <li className="px-4 py-2 mb-2 rounded-lg">
            {roomState?.anyoneCanAdd ? (
              t("room.rules.anyoneCanAdd")
            ) : (
              <span>{t("room.rules.onlyMemberCanAdd")}</span>
            )}
          </li>
        </ul>
      </Modal.Content>
      <Modal.Footer>
        <button onClick={close} className="btn">
          {t("room.rules.ok")}
        </button>
      </Modal.Footer>
    </Modal.Modal>
  );
};

export default RoomRules;
