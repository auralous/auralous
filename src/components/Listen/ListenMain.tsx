import React, { useState } from "react";
import Link from "next/link";
import { DialogOverlay } from "@reach/dialog";
import { usePlayer } from "~/components/Player";
import StorySlider from "~/components/Story/StorySlider";
import { useCurrentUser } from "~/hooks/user";
import { SvgChevronDown } from "~/assets/svg";
import { useI18n } from "~/i18n/index";
import { useLogin } from "~/components/Auth";

const ListenMain: React.FC = () => {
  const { t } = useI18n();
  const [id, setId] = useState<string | undefined>();
  const { playStory } = usePlayer();

  const user = useCurrentUser();
  const [, logIn] = useLogin();

  return (
    <>
      <div className="flex px-4 pt-6 pb-2 items-center">
        <h1 className="w-0 flex-1 font-bold text-4xl bg-gradient-to-b from-background to-transparent">
          {t("listen.title")}
        </h1>
        {user ? (
          <Link href={`/user/${user.username}`}>
            <a
              className="btn w-10 h-10 p-0.5 rounded-full text-primary border-2 overflow-hidden"
              title={user.username}
            >
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-full h-full rounded-full"
              />
            </a>
          </Link>
        ) : (
          <button
            onClick={logIn}
            className="btn h-10 px-4 rounded-full p-0 text-primary border-2 overflow-hidden"
            title={t("common.signIn")}
          >
            {t("common.signIn")}
          </button>
        )}
      </div>
      <div className="container relative">
        <button onClick={() => setId("PUBLIC")}>Click me</button>
      </div>
      {id && (
        <DialogOverlay isOpen style={{ zIndex: 10 }}>
          <button
            className="btn absolute top-4 z-20 right-3 p-1.5 rounded-full"
            onClick={() => {
              playStory("");
              setId(undefined);
            }}
            aria-label={t("modal.close")}
          >
            <SvgChevronDown className="w-4 h-4" />
          </button>
          <StorySlider id={id} />
        </DialogOverlay>
      )}
    </>
  );
};

export default ListenMain;
