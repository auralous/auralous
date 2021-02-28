import { Input } from "components/Form";
import { Modal } from "components/Modal";
import { Button } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { useUpdateMeMutation } from "gql/gql.gen";
import { useI18n } from "i18n/index";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { CONFIG } from "utils/constants";

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
    <Modal.Modal title="Welcome to Auralous" active={active}>
      <form className="py-8 px-16" onSubmit={onSubmit}>
        <Typography.Paragraph id="welcomeUsernameLabel" align="center">
          {t("settings.username.label")}
        </Typography.Paragraph>
        <Input
          ref={usernameRef}
          accessibilityLabel={t("settings.username.label")}
          fullWidth
          required
          maxLength={CONFIG.usernameMaxLength}
        />
        <Typography.Paragraph
          color="foreground-secondary"
          size="xs"
          align="center"
        >
          {t("settings.username.helpText", {
            maxLength: CONFIG.usernameMaxLength,
          })}
        </Typography.Paragraph>
        <Spacer size={4} axis="vertical" />
        <Button disabled={fetching} title={t("common.save")} />
      </form>
    </Modal.Modal>
  );
};

export default Welcome;
