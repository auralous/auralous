import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { NextSeo } from "next-seo";
import { NextPage } from "next";
import Link from "next/link";
import { useToasts } from "~/components/Toast/index";
import { Modal, useModal } from "~/components/Modal/index";
import { useLogin } from "~/components/Auth/index";
import { useCurrentUser, useMAuth } from "~/hooks/user";
import {
  useUpdateMeMutation,
  useDeleteMeMutation,
  User,
  PlatformName,
} from "~/graphql/gql.gen";
import { usePlayer } from "~/components/Player";
import { useI18n } from "~/i18n/index";
import { PLATFORM_FULLNAMES, SvgByPlatformName } from "~/lib/constants";

const SettingTitle: React.FC = ({ children }) => (
  <h3 className="text-lg font-bold mb-1">{children}</h3>
);

const DeleteAccount: React.FC<{ user: User }> = ({ user }) => {
  const toasts = useToasts();
  const [, deleteUser] = useDeleteMeMutation();
  const [confirmUsername, setConfirmUsername] = useState("");
  const [activeDelete, openDelete, close] = useModal();
  const { t } = useI18n();
  function closeDelete() {
    setConfirmUsername("");
    close();
  }
  return (
    <>
      <Modal.Modal
        title={t("settings.deleteAccount.titleA11y")}
        active={activeDelete}
        onOutsideClick={closeDelete}
      >
        <Modal.Header>
          <Modal.Title>{t("settings.deleteAccount.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Content className="text-center">
          <p className="mb-4">
            {t("settings.deleteAccount.description")}
            <br />
            <b>{t("common.dangerousActionText")}</b>.
          </p>
          <input
            aria-label={t("settings.deleteAccount.enterName")}
            value={confirmUsername}
            placeholder={t("settings.deleteAccount.enterName")}
            onChange={(e) => setConfirmUsername(e.target.value)}
            className="input py-2 px-4 ml-2 w-96 max-w-full"
          />
        </Modal.Content>
        <Modal.Footer>
          <button
            type="button"
            className="button bg-transparent text-danger-light"
            onClick={() =>
              deleteUser().then(() => {
                toasts.message(t("settings.deleteAccount.deletedText"));
              })
            }
            disabled={confirmUsername !== user.username}
          >
            {t("settings.deleteAccount.action")}
          </button>
          <button
            type="button"
            onClick={closeDelete}
            className="button button-success"
          >
            {t("settings.deleteAccount.cancelAction")}
          </button>
        </Modal.Footer>
      </Modal.Modal>
      <p className="text-sm text-foreground-secondary">
        {t("settings.deleteAccount.helpText")}{" "}
        <Link href="/privacy#when-you-delete-data-in-your-accounts">
          <a className="underline">
            {t("settings.deleteAccount.helpTextLinkTitle")}
          </a>
        </Link>
      </p>
      <button
        type="button"
        className="button button-danger mt-2"
        onClick={openDelete}
      >
        {t("settings.deleteAccount.startAction")}
      </button>
    </>
  );
};

const LeftSection: React.FC = () => {
  const { t } = useI18n();

  const toasts = useToasts();
  const user = useCurrentUser();

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
    }).then(() => toasts.success(t("settings.profileUpdated")));
  }

  useEffect(() => {
    if (user) {
      (formRef.current as HTMLFormElement).reset();
      (usernameRef.current as HTMLInputElement).value = user.username;
    }
  }, [user]);

  const signOut = useCallback(async () => {
    await fetch(`${process.env.API_URI}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.resetUrqlClient();
    toasts.message(t("settings.signedOut"));
  }, [t, toasts]);

  return (
    <>
      <SettingTitle>{t("settings.profile.title")}</SettingTitle>
      {user ? (
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
                maxLength={15}
                required
              />
              <p className="text-xs text-foreground-secondary">
                {t("settings.username.helpText")}
              </p>
            </div>
            <div className="mt-4">
              <label className="label" htmlFor="profilePictureInput">
                {t("settings.profilePicture.label")}
              </label>
              <div className="flex">
                <img
                  alt={user.username}
                  src={user.profilePicture}
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
            <button type="submit" className="button button-success mt-2 w-full">
              {t("settings.save")}
            </button>
          </form>
          <div className="mt-8 border-t-2 py-4 border-background-secondary">
            <button className="button button-light w-full" onClick={signOut}>
              {t("settings.signOut")}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-foreground-tertiary">
            {t("settings.profile.authPrompt")}
          </p>
          <button onClick={logIn} className="button items-center mt-2">
            {t("common.signIn")}
          </button>
        </>
      )}
    </>
  );
};

const MusicConnection: React.FC = () => {
  const { t } = useI18n();
  // Account
  const { data: mAuth } = useMAuth();

  // Local
  const { forceResetPlayingPlatform } = usePlayer();
  const [localPlatform, setLocalPlatform] = useState<PlatformName | "">("");
  useEffect(() => {
    setLocalPlatform(
      (window.sessionStorage.getItem("playingPlatform") || "") as
        | PlatformName
        | ""
    );
  }, []);
  useEffect(() => {
    window.sessionStorage.setItem("playingPlatform", localPlatform || "");
    forceResetPlayingPlatform({});
  }, [localPlatform, forceResetPlayingPlatform]);

  const PlatformChoices = useMemo(
    () =>
      Object.entries(PLATFORM_FULLNAMES).map(([value, plname]) => (
        <option key={value} value={value}>
          {plname}
        </option>
      )),
    []
  );

  const platform = mAuth?.platform || localPlatform;
  const name = platform ? PLATFORM_FULLNAMES[platform] : null;
  const PlatformSvg = platform ? SvgByPlatformName[platform] : null;

  return (
    <div
      className={`${
        platform ? `brand-${platform}` : "bg-background-secondary"
      } p-4 rounded-lg flex items-center`}
    >
      {PlatformSvg && (
        <PlatformSvg width="40" height="40" className="fill-current" />
      )}
      <div className="ml-4">
        <div className="mb-1">
          {t("settings.listening.listeningOn", { name })}
        </div>
        <p className="text-sm leading-tight">
          {mAuth ? (
            <span className="opacity-75">
              {t("settings.listening.connectedToStereo", { name })},{" "}
              <Link href="/contact">
                <a className="underline">{t("settings.listening.contactUs")}</a>
              </Link>
            </span>
          ) : (
            <>
              <span className="opacity-75">
                {t("settings.listening.changeLocalMusicApp")}
              </span>{" "}
              <select
                aria-label="Listen on..."
                value={platform}
                onChange={(e) =>
                  setLocalPlatform(e.currentTarget.value as PlatformName)
                }
                onBlur={undefined}
                className="bg-white bg-opacity-50 font-bold p-1 rounded-lg"
              >
                <option value="" disabled>
                  {t("settings.listening.selectOne")}
                </option>
                {PlatformChoices}
              </select>
            </>
          )}
          .
        </p>
      </div>
    </div>
  );
};

const LinkSettings: React.FC = () => {
  const { t } = useI18n();
  return (
    <>
      <SettingTitle>{t("settings.titleLink")}</SettingTitle>
      <MusicConnection />
    </>
  );
};

const RightSection: React.FC = () => {
  const { t } = useI18n();
  const user = useCurrentUser();
  return (
    <>
      <div>
        <LinkSettings />
        {user && (
          <div className="mt-8">
            <SettingTitle>{t("settings.titleDangerZone")}</SettingTitle>
            <DeleteAccount user={user} />
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
      <NextSeo title={t("settings.title")} noindex />
      <div className="container">
        <h1 className="font-bold text-4xl mb-2 leading-tight">
          {t("settings.title")}
        </h1>
        <div className="flex flex-wrap">
          <div className="w-full lg:flex-1 p-4">
            <LeftSection />
          </div>
          <div className="w-full lg:flex-1 p-4">
            <RightSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
