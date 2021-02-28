import {
  SvgChevronDown,
  SvgMoreHorizontal,
  SvgShare2,
  SvgSquare,
  SvgTrash,
  SvgUser,
} from "assets/svg";
import { Skeleton } from "components/Loading";
import { ModalBackdrop, useModal } from "components/Modal";
import { Button } from "components/Pressable";
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
    <ModalBackdrop.Modal
      active={active}
      title={t("story.ofUsername", { username: user?.username })}
      close={close}
    >
      <Box fullWidth alignItems="center" gap="sm">
        {user && (
          <>
            <img
              className="w-32 h-32 object-cover shadow-lg"
              src={user.profilePicture}
              alt={user.username}
            />
            <Box padding="xs" justifyContent="center">
              <Typography.Paragraph
                size="md"
                truncate
                strong
                noMargin
                align="center"
              >
                {t("story.ofUsername", { username: user.username })}
              </Typography.Paragraph>
              <Typography.Paragraph
                size="sm"
                truncate
                color="foreground-secondary"
                align="center"
              >
                {story.text}
              </Typography.Paragraph>
            </Box>
          </>
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
      </Box>
    </ModalBackdrop.Modal>
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
      <Box
        row
        minWidth={0}
        flex={1}
        alignItems="center"
        justifyContent="center"
        gap="xs"
      >
        <Skeleton show={!user} rounded="full">
          <img
            alt={user?.username}
            className="w-6 h-6 rounded-full object-cover"
            src={user?.profilePicture}
          />
        </Skeleton>
        <Typography.Text size="sm" strong>
          {t("story.ofUsername", { username: user?.username || "" })}
        </Typography.Text>
        {story.isLive ? (
          <span className="font-bold text-xs bg-primary animate-pulse uppercase leading-none py-0.5 px-1 rounded-full">
            {t("common.live")}
          </span>
        ) : (
          <Typography.Text size="xs" color="foreground-secondary">
            {dateStr}
          </Typography.Text>
        )}
      </Box>
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
