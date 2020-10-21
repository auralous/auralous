import React, { useState, useRef, useEffect } from "react";
import { NextSeo } from "next-seo";
import { NextPage } from "next";
import Link from "next/link";
import { useToasts } from "~/components/Toast/index";
import { Modal, useModal } from "~/components/Modal/index";
import { useLogin } from "~/components/Auth/index";
import { useCurrentUser } from "~/hooks/user";
import {
  useDeleteMeOauthMutation,
  useUpdateMeMutation,
  useDeleteMeMutation,
  OAuthProviderName,
  useMeAuthQuery,
  User,
  PlatformName,
} from "~/graphql/gql.gen";
import { SvgYoutube, SvgFacebook, SvgTwitter, SvgSpotify } from "~/assets/svg";
import { usePlayer } from "~/components/Player";
import { PLATFORM_FULLNAMES } from "~/lib/constants";
import { useCallback } from "react";

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
    (window as any).resetUrqlClient();
    toasts.message("You have been signed out");
  }, [toasts]);

  return (
    <>
      <h3 className="text-lg font-bold mb-4">Me, myself, and I</h3>
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
            Sign in to your Stereo account to make changes to your profile.
          </p>
          <button
            onClick={logIn}
            title="Sign in to Stereo"
            className="button items-center mt-2"
          >
            Sign in
          </button>
        </>
      )}
    </>
  );
};

const MusicConnection: React.FC<{
  name: string;
  provider: OAuthProviderName;
}> = ({ name, provider }) => {
  const [{ data }] = useMeAuthQuery();
  if (!data?.meAuth?.[provider]) return null;
  return (
    <div className={`brand-${provider} p-4 rounded-lg flex items-center`}>
      {provider === "youtube" && (
        <SvgYoutube width="40" height="40" fill="currentColor" />
      )}
      {provider === "spotify" && (
        <SvgSpotify width="40" height="40" fill="currentColor" />
      )}
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

const SocialConnection: React.FC<{
  name: string;
  provider: OAuthProviderName;
}> = ({ name, provider }) => {
  const [activeDisconnect, openDisconnect, closeDisconnect] = useModal();
  const toasts = useToasts();

  const [{ data }] = useMeAuthQuery();

  const [, disconnectOAuth] = useDeleteMeOauthMutation();

  async function disconnect() {
    await disconnectOAuth({ provider });
    toasts.message(`${name} account has been disconnected`);
    closeDisconnect();
  }

  const isConnected = !!data?.meAuth?.[provider];

  return (
    <>
      <div className="mb-2 rounded-lg flex">
        <div
          className={`brand-${provider} p-3 w-16 h-16 flex flex-none place-center rounded`}
        >
          {provider === "facebook" && (
            <SvgFacebook width="32" height="32" fill="currentColor" />
          )}
          {provider === "twitter" && (
            <SvgTwitter width="32" height="32" fill="currentColor" />
          )}
        </div>
        <div className="px-4">
          <h4 className="font-bold text-foreground-tertiary mb-1 text-lg">
            <span className="text-foreground">{name}</span> (
            <span
              className={`mb-2 text-sm ${
                isConnected ? "text-success" : "text-foreground-secondary"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
            )
          </h4>
          {!isConnected ? (
            <a
              href={`${process.env.API_URI}/auth/${provider}?continue=/settings`}
              className="button button-success text-sm"
            >
              Connect
            </a>
          ) : (
            <button
              type="button"
              onClick={openDisconnect}
              className="button button-danger text-sm"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
      <Modal.Modal
        title="Disconnect account"
        active={activeDisconnect}
        onOutsideClick={closeDisconnect}
      >
        <Modal.Header>
          <Modal.Title>Disconnect from {name}</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <p className="text-foreground-secondary">
            Are your sure you want to unlink your {name} account? You can always
            reconnect at any time.
          </p>
        </Modal.Content>
        <Modal.Footer>
          <button
            type="button"
            className="button bg-transparent text-danger-light"
            onClick={disconnect}
          >
            Disconnect
          </button>
          <button
            type="button"
            onClick={closeDisconnect}
            className="button button-success"
          >
            Nevermind
          </button>
        </Modal.Footer>
      </Modal.Modal>
    </>
  );
};

const LocalPlatformSettings: React.FC = () => {
  const { forceResetPlayingPlatform } = usePlayer();
  const [platform, setPlatform] = useState(() =>
    typeof window !== "undefined"
      ? (window.sessionStorage.getItem(
          "playingPlatform"
        ) as PlatformName | null)
      : null
  );

  const name = platform ? PLATFORM_FULLNAMES[platform] : "";

  useEffect(() => {
    window.sessionStorage.setItem("playingPlatform", platform || "");
    forceResetPlayingPlatform({});
  }, [platform, forceResetPlayingPlatform]);

  return (
    <div
      className={`${
        platform ? `brand-${platform}` : "bg-background-secondary"
      }  p-4 rounded-lg flex items-center`}
    >
      {platform === "youtube" && (
        <SvgYoutube width="40" height="40" fill="currentColor" />
      )}
      {platform === "spotify" && (
        <SvgSpotify width="40" height="40" fill="currentColor" />
      )}
      <div className="ml-4">
        <div className="mb-1">
          Listening on{" "}
          <select
            aria-label="Listen on..."
            value={platform || ""}
            onChange={(e) => {
              setPlatform(e.currentTarget.value as PlatformName);
            }}
            className="bg-white bg-opacity-50 font-bold p-1 rounded-lg"
          >
            <option value="" disabled>
              Select one
            </option>
            <option value="youtube">YouTube</option>
            <option value="spotify">Spotify</option>
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
  const [, logIn] = useLogin();
  return (
    <>
      <h3 className="text-lg font-bold mb-1">Connections</h3>
      {user ? (
        <>
          <h4 className="font-bold mb-2">Music</h4>
          <MusicConnection
            name="YouTube"
            provider={OAuthProviderName.Youtube}
          />
          <MusicConnection
            name="Spotify"
            provider={OAuthProviderName.Spotify}
          />
          <h4 className="font-bold my-2">Social</h4>
          <SocialConnection
            name="Facebook"
            provider={OAuthProviderName.Facebook}
          />
          <SocialConnection
            name="Twitter"
            provider={OAuthProviderName.Twitter}
          />
        </>
      ) : (
        <>
          <h4 className="font-bold mb-2">Music</h4>
          <LocalPlatformSettings />
          <h4 className="font-bold my-2">Social</h4>
          <p className="text-foreground-secondary ">
            Sign in to your Stereo account to connect with friends and families.
          </p>
          <button
            onClick={logIn}
            title="Sign in to Stereo"
            className="button items-center mt-2"
          >
            Sign in
          </button>
        </>
      )}
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
            <h4 className="text-md font-bold">Danger zone</h4>
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
    <div className="container mt-20">
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
