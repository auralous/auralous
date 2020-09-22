import React, { useRef, useCallback } from "react";
import { useCurrentUser } from "~/hooks/user";
import { Modal } from "~/components/Modal/index";
import { useLogin } from "~/components/Auth/index";
import { useCreateRoomMutation } from "~/graphql/gql.gen";
import { useRouter } from "next/router";

const CreateRoomContent: React.FC<{ close: () => void }> = ({ close }) => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [{ fetching }, createRoom] = useCreateRoomMutation();

  const handleRoomCreation = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (fetching) return;
      event.preventDefault();
      const result = await createRoom({
        title: (titleRef.current as HTMLInputElement).value,
        description: (descriptionRef.current as HTMLTextAreaElement).value,
      });
      if (result.data?.createRoom) {
        router.push("/room/[roomId]", `/room/${result.data.createRoom.id}`);
        close();
      }
    },
    [close, createRoom, router, fetching]
  );

  return (
    <form onSubmit={handleRoomCreation} autoComplete="off">
      <Modal.Content>
        <div className="mb-4">
          <label className="label" htmlFor="stationTitle">
            Title
          </label>
          <input
            id="stationTitle"
            aria-label="Enter a title for the station"
            required
            className="input w-full"
            type="text"
            ref={titleRef}
            disabled={fetching}
          />
        </div>
        <div className="mb-4">
          <label className="label" htmlFor="stationDesc">
            Description
          </label>
          <textarea
            id="stationDesc"
            aria-label="Enter a description for the station"
            className="input w-full"
            ref={descriptionRef}
            disabled={fetching}
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <button className="button" type="submit" disabled={fetching}>
          Create Room
        </button>
      </Modal.Footer>
    </form>
  );
};

const CreateRoomModal: React.FC<{ active: boolean; close: () => void }> = ({
  active,
  close,
}) => {
  const user = useCurrentUser();
  const [, openLogin] = useLogin();
  return (
    <Modal.Modal active={active} onOutsideClick={close}>
      <Modal.Header>
        <Modal.Title>Room Creation</Modal.Title>
      </Modal.Header>
      {user ? (
        <CreateRoomContent close={close} />
      ) : (
        <>
          <Modal.Content className="text-center">
            <p className="font-bold mb-2">Sign in to create your rooms</p>
            <button onClick={openLogin} className="button button-foreground">
              Sign in
            </button>
          </Modal.Content>
        </>
      )}
    </Modal.Modal>
  );
};

export default CreateRoomModal;
