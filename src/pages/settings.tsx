import React, { useState, useRef, useEffect, useMemo } from "react";
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
import { PLATFORM_FULLNAMES, SvgByPlatformName } from "~/lib/constants";
import { useCallback } from "react";

const SettingTitle: React.FC = ({ children }) => (
  <h3 className="text-lg font-bold mb-1">{children}</h3>
);

const DeleteAccount: React.FC<{ user: User }> = ({ user }) => {
  const toasts = useToasts();
  const [, deleteUser] = useDeleteMeMutation();
  const [confirmUsername, setConfirmUsername] = useState("");
  const [activeDelete, openDelete, close] = useModal();
  function closeDelete() {
    setConfirmUsername("");
    close();
  }
  return (
    <>
      <Modal.Modal
        title="Deactivate account"
        active={activeDelete}
        onOutsideClick={closeDelete}
      >
        <Modal.Header>
          <Modal.Title>Sad to See You Go...</Modal.Title>
        </Modal.Header>
        <Modal.Content className="text-center">
          <p className="mb-4">
            Deactivating your account will remove all of your information,
            rooms.
            <br />
            <b>This process is immediate and cannot be undone</b>.
          </p>
          <input
            aria-label="Enter your username to continue"
            value={confirmUsername}
            placeholder="Enter your username to continue"
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
                toasts.message(
                  "Your account and data has been removed. We're sorry to see you go!"
                );
              })
            }
            disabled={confirmUsername !== user.username}
          >
            Deactivate
          </button>
          <button
            type="button"
            onClick={closeDelete}
            className="button button-success"
          >
            Nevermind
          </button>
        </Modal.Footer>
      </Modal.Modal>
      <p className="text-sm text-foreground-secondary">
        You can delete your account at any time.{" "}
        <Link href="/privacy#when-you-delete-data-in-your-accounts">
          <a className="underline">About your data on deactivation</a>
        </Link>
      </p>
      <button
        type="button"
        className="button button-danger mt-2"
        onClick={openDelete}
      >
        Deactivate Account
      </button>
    </>
  );
};

const LeftSection: React.FC = () => {
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
    }).then(() => toasts.success("Profile updated"));
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
    toasts.message("You have been signed out");
  }, [toasts]);

  return (
    <>
      <SettingTitle>Me, myself, and I</SettingTitle>
      {user ? (
        <>
          <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
            <div className="mt-4">
              <label className="label" htmlFor="usernameInput">
                Username
              </label>
              <input
                id="usernameInput"
                className="input w-full"
                ref={usernameRef}
                maxLength={15}
                required
              />
              <p className="text-xs text-foreground-secondary">
                15 characters max, lowercase, no space or special characters
              </p>
            </div>
            <div className="mt-4">
              <label className="label" htmlFor="profilePictureInput">
                Profile picture
              </label>
              <div className="flex">
                <img
                  alt={user.username}
                  src={user.profilePicture}
                  className="w-16 h-16 bg-background-secondary rounded-full object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Upload an image"
                  ref={profilePictureRef}
                  className="input w-full ml-4"
                />
              </div>
            </div>
            <button type="submit" className="button button-success mt-2 w-full">
              Save
            </button>
          </form>
          <div className="mt-8 border-t-2 py-4 border-background-secondary">
            <button className="button button-light w-full" onClick={signOut}>
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-foreground-tertiary">
            Join Stereo to customize your profile.
          </p>
          <button
            onClick={logIn}
            title="Join Stereo"
            className="button items-center mt-2"
          >
            Join
          </button>
        </>
      )}
    </>
  );
};

const MusicConnection: React.FC = () => {
  const { data: mAuth } = useMAuth();
  if (!mAuth) return null;
  const platform = mAuth.platform;
  const name = PLATFORM_FULLNAMES[mAuth.platform];
  const PlatformSvg = SvgByPlatformName[platform];
  return (
    <div className={`brand-${platform} p-4 rounded-lg flex items-center`}>
      <PlatformSvg width="40" height="40" className="fill-current" />
      <div className="ml-4">
        <div className="mb-1">
          Listening on <b>{name}</b>
        </div>
        <p className="text-sm opacity-75">
          Your Stereo account is connected to <b>{name}</b>. If you wish to
          switch,{" "}
          <Link href="/contact">
            <a className="underline">contact us</a>
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

const LocalPlatformSettings: React.FC = () => {
  const { forceResetPlayingPlatform } = usePlayer();
  const [platform, setPlatform] = useState<PlatformName | "">("");

  useEffect(() => {
    // init from sessionStorage
    setPlatform(
      (window.sessionStorage.getItem("playingPlatform") || "") as
        | PlatformName
        | ""
    );
  }, []);

  const PlatformChoices = useMemo(
    () =>
      Object.entries(PLATFORM_FULLNAMES).map(([value, plname]) => (
        <option key={value} value={value}>
          {plname}
        </option>
      )),
    []
  );

  useEffect(() => {
    window.sessionStorage.setItem("playingPlatform", platform || "");
    forceResetPlayingPlatform({});
  }, [platform, forceResetPlayingPlatform]);

  const name = platform ? PLATFORM_FULLNAMES[platform] : "";
  const PlatformSvg = platform ? SvgByPlatformName[platform] : null;

  return (
    <div
      className={`${
        platform ? `brand-${platform}` : "bg-background-secondary"
      }  p-4 rounded-lg flex items-center`}
    >
      {PlatformSvg && (
        <PlatformSvg width="40" height="40" className="fill-current" />
      )}
      <div className="ml-4">
        <div className="mb-1">
          Listening on{" "}
          <select
            aria-label="Listen on..."
            value={platform}
            onChange={(e) => setPlatform(e.currentTarget.value as PlatformName)}
            onBlur={undefined}
            className="bg-white bg-opacity-50 font-bold p-1 rounded-lg"
          >
            <option value="" disabled>
              Select one
            </option>
            {PlatformChoices}
          </select>
        </div>
        <p className="text-sm opacity-75">
          {platform ? (
            <>
              You are listening to music on <b>{name}</b>
            </>
          ) : (
            "Select a platform to start playing music"
          )}
          .
        </p>
      </div>
    </div>
  );
};

const LinkSettings: React.FC = () => {
  const user = useCurrentUser();
  // const [, logIn] = useLogin();
  return (
    <>
      <SettingTitle>Connections</SettingTitle>
      {user ? <MusicConnection /> : <LocalPlatformSettings />}
    </>
  );
};

const RightSection: React.FC = () => {
  const user = useCurrentUser();
  return (
    <>
      <div>
        <LinkSettings />
        {user && (
          <div className="mt-8">
            <SettingTitle>Danger zone</SettingTitle>
            <DeleteAccount user={user} />
          </div>
        )}
      </div>
    </>
  );
};

const SettingsPage: NextPage = () => (
  <>
    <NextSeo title="Settings" noindex />
    <div className="container">
      <h1 className="font-bold text-4xl mb-2 leading-tight">Settings</h1>
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

export default SettingsPage;
