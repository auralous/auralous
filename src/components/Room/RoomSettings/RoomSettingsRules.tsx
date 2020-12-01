import React, { useRef, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { useToasts } from "~/components/Toast";
import { Room, useUpdateRoomMutation, RoomState } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const RoomSettingsRules: React.FC<{
  room: Room;
  roomState: RoomState;
}> = ({ room, roomState }) => {
  const { t } = useI18n();
  const passwordRef = useRef<HTMLInputElement>(null);

  const [anyoneCanAdd, setAnyoneCanAdd] = useState(false);

  useEffect(() => {
    if (!roomState) return;
    setAnyoneCanAdd(roomState.anyoneCanAdd);
  }, [roomState]);

  const [{ fetching }, updateRoom] = useUpdateRoomMutation();
  const [isChanged, setIsChanged] = useState(false);

  const toasts = useToasts();

  const handleSaveRules = async () => {
    if (!room.isPublic && !passwordRef.current?.value) {
      if (!window.confirm(t("new.addNew.warnNoPass"))) return;
    }
    const update = {
      id: room.id,
      anyoneCanAdd: room.isPublic ? anyoneCanAdd : undefined,
      password: !room.isPublic ? passwordRef.current?.value : undefined,
    };
    const result = await updateRoom(update);
    if (!result.error) {
      setIsChanged(false);
      toasts.success(t("room.settings.updatedText"));
    }
  };

  return (
    <>
      {room.isPublic ? (
        <>
          <div className="mb-4">
            <h5 className="text-lg font-bold">
              {t("room.settings.privacy.publicAllowGuests")}
            </h5>
            <p className="text-foreground-secondary mb-1">
              {t("room.settings.privacy.publicAllowGuestsHelp")}
            </p>
            <Switch
              checked={anyoneCanAdd}
              onChange={(value) => {
                setAnyoneCanAdd(value);
                setIsChanged(true);
              }}
              className={`${
                anyoneCanAdd ? "bg-success" : "bg-background-tertiary"
              } relative inline-flex h-6 rounded-full w-12`}
              aria-labelledby="roomAnyoneCanAdd"
            >
              <span
                className={`${
                  anyoneCanAdd ? "translate-x-6" : "translate-x-0"
                } inline-block w-6 h-6 transform bg-white rounded-full transition-transform`}
              />
            </Switch>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <h5 className="text-lg font-bold">
              {t("room.settings.privacy.newPassword")}
            </h5>
            <p className="text-foreground-secondary mb-1">
              {t("room.settings.privacy.passwordHelp")}
            </p>
            <input
              type="password"
              autoComplete="new-password"
              id="password"
              ref={passwordRef}
              className="input"
              maxLength={16}
              onChange={() => setIsChanged(true)}
            />
            <p className="text-foreground-tertiary text-xs mt-1">
              {t("room.settings.privacy.newPasswordHelp")}
            </p>
          </div>
        </>
      )}
      <button
        className="btn  mb-6"
        onClick={handleSaveRules}
        disabled={!isChanged || fetching}
      >
        {isChanged ? t("common.save") : t("common.saved")}
      </button>
    </>
  );
};

export default RoomSettingsRules;
