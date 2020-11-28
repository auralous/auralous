import React, { useRef, useCallback } from "react";
import { useToasts } from "~/components/Toast";
import { AuthBanner } from "~/components/Auth/index";
import { useCurrentUser } from "~/hooks/user";
import { Room, useJoinPrivateRoomMutation, RoomState } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgLock } from "~/assets/svg";

const RoomPrivate: React.FC<{
  room: Room;
  roomState: RoomState;
  reloadFn: () => void;
}> = ({ room, reloadFn }) => {
  const { t } = useI18n();
  const toasts = useToasts();
  const passwordRef = useRef<HTMLInputElement>(null);

  const user = useCurrentUser();
  const [{ fetching }, joinPrivateRoom] = useJoinPrivateRoomMutation();

  const handleJoinPrivateRoom = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!passwordRef.current || fetching) return;
      const result = await joinPrivateRoom({
        id: room.id,
        password: passwordRef.current.value,
      }).then((response) => response.data?.joinPrivateRoom);
      result ? reloadFn() : toasts.error(t("room.main.private.badPassword"));
    },
    [t, toasts, room, joinPrivateRoom, fetching, reloadFn]
  );

  return (
    <div className="w-full h-full flex flex-col flex-center p-4">
      {user ? (
        <>
          <div className="mb-8 p-6 rounded-full bg-background-secondary">
            <SvgLock className="w-16 h-16" />
          </div>
          <p>{t("room.main.private.password1")}</p>
          <form className="flex my-2" onSubmit={handleJoinPrivateRoom}>
            <input
              type="password"
              autoComplete="current-password"
              aria-label="Password"
              ref={passwordRef}
              className="input w-full mr-1"
            />
            <button type="submit" className="btn" disabled={fetching}>
              {t("room.main.private.join")}
            </button>
          </form>
          <p className="text-foreground-secondary text-xs mt-2">
            {t("room.main.private.password2")}
          </p>
        </>
      ) : (
        <AuthBanner prompt={t("room.main.private.prompt")} />
      )}
    </div>
  );
};

export default RoomPrivate;
