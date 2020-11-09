import React, { useRef, useEffect, useState } from "react";
import { useToasts } from "~/components/Toast";
import { Room, useUpdateRoomMutation, RoomState } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const RoomSettingsRules: React.FC<{
  room: Room;
  roomState: RoomState;
}> = ({ room, roomState }) => {
  const { t } = useI18n();
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
            <select
              ref={anyoneCanAddRef}
              className="input"
              onChange={() => setIsChanged(true)}
              onBlur={undefined}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
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
        className="button  mb-6"
        onClick={handleSaveRules}
        disabled={!isChanged || fetching}
      >
        {isChanged ? t("room.settings.saveText") : t("room.settings.savedText")}
      </button>
    </>
  );
};

export default RoomSettingsRules;
