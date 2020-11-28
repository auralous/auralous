import React, { useRef, useCallback } from "react";
import Dialog from "@reach/dialog";
import { useUpdateMeMutation } from "~/graphql/gql.gen";
import { useToasts } from "~/components/Toast";
import { useI18n } from "~/i18n/index";

const Welcome: React.FC<{ active: boolean; close: () => void }> = ({
  active,
  close,
}) => {
  const { t } = useI18n();

  const usernameRef = useRef<HTMLInputElement>(null);

  const [{ fetching }, updateUser] = useUpdateMeMutation();
  const toasts = useToasts();

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      if (fetching) return;
      e.preventDefault();
      const { error } = await updateUser({
        username: (usernameRef.current as HTMLInputElement).value,
      });
      if (error?.graphQLErrors) {
        for (const err of error?.graphQLErrors) {
          toasts.error(err.message);
        }
        return;
      }
      close();
    },
    [updateUser, toasts, close, fetching]
  );

  return (
    <Dialog
      aria-label="Welcome to Stereo"
      isOpen={active}
      className="py-8 px-16"
    >
      <form className="h-full overflow-y-scroll" onSubmit={onSubmit}>
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
    </Dialog>
  );
};

export default Welcome;
