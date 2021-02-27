import { useLogin } from "components/Auth/index";
import { Input } from "components/Form";
import { Modal, useModal } from "components/Modal/index";
import { PageHeader } from "components/Page";
import { Button } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import {
  PlatformName,
  useDeleteMeMutation,
  User,
  useUpdateMeMutation,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import { Locale } from "i18n/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CONFIG,
  LANGUAGES,
  PLATFORM_FULLNAMES,
  SvgByPlatformName,
} from "utils/constants";
import { toast } from "utils/toast";

const SettingTitle: React.FC = ({ children }) => (
  <Typography.Title size="lg" level={3}>
    {children}
  </Typography.Title>
);

const DeleteAccount: React.FC<{ user: User }> = ({ user }) => {
  const [{ fetching }, deleteUser] = useDeleteMeMutation();
  const [confirmUsername, setConfirmUsername] = useState("");
  const [activeDelete, openDelete, close] = useModal();
  const { t } = useI18n();

  function closeDelete() {
    setConfirmUsername("");
    close();
  }

  function onDelete() {
    deleteUser().then((result) => {
      result.data?.deleteMe &&
        toast.success(t("settings.dangerZone.delete.success"));
    });
  }

  return (
    <>
      <Modal.Modal
        title={t("settings.dangerZone.delete.label")}
        active={activeDelete}
        close={closeDelete}
      >
        <Modal.Header>
          <Modal.Title>
            {t("settings.dangerZone.delete.modal.title")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <Typography.Paragraph align="center">
            {t("settings.dangerZone.delete.modal.description")}
          </Typography.Paragraph>
          <Typography.Paragraph align="center" strong>
            {t("common.dangerousActionText")}
          </Typography.Paragraph>
          <Box row justifyContent="center">
            <Input
              accessibilityLabel={t(
                "settings.dangerZone.delete.modal.enterName"
              )}
              value={confirmUsername}
              placeholder={t("settings.dangerZone.delete.modal.enterName")}
              onChangeText={setConfirmUsername}
              fullWidth
            />
          </Box>
        </Modal.Content>
        <Modal.Footer>
          <Button
            color="danger"
            onPress={onDelete}
            disabled={confirmUsername !== user.username || fetching}
            title={t("settings.dangerZone.delete.confirm")}
          />
          <Button
            onPress={closeDelete}
            disabled={fetching}
            title={t("common.cancel")}
          />
        </Modal.Footer>
      </Modal.Modal>
      <SettingTitle>{t("settings.dangerZone.title")}</SettingTitle>
      <Typography.Paragraph size="sm" color="foregroundSecondary">
        {t("settings.dangerZone.delete.description")}{" "}
        <Typography.Link
          target="_blank"
          href="/privacy#when-you-delete-data-in-your-accounts"
          emphasis
        >
          {t("settings.dangerZone.delete.descriptionData")}
        </Typography.Link>
      </Typography.Paragraph>
      <Button
        color="danger"
        onPress={openDelete}
        title={t("settings.dangerZone.delete.confirm")}
      />
    </>
  );
};

const LanguageSelect: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const LanguageChoices = useMemo(
    () =>
      Object.entries(LANGUAGES).map(([value, name]) => (
        <option key={value} value={value}>
          {name}
        </option>
      )),
    []
  );

  return (
    <Box>
      <Spacer size={8} axis="vertical" />
      <SettingTitle>{t("settings.language.title")}</SettingTitle>
      <select
        aria-label={t("settings.language.title")}
        value={locale}
        onChange={(e) => setLocale(e.currentTarget.value as Locale)}
        onBlur={undefined}
        className="input"
      >
        {LanguageChoices}
      </select>
    </Box>
  );
};

const LeftSection: React.FC = () => {
  const { t } = useI18n();

  const me = useMe();

  const [, updateUser] = useUpdateMeMutation();

  const formRef = useRef<HTMLFormElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const profilePictureRef = useRef<HTMLInputElement>(null);

  const [, logIn] = useLogin();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUser({
      username: (usernameRef.current as HTMLInputElement).value,
      profilePicture: (profilePictureRef.current as HTMLInputElement)
        .files?.[0],
    }).then(() => toast.success(t("settings.updated")));
  }

  useEffect(() => {
    if (me) {
      (formRef.current as HTMLFormElement).reset();
      (usernameRef.current as HTMLInputElement).value = me.user.username;
    }
  }, [me]);

  const signOut = useCallback(async () => {
    await fetch(`${process.env.API_URI}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.resetUrqlClient();
    toast.success(t("settings.signedOut"));
  }, [t]);

  return (
    <>
      <SettingTitle>{t("settings.profile.title")}</SettingTitle>
      {me ? (
        <>
          <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
            <Box>
              <Spacer size={4} axis="vertical" />
              <label className="label" htmlFor="usernameInput">
                {t("settings.username.label")}
              </label>
              <Input
                id="usernameInput"
                fullWidth
                ref={usernameRef}
                maxLength={CONFIG.usernameMaxLength}
                required
              />
              <Spacer size={1} axis="vertical" />
              <Typography.Paragraph size="xs" color="foregroundSecondary">
                {t("settings.username.helpText", {
                  maxLength: CONFIG.usernameMaxLength,
                })}
              </Typography.Paragraph>
            </Box>
            <Box>
              <Spacer size={4} axis="vertical" />
              <label className="label" htmlFor="profilePictureInput">
                {t("settings.profilePicture.label")}
              </label>
              <Box row>
                <img
                  alt={me.user.username}
                  src={me.user.profilePicture}
                  className="w-16 h-16 bg-background-secondary rounded-full object-cover"
                />
                <Spacer size={2} axis="horizontal" />
                <input
                  id="profilePictureInput"
                  type="file"
                  accept="image/*"
                  ref={profilePictureRef}
                  className="input w-0 flex-1"
                />
              </Box>
            </Box>
            <Spacer size={4} axis="vertical" />
            <Button
              color="primary"
              type="submit"
              fullWidth
              title={t("common.save")}
            />
          </form>
          <Spacer size={8} axis="vertical" />
          <div className="border-t-2 py-4 border-background-secondary">
            <Button fullWidth onPress={signOut} title={t("settings.signOut")} />
          </div>
        </>
      ) : (
        <>
          <Typography.Paragraph color="foregroundTertiary">
            {t("settings.profile.authPrompt")}
          </Typography.Paragraph>
          <Button onPress={logIn} title={t("common.signIn")} />
        </>
      )}
    </>
  );
};

const MusicConnection: React.FC = () => {
  const { t } = useI18n();
  // Account
  const me = useMe();

  const platform = me?.platform || PlatformName.Youtube;
  const name = platform ? PLATFORM_FULLNAMES[platform] : null;
  const PlatformSvg = platform ? SvgByPlatformName[platform] : null;

  return (
    <>
      <SettingTitle>{t("settings.connection.title")}</SettingTitle>
      <div
        className={`bg-${platform} text-${platform}-label p-4 rounded-lg flex items-center`}
      >
        {PlatformSvg && (
          <PlatformSvg width="40" height="40" className="fill-current" />
        )}
        <Spacer size={4} axis="horizontal" />
        <Box>
          <Typography.Text>
            {t("settings.listening.title", { name })}
          </Typography.Text>
          <Typography.Paragraph noMargin size="sm">
            {me ? (
              <Typography.Text color="foregroundSecondary">
                {t("settings.listening.connectedTo", { name })},{" "}
                <Typography.Link target="_blank" href="/contact" strong>
                  {t("settings.listening.contactUs")}
                </Typography.Link>
              </Typography.Text>
            ) : (
              <>
                <Typography.Text color="foregroundSecondary">
                  {t("player.signInSuggest")}
                </Typography.Text>
              </>
            )}
          </Typography.Paragraph>
        </Box>
      </div>
    </>
  );
};

const RightSection: React.FC = () => {
  const me = useMe();
  return (
    <>
      <Box>
        <MusicConnection />
        <LanguageSelect />
        {me && (
          <>
            <Spacer size={8} axis="vertical" />
            <DeleteAccount user={me.user} />
          </>
        )}
      </Box>
    </>
  );
};

const SettingsContainer: React.FC = () => {
  const { t } = useI18n();
  return (
    <>
      <PageHeader name={t("settings.title")} />
      <Box>
        <Box padding="md">
          <LeftSection />
        </Box>
        <Box padding="md">
          <RightSection />
        </Box>
      </Box>
      <Spacer axis="vertical" size={12} />
    </>
  );
};

export default SettingsContainer;
