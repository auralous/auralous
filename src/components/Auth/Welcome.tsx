import React, { useRef, useCallback } from "react";
import { useUpdateMeMutation } from "~/graphql/gql.gen";
import { toast } from "~/lib/toast";
import { useI18n } from "~/i18n/index";
import { Modal } from "../Modal";

const Welcome: React.FC<{ active: boolean; close: () => void }> = ({
  active,
  close,
}) => {
  const { t } = useI18n();

  const usernameRef = useRef<HTMLInputElement>(null);

  const [{ fetching }, updateUser] = useUpdateMeMutation();

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      if (fetching) return;
      e.preventDefault();
      const { error } = await updateUser({
        username: (usernameRef.current as HTMLInputElement).value,
      });
      if (error?.graphQLErrors) {
        for (const err of error?.graphQLErrors) {
          toast.error(err.message);
        }
        return;
      }
      close();
    },
    [updateUser, close, fetching]
  );

  return (
    <Modal.Modal aria-label="Welcome to Stereo" active={active}>
      <form className="py-8 px-16" onSubmit={onSubmit}>
        <div className="mb-4">
          <p className="text-center mb-2 font-bold">
            {t("settings.username.label")}
          </p>
          <input
            ref={usernameRef}
            aria-label={t("settings.username.label")}
            className="input w-full"
            required
            maxLength={15}
          />
          <p className="text-xs text-foreground-secondary text-center">
            {t("settings.username.helpText")}
          </p>
        </div>
        <button className="btn w-full" disabled={fetching}>
          {t("common.save")}
        </button>
      </form>
    </Modal.Modal>
  );
};

export default Welcome;
