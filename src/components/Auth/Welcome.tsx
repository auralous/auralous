import { Button } from "components/Button";
import { Modal } from "components/Modal";
import { useUpdateMeMutation } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import React, { useCallback, useRef } from "react";
import { CONFIG } from "utils/constants";
import { toast } from "utils/toast";

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
    <Modal.Modal title="Welcome to Stereo" active={active}>
      <form className="py-8 px-16" onSubmit={onSubmit}>
        <div className="mb-4">
          <p id="welcomeUsernameLabel" className="text-center mb-2 font-bold">
            {t("settings.username.label")}
          </p>
          <input
            ref={usernameRef}
            aria-labelledby="welcomeUsernameLabel"
            className="input w-full"
            required
            maxLength={CONFIG.usernameMaxLength}
          />
          <p className="text-xs text-foreground-secondary text-center">
            {t("settings.username.helpText", {
              maxLength: CONFIG.usernameMaxLength,
            })}
          </p>
        </div>
        <Button disabled={fetching} title={t("common.save")} />
      </form>
    </Modal.Modal>
  );
};

export default Welcome;
