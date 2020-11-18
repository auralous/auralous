import React, { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useToasts } from "~/components/Toast";
import { useModal, Modal } from "~/components/Modal";
import {
  Room,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgEdit2 } from "~/assets/svg";

const ImageEditSection: React.FC<{
  room: Room;
  imageRef: React.RefObject<HTMLImageElement>;
  imageInputRef: React.RefObject<HTMLInputElement>;
}> = ({ room, imageRef, imageInputRef }) => {
  function handleImageInputChange() {
    const file = (imageInputRef.current as HTMLInputElement).files?.[0];
    if (file)
      (imageRef.current as HTMLImageElement).src = URL.createObjectURL(file);
  }

  return (
    <div className="relative mx-auto w-32 h-32 mb-2 rounded-full overflow-hidden flex flex-center">
      <input
        id="roomImg"
        className="absolute w-full h-full inset-0 cursor-pointer"
        type="file"
        accept="image/*"
        aria-label="Upload an image"
        ref={imageInputRef}
        onChange={handleImageInputChange}
      />
      <img
        ref={imageRef}
        alt={room.title}
        className="pointer-events-none absolute inset-0 w-full h-full object-cover bg-background-secondary"
        src={room.image}
      />
      <div
        className="pointer-events-none absolute inset-0 w-full h-full flex flex-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        <SvgEdit2 fill="white" stroke="transparent" />
      </div>
    </div>
  );
};

const InfoEditSection: React.FC<{
  room: Room;
  titleRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
}> = ({ room, titleRef, descriptionRef }) => {
  const { t } = useI18n();
  return (
    <>
      <div className="mb-4">
        <label className="label" htmlFor="roomTitle">
          {t("room.settings.info.title")}
        </label>
        <input
          id="roomTitle"
          className="input w-full"
          type="text"
          ref={titleRef}
          required
        />
      </div>
      <div className="mb-4 hidden">
        <label className="label" htmlFor="roomDesc">
          {t("room.settings.info.description")}
        </label>
        <textarea id="roomDesc" className="input w-full" ref={descriptionRef} />
      </div>
      {/* TODO: Not yet implemented */}
      <div className="mb-4">
        <label className="label" htmlFor="roomHandle">
          {t("room.settings.info.handle")}
        </label>
        <input
          id="roomHandle"
          disabled
          className="input w-full"
          type="text"
          value={room.id}
          required
        />
      </div>
    </>
  );
};

const RoomDetails: React.FC<{ room: Room }> = ({ room }) => {
  const { t } = useI18n();
  const [, updateRoom] = useUpdateRoomMutation();
  const toasts = useToasts();
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    (formRef.current as HTMLFormElement).reset();
    (titleRef.current as HTMLInputElement).value = room.title;
    (descriptionRef.current as HTMLTextAreaElement).value =
      room.description || "";
    (imageRef.current as HTMLImageElement).src = room.image;
  }, [room]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const image = (imageInputRef.current as HTMLInputElement).files?.[0];
      const title =
        titleRef.current?.value !== room.title && titleRef.current?.value;
      const description =
        descriptionRef.current?.value !== room.description &&
        descriptionRef.current?.value;
      if (image || title || description) {
        await updateRoom({
          id: room.id,
          ...(title && { title }),
          ...(description !== false && { description }),
          ...(image && { image }),
        });
        toasts.success(t("room.settings.updatedText"));
      }
    },
    [t, imageInputRef, titleRef, descriptionRef, room, toasts, updateRoom]
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
      <div className="flex flex-wrap flex-center">
        <div className="flex-none w-full md:w-auto md:mr-4">
          <ImageEditSection
            room={room}
            imageInputRef={imageInputRef}
            imageRef={imageRef}
          />
        </div>
        <div className="flex-1 pt-4">
          <InfoEditSection
            room={room}
            titleRef={titleRef}
            descriptionRef={descriptionRef}
          />
        </div>
      </div>
      <button type="submit" className="button button-success w-full mt-2">
        {t("common.save")}
      </button>
    </form>
  );
};

const RoomPublish: React.FC<{ room: Room }> = ({ room }) => {
  const { t } = useI18n();
  const router = useRouter();
  const toasts = useToasts();
  const [{ fetching }, deleteRoom] = useDeleteRoomMutation();
  const [activeDelete, openDelete, closeDelete] = useModal();
  const [confirmDelete, setConfirmDelete] = useState("");
  return (
    <>
      <h3 className="text-lg font-bold">
        {t("room.settings.dangerZone.title")}
      </h3>
      <button
        type="button"
        className="button button-danger mt-4"
        onClick={openDelete}
      >
        {t("room.settings.dangerZone.delete.title", {
          title: t("room.label"),
        })}
      </button>
      <Modal.Modal
        title={t("room.settings.dangerZone.delete.title", {
          title: t("room.label"),
        })}
        active={activeDelete}
        onOutsideClick={closeDelete}
      >
        <Modal.Header>
          <Modal.Title>
            {t("room.settings.dangerZone.delete.title", {
              title: room.title,
            })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Content className="text-center">
          <p className="mb-2">
            {t("room.settings.dangerZone.delete.description")}
            <br />
            <b>{t("common.dangerousActionText")}</b>.
          </p>
          <input
            aria-label={t("room.settings.dangerZone.delete.enterName")}
            value={confirmDelete}
            placeholder={t("room.settings.dangerZone.delete.enterName")}
            onChange={(e) => setConfirmDelete(e.target.value)}
            className="input w-96 max-w-full"
          />
        </Modal.Content>
        <Modal.Footer>
          <button
            type="button"
            className="button button-transparent text-danger-light"
            onClick={() =>
              deleteRoom({ id: room.id }).then(() => {
                toasts.success(t("room.settings.dangerZone.delete.deleted"));
                router.replace("/browse");
              })
            }
            disabled={confirmDelete !== room.title || fetching}
          >
            {t("room.settings.dangerZone.delete.action")}
          </button>
          <button
            type="button"
            onClick={closeDelete}
            className="button button-success"
          >
            {t("room.settings.dangerZone.delete.cancel")}
          </button>
        </Modal.Footer>
      </Modal.Modal>
    </>
  );
};

const RoomSettingsBasic: React.FC<{ room: Room }> = ({ room }) => {
  return (
    <div>
      <div className="mb-4 rounded-t-lg overflow-hidden">
        <RoomDetails room={room} />
      </div>
      <div>
        <RoomPublish room={room} />
      </div>
    </div>
  );
};

export default RoomSettingsBasic;
