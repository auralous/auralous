import React from "react";
import Link from "next/link";
import { useLogin } from "~/components/Auth";
import StoryFeed from "~/components/Story/StoryFeed";
import { useCurrentUser } from "~/hooks/user";
import { useI18n } from "~/i18n/index";

const ListenMain: React.FC = () => {
  const { t } = useI18n();

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
      <div className="container mx-auto">
        <StoryFeed id="PUBLIC" />
      </div>
    </>
  );
};

export default ListenMain;
