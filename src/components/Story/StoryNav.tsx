import React, { useMemo } from "react";
import Link from "next/link";
import ms from "ms";
import { DialogOverlay } from "@reach/dialog";
import StoryShare from "./StoryShare";
import StoryEnd from "./StoryEnd";
import { useModal } from "~/components/Modal";
import { useUserQuery, Story } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import {
  SvgChevronDown,
  SvgMoreHorizontal,
  SvgShare2,
  SvgSquare,
  SvgUser,
  SvgX,
} from "~/assets/svg";

const StoryNavMenu: React.FC<{
  story: Story;
  active: boolean;
  close(): void;
}> = ({ story, active, close }) => {
  const { t } = useI18n();

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId || "" },
  });

  const [activeShare, openShare, closeShare] = useModal();

  return (
    <>
      <DialogOverlay isOpen={active}>
        <div className="w-full max-w-2xl h-64 flex flex-col items-center space-y-2">
          {user && (
            <div className="flex mb-4">
              <img
                className="w-12 h-12 rounded-full"
                src={user.profilePicture}
                alt={user.username}
              />
              <div className="leading-none p-1">
                <div className="font-bold">
                  {t("story.ofUsername", { username: user.username })}
                </div>
                <div className="text-sm text-foreground-secondary">
                  {story.text}
                </div>
              </div>
            </div>
          )}
          <button onClick={openShare} className="btn btn-transparent">
            <SvgShare2 className="w-5 h-5 mr-2" />
            {t("story.share.title")}
          </button>
          <StoryShare active={activeShare} close={closeShare} story={story} />
          <Link href={`/user/${user?.username}`}>
            <a className="btn btn-transparent">
              <SvgUser className="w-5 h-5 mr-2" />
              {t("story.menu.viewCreator")}
            </a>
          </Link>
          <StoryEnd story={story}>
            {(openEnd) => (
              <button onClick={openEnd} className="btn btn-transparent">
                <SvgSquare className="w-5 h-5 mr-2" />
                {t("story.end.title")}
              </button>
            )}
          </StoryEnd>
        </div>
        <button
          className="btn btn-transparent absolute top-4 right-4 p-1.5"
          onClick={close}
          aria-label={t("modal.close")}
        >
          <SvgX className="w-8 h-8" />
        </button>
      </DialogOverlay>
    </>
  );
};

const StoryNav: React.FC<{ story: Story; onClose: () => void }> = ({
  story,
  onClose,
}) => {
  const { t } = useI18n();

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId || "" },
  });

  const dateStr = useMemo(() => {
    const d = Date.now() - story.createdAt.getTime();
    return d ? ms(d) : "";
  }, [story]);

  const [activeMenu, showMenu, closeMenu] = useModal();

  return (
    <div className="flex items-center justify-between">
      <button
        className="btn btn-transparent p-0 w-8 h-8"
        onClick={onClose}
        aria-label={t("modal.close")}
      >
        <SvgChevronDown className="w-6 h-6" />
      </button>
      <div className="flex w-0 flex-1 items-center justify-center">
        {user ? (
          <img
            alt={user.username}
            className="w-6 h-6 rounded-full object-cover"
            src={user.profilePicture}
          />
        ) : (
          <div className="box-skeleton w-6 h-6" />
        )}
        <div className="whitespace-nowrap ml-1">
          <span className="text-sm font-semibold">
            {t("story.ofUsername", { username: user?.username || "" })}
          </span>{" "}
          {story.isLive ? (
            <span className="font-semibold text-xs bg-primary animate-pulse uppercase leading-none py-0.5 px-1 rounded-full">
              {t("common.live")}
            </span>
          ) : (
            <span className="text-xs text-foreground-secondary">{dateStr}</span>
          )}
        </div>
      </div>
      <button
        aria-label={t("story.menu.handle")}
        className="btn btn-transparent p-0 w-8 h-8"
        onClick={showMenu}
      >
        <SvgMoreHorizontal className="w-6 h-6" />
      </button>
      <StoryNavMenu story={story} active={activeMenu} close={closeMenu} />
    </div>
  );
};

export default StoryNav;
