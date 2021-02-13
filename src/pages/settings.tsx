import { useLogin } from "components/Auth/index";
import { Modal, useModal } from "components/Modal/index";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import {
  PlatformName,
  useDeleteMeMutation,
  User,
  useUpdateMeMutation,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import { Locale } from "i18n/types";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
            <br />
            <Typography.Text strong>
              {t("common.dangerousActionText")}
            </Typography.Text>
            .
          </Typography.Paragraph>
          <div className="text-center">
            <input
              aria-label={t("settings.dangerZone.delete.modal.enterName")}
              value={confirmUsername}
              placeholder={t("settings.dangerZone.delete.modal.enterName")}
              onChange={(e) => setConfirmUsername(e.target.value)}
              className="input py-2 px-4 ml-2 w-96 max-w-full"
            />
          </div>
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
      <Typography.Paragraph size="sm" color="foreground-secondary">
        {t("settings.dangerZone.delete.description")}{" "}
        <a
          className="underline"
          target="_blank"
          href="/privacy#when-you-delete-data-in-your-accounts"
        >
          {t("settings.dangerZone.delete.descriptionData")}
        </a>
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
    <div className="mt-8">
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
    </div>
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
            <div className="mt-4">
              <label className="label" htmlFor="usernameInput">
                {t("settings.username.label")}
              </label>
              <input
                id="usernameInput"
                className="input w-full"
                ref={usernameRef}
                maxLength={CONFIG.usernameMaxLength}
                required
              />
              <div className="mt-1" />
              <Typography.Paragraph size="xs" color="foreground-secondary">
                {t("settings.username.helpText", {
                  maxLength: CONFIG.usernameMaxLength,
                })}
              </Typography.Paragraph>
            </div>
            <div className="mt-4 mb-2">
              <label className="label" htmlFor="profilePictureInput">
                {t("settings.profilePicture.label")}
              </label>
              <div className="flex">
                <img
                  alt={me.user.username}
                  src={me.user.profilePicture}
                  className="w-16 h-16 bg-background-secondary rounded-full object-cover"
                />
                <input
                  id="profilePictureInput"
                  type="file"
                  accept="image/*"
                  ref={profilePictureRef}
                  className="input w-full ml-4"
                />
              </div>
            </div>
            <Button
              color="primary"
              type="submit"
              fullWidth
              title={t("common.save")}
            />
          </form>
          <div className="mt-8 border-t-2 py-4 border-background-secondary">
            <Button fullWidth onPress={signOut} title={t("settings.signOut")} />
          </div>
        </>
      ) : (
        <>
          <Typography.Paragraph color="foreground-tertiary">
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
        <div className="ml-4">
          <div className="mb-1">{t("settings.listening.title", { name })}</div>
          <Typography.Paragraph paragraph={false} size="sm">
            {me ? (
              <Typography.Text color="foreground-secondary">
                {t("settings.listening.connectedTo", { name })},{" "}
                <a target="_blank" href="/support" className="font-bold">
                  {t("settings.listening.contactUs")}
                </a>
              </Typography.Text>
            ) : (
              <>
                <Typography.Text color="foreground-secondary">
                  {t("player.signInSuggest")}
                </Typography.Text>
              </>
            )}
          </Typography.Paragraph>
        </div>
      </div>
    </>
  );
};

const RightSection: React.FC = () => {
  const { t } = useI18n();
  const me = useMe();
  return (
    <>
      <div>
        <MusicConnection />
        <LanguageSelect />
        {me && (
          <div className="mt-8">
            <SettingTitle>{t("settings.dangerZone.title")}</SettingTitle>
            <DeleteAccount user={me.user} />
          </div>
        )}
      </div>
    </>
  );
};

const SettingsPage: NextPage = () => {
  const { t } = useI18n();
  return (
    <>
      <NextSeo
        title={t("settings.title")}
        noindex
        openGraph={{}}
        canonical={`${process.env.APP_URI}/settings`}
      />
      <h1 className="page-title">{t("settings.title")}</h1>
      <div className="flex flex-wrap">
        <div className="w-full lg:flex-1 p-4">
          <LeftSection />
        </div>
        <div className="w-full lg:flex-1 p-4">
          <RightSection />
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
