import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  QueueAction,
  Track,
  useCreateRoomMutation,
  useUpdateQueueMutation,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const CreateRoomLabel: React.FC<{ htmlFor: string }> = ({
  htmlFor,
  children,
}) => (
  <label className="label text-center" htmlFor={htmlFor}>
    {children}
  </label>
);

const CreateRoomFormGroup: React.FC = ({ children }) => (
  <div className="w-full flex flex-col mb-4 items-center">{children}</div>
);

const CreateRoom: React.FC<{ initTracks: Track[] }> = ({ initTracks }) => {
  const { t } = useI18n();

  const router = useRouter();

  const titleRef = useRef<HTMLInputElement>(null);
  const [isPublic, setIsPublic] = useState(true);
  const passwordRef = useRef<HTMLInputElement>(null);
  const anyoneCanAddRef = useRef<HTMLSelectElement>(null);

  const [{ fetching }, createRoom] = useCreateRoomMutation();
  const [, updateQueue] = useUpdateQueueMutation();

  const handleRoomCreation = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (fetching) return;
      event.preventDefault();

      if (!isPublic && !passwordRef.current?.value) {
        if (!window.confirm(t("new.addNew.warnNoPass"))) return;
      }

      const result = await createRoom({
        title: (titleRef.current as HTMLInputElement).value,
        isPublic,
        anyoneCanAdd: isPublic ? anyoneCanAddRef.current?.value === "1" : false,
        password: passwordRef.current?.value ?? (isPublic ? undefined : ""),
      });

      if (result.data?.createRoom) {
        if (initTracks?.length)
          await updateQueue({
            id: `room:${result.data.createRoom.id}`,
            action: QueueAction.Add,
            tracks: initTracks.map((initTrack) => initTrack.id),
          });

        router.push("/room/[roomId]", `/room/${result.data.createRoom.id}`);
      }
    },
    [t, initTracks, router, fetching, isPublic, createRoom, updateQueue]
  );

  useEffect(() => {
    // Default
    if (anyoneCanAddRef.current) anyoneCanAddRef.current.value = "0";
  }, [anyoneCanAddRef]);

  return (
    <form
      onSubmit={handleRoomCreation}
      autoComplete="off"
      className="flex flex-col flex-center"
    >
      <CreateRoomFormGroup>
        <CreateRoomLabel htmlFor="roomTitle">
          {t("new.addNew.promptTitle")}
        </CreateRoomLabel>
        <input
          id="roomTitle"
          aria-label={t("room.settings.info.titleHelp")}
          placeholder={t("room.settings.info.titleHelp")}
          required
          className="input w-full text-center"
          type="text"
          ref={titleRef}
          disabled={fetching}
        />
      </CreateRoomFormGroup>
      <CreateRoomFormGroup>
        <CreateRoomLabel htmlFor="roomPrivacy">
          {t("new.addNew.promptPrivacy")}
        </CreateRoomLabel>
        <div className="input inline-flex mx-auto">
          <div className="flex items-center mr-4">
            <input
              id="roomPrivacyPublic"
              name="roomPrivacy"
              type="radio"
              value="public"
              className="input"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.currentTarget.value === "public")}
            />
            <label className="label mb-0 pl-1" htmlFor="roomPrivacyPublic">
              {t("room.privacy.public")}
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="roomPrivacyPrivate"
              name="roomPrivacy"
              type="radio"
              value="private"
              className="input"
              checked={!isPublic}
              onChange={(e) => setIsPublic(e.currentTarget.value === "public")}
            />
            <label className="label mb-0 pl-1" htmlFor="roomPrivacyPrivate">
              {t("room.privacy.private")}
            </label>
          </div>
        </div>
      </CreateRoomFormGroup>
      <div className="py-2 h-28 border-t-2 border-b-2 border-background-secondary">
        <CreateRoomFormGroup>
          {isPublic ? (
            <>
              <CreateRoomLabel htmlFor="roomAnyoneCanAdd">
                {t("room.settings.privacy.publicAllowGuests")}
              </CreateRoomLabel>
              <select
                id="roomAnyoneCanAdd"
                aria-label={t("room.settings.privacy.publicAllowGuests")}
                ref={anyoneCanAddRef}
                className="input mb-1"
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
              <p className="text-xs text-foreground-tertiary px-1">
                {t("room.settings.privacy.publicAllowGuestsHelp")}
              </p>
            </>
          ) : (
            <>
              <CreateRoomLabel htmlFor="password">
                {t("room.settings.privacy.password")}
              </CreateRoomLabel>
              <input
                type="password"
                id="password"
                aria-label={t("room.settings.privacy.password")}
                ref={passwordRef}
                className="input"
                maxLength={16}
              />
              <p className="text-xs text-foreground-tertiary px-1">
                {t("room.settings.privacy.passwordHelp")}
              </p>
            </>
          )}
        </CreateRoomFormGroup>
      </div>
      <button
        className="btn btn-success rounded-full mt-8"
        type="submit"
        disabled={fetching}
      >
        {t("new.addNew.action")}
      </button>
    </form>
  );
};

export default CreateRoom;
