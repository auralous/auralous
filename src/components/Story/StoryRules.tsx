import React from "react";
import { Modal } from "~/components/Modal/index";
import { useI18n } from "~/i18n/index";
import { StoryState } from "~/graphql/gql.gen";

const StoryRules: React.FC<{
  active: boolean;
  close: () => void;
  storyState: StoryState;
}> = ({ storyState, active, close }) => {
  const { t } = useI18n();
  return (
    <Modal.Modal active={active} onOutsideClick={close}>
      <Modal.Header>
        <Modal.Title>{t("story.rules.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <ul className="py-4 text-xl mb-4">
          <li className="px-4 py-2 mb-2 rounded-lg">
            {storyState?.anyoneCanAdd ? (
              t("story.rules.anyoneCanAdd")
            ) : (
              <span>{t("story.rules.onlyMemberCanAdd")}</span>
            )}
          </li>
        </ul>
      </Modal.Content>
      <Modal.Footer>
        <button onClick={close} className="btn">
          {t("story.rules.ok")}
        </button>
      </Modal.Footer>
    </Modal.Modal>
  );
};

export default StoryRules;
