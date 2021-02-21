import { DialogOverlay } from "@reach/dialog";
import {
  SvgChevronDown,
  SvgMoreHorizontal,
  SvgShare2,
  SvgSquare,
  SvgTrash,
  SvgUser,
  SvgX,
} from "assets/svg";
import { Skeleton } from "components/Loading";
import { useModal } from "components/Modal";
import { Button } from "components/Pressable";
import { Spacer } from "components/Spacer";
import { StoryShare } from "components/Story";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { Story, useUserQuery } from "gql/gql.gen";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import ms from "ms";
import Link from "next/link";
import { useMemo } from "react";
import StoryDelete from "./StoryDelete";
import StoryEnd from "./StoryEnd";

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
  const [activeDelete, openDelete, closeDelete] = useModal();

  const me = useMe();

  return (
    <>
      <DialogOverlay isOpen={active} className="backdrop-blur">
        <div className="w-full max-w-2xl h-64 flex flex-col items-center space-y-2">
          {user && (
            <Box row>
              <img
                className="w-12 h-12 rounded-full"
                src={user.profilePicture}
                alt={user.username}
              />
              <Box padding={1}>
                <Typography.Text strong>
                  {t("story.ofUsername", { username: user.username })}
                </Typography.Text>
                <Typography.Paragraph size="sm" color="foreground-secondary">
                  {story.text}
                </Typography.Paragraph>
              </Box>
            </Box>
          )}
          <Button
            onPress={openShare}
            icon={<SvgShare2 className="w-5 h-5" />}
            styling="link"
            title={t("story.share.title")}
          />
          <StoryShare active={activeShare} close={closeShare} story={story} />
          <Link href={`/user/${user?.username}`}>
            <Button
              icon={<SvgUser className="w-5 h-5" />}
              title={t("story.menu.viewCreator")}
              styling="link"
            />
          </Link>
          <StoryEnd story={story}>
            {(openEnd) => (
              <Button
                icon={<SvgSquare className="w-5 h-5" />}
                title={t("story.end.title")}
                styling="link"
                onPress={openEnd}
              />
            )}
          </StoryEnd>
          {story.isLive === false && me?.user.id === story.creatorId && (
            <>
              <Button
                icon={<SvgTrash className="w-5 h-5" />}
                title={t("story.delete.title")}
                onPress={openDelete}
                styling="link"
              />
              <StoryDelete
                active={activeDelete}
                close={closeDelete}
                story={story}
              />
            </>
          )}
        </div>
        <div className="absolute top-4 right-4 p-1.5">
          <Button
            accessibilityLabel={t("modal.close")}
            onPress={close}
            icon={<SvgX className="w-8 h-8" />}
            styling="link"
          />
        </div>
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
    <Box row alignItems="center" justifyContent="between">
      <Button
        styling="link"
        icon={<SvgChevronDown className="w-8 h-8" />}
        accessibilityLabel={t("modal.close")}
        onPress={onClose}
      />
      <div className="flex w-0 flex-1 items-center justify-center">
        <Skeleton show={!user} rounded="full">
          <img
            alt={user?.username}
            className="w-6 h-6 rounded-full object-cover"
            src={user?.profilePicture}
          />
        </Skeleton>
        <Spacer size={1} axis="horizontal" />
        <Typography.Text size="sm" strong>
          {t("story.ofUsername", { username: user?.username || "" })}
        </Typography.Text>
        <Spacer size={1} axis="horizontal" />
        {story.isLive ? (
          <span className="font-bold text-xs bg-primary animate-pulse uppercase leading-none py-0.5 px-1 rounded-full">
            {t("common.live")}
          </span>
        ) : (
          <Typography.Text size="xs" color="foreground-secondary">
            {dateStr}
          </Typography.Text>
        )}
      </div>
      <Button
        accessibilityLabel={t("story.menu.handle")}
        icon={<SvgMoreHorizontal className="w-8 h-8" />}
        onPress={showMenu}
        styling="link"
      />
      <StoryNavMenu story={story} active={activeMenu} close={closeMenu} />
    </Box>
  );
};

export default StoryNav;
