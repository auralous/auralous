import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Dialog from "@reach/dialog";
import { useCurrentUser } from "~/hooks/user";
import { useUpdateMeMutation } from "~/graphql/gql.gen";
import { useToasts } from "~/components/Toast";
import {
  SvgChevronRight,
  SvgHeadphones,
  SvgMusic,
  SvgPlus,
  SvgUserGroup,
} from "~/assets/svg";

const StepWelcome: React.FC = () => {
  return (
    <div className="h-full overflow-y-scroll flex flex-col items-center">
      <h2 className="text-4xl font-bold text-center mb-4">Welcome to Stereo</h2>
      <p className="text-center mb-6">
        We&apos;re glad you came! Stereo is a community of people enjoy
        listening to, sharing, and exploring music.
      </p>
      <div className="flex justify-start items-center overflow-x-auto flex-none max-w-full text-center leading-tight mb-2">
        <div className="flex flex-col items-center mx-3">
          <div className="p-4 bg-background-secondary rounded-full mx-auto mb-1">
            <SvgPlus />
          </div>
          <span className="text-xs">Create a room</span>
        </div>
        <SvgChevronRight className="flex-none" />
        <div className="flex flex-col items-center mx-3">
          <div className="p-4 bg-background-secondary rounded-full mx-auto mb-1">
            <SvgUserGroup />
          </div>
          <span className="text-xs">Invite friends</span>
        </div>
        <SvgChevronRight className="flex-none" />
        <div className="flex flex-col items-center mx-3">
          <div className="p-4 bg-background-secondary rounded-full mx-auto mb-1">
            <SvgMusic />
          </div>
          <span className="text-xs">Add songs</span>
        </div>
        <SvgChevronRight className="flex-none" />
        <div className="flex flex-col items-center mx-3">
          <div className="p-4 bg-background-secondary rounded-full mx-auto mb-1">
            <SvgHeadphones />
          </div>
          <span className="text-xs">Listen together</span>
        </div>
      </div>
    </div>
  );
};

const StepUsername: React.FC<{
  onNextFn: React.MutableRefObject<
    (() => Promise<boolean> | boolean) | undefined
  >;
}> = ({ onNextFn }) => {
  const user = useCurrentUser();
  const [, updateUser] = useUpdateMeMutation();
  const toasts = useToasts();

  const onSubmit = useCallback(async () => {
    const { error } = await updateUser({
      username: (usernameRef.current as HTMLInputElement).value,
      profilePicture: (profilePictureRef.current as HTMLInputElement)
        .files?.[0],
    });
    if (error?.graphQLErrors) {
      for (const err of error?.graphQLErrors) {
        toasts.error(err.message);
      }
      return false;
    }
    return true;
  }, [updateUser, toasts]);

  useEffect(() => {
    onNextFn.current = onSubmit;
    return () => (onNextFn.current = undefined);
  }, [onSubmit, onNextFn]);

  const usernameRef = useRef<HTMLInputElement>(null);
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const profilePicturePreviewRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!usernameRef.current || !profilePicturePreviewRef.current) return;
    usernameRef.current.value = user?.username || "";
    profilePicturePreviewRef.current.src = user?.profilePicture || "";
  }, [user, usernameRef, profilePicturePreviewRef]);

  return (
    <div className="h-full overflow-y-scroll">
      <h2 className="text-4xl font-bold text-center mb-4">It&apos;s a me!</h2>
      <div className="mb-4">
        <p className="text-center mb-2">
          Our robot assigns you the lame <b>username</b> below, but it can be
          something cooler!
        </p>
        <div className="w-full">
          <input
            ref={usernameRef}
            placeholder="Enter your name"
            className="input w-full"
            required
            maxLength={15}
          />
        </div>
        <p className="text-xs text-foreground-secondary text-center">
          15 chars max, lowercase, no space and special chars, please!
        </p>
      </div>
      <div className="mb-8">
        <p className="text-center mb-2">
          And while we&apos;re at it, how about some representation with a{" "}
          <b>profile picture</b>!
        </p>
        <div className="flex">
          <img
            ref={profilePicturePreviewRef}
            alt={user?.username || ""}
            className="w-16 h-16 bg-background-secondary rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            aria-label="Upload an image"
            ref={profilePictureRef}
            className="input w-full ml-4"
            onChange={(event) => {
              if (
                typeof window === "undefined" ||
                !profilePicturePreviewRef.current
              )
                return;
              profilePicturePreviewRef.current.src = window.URL.createObjectURL(
                event.currentTarget.files?.[0]
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

const StepFinal: React.FC = () => {
  return (
    <div className="h-full overflow-y-scroll">
      <h2 className="text-4xl font-bold text-center mb-4">Yayyy!</h2>
      <p className="text-center mb-2">
        Great! You are good to go. You can now start listening together with
        friends all around the world.
      </p>
      <p className="text-center">
        Remember, we are{" "}
        <Link href="/contact">
          <a className="text-success-light">here to help</a>
        </Link>{" "}
        at any time.
      </p>
    </div>
  );
};

const Welcome: React.FC<{ active: boolean; close: () => void }> = ({
  active,
  close,
}) => {
  const [step, setStep] = useState<number>(0);
  const onNextFn = useRef<(() => Promise<boolean> | boolean) | undefined>(
    undefined
  );
  const [isDisabled, setIsDisabled] = useState(false);
  const handleOnNext = async () => {
    setIsDisabled(true);
    if (onNextFn.current && (await onNextFn.current()) === false)
      return setIsDisabled(false);
    setIsDisabled(false);
    if (step < 2) setStep(step + 1);
    else close();
  };
  return (
    <Dialog
      aria-label="Welcome to Stereo"
      isOpen={active}
      onDismiss={close}
      className="h-full w-full p-2"
    >
      <div className="w-full p-4 min-h-screen flex flex-col flex-center">
        <div className="h-96 w-full flex flex-col items-center overflow-hidden">
          <div className="w-full flex-1 h-0 p-4">
            {step === 0 && <StepWelcome />}
            {step === 1 && <StepUsername onNextFn={onNextFn} />}
            {step === 2 && <StepFinal />}
          </div>
        </div>
        <div className="w-full flex">
          <button
            className="button rounded-none flex-1"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
          <button
            className="button button-foreground rounded-none flex-1"
            onClick={handleOnNext}
            disabled={isDisabled}
          >
            {step < 2 ? "Next" : "Done"}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default Welcome;
