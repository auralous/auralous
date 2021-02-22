import { SvgLogo } from "assets/svg";
import clsx from "clsx";
import { useLogin } from "components/Auth";
import { PlayerMinibar } from "components/Player";
import { Button } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import { useMe } from "hooks/user";
import { useI18n } from "i18n";
import Link from "next/link";
import { useRouter } from "next/router";
import useHasNotification from "./useHasNotification";

const SidebarItem: React.FC<{ href: string; isBold?: boolean }> = ({
  children,
  href,
  isBold,
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link href={href}>
      <a
        className={clsx(
          "w-full btn btn-transparent font-normal text-sm",
          isActive && "bg-background-secondary",
          isBold && "bg-gradient-to-l from-secondary to-primary"
        )}
      >
        {children}
      </a>
    </Link>
  );
};

const Sidebar: React.FC<{ height: number }> = ({ height }) => {
  const { t } = useI18n();
  const me = useMe();
  const [, logIn] = useLogin();

  const hasNotification = useHasNotification(me?.user);

  return (
    <div
      className="w-56 sticky top-0 overflow-auto"
      style={{ maxHeight: height }}
    >
      <Box padding={2} gap="sm">
        <Box paddingY={4}>
          <SvgLogo title="Stereo" className="w-32 h-12 mx-auto fill-current" />
        </Box>
        <SidebarItem href="/new" isBold>
          {t("story.create")}
        </SidebarItem>
        <SidebarItem href="/listen">{t("listen.title")}</SidebarItem>
        <SidebarItem href="/map">{t("map.title")}</SidebarItem>
        <SidebarItem href="/notifications">
          {t("notification.title")}
          {hasNotification && (
            <span className="w-2 h-2 ml-1 rounded-full bg-primary animate-pulse" />
          )}
        </SidebarItem>
      </Box>
      <Box padding={1}>
        {me ? (
          <Box
            paddingX={2}
            paddingY={1}
            backgroundColor="background-bar"
            row
            alignItems="center"
            gap="sm"
            rounded="lg"
          >
            <img
              src={me.user.profilePicture}
              alt={me.user.username}
              className="w-8 h-8 rounded-full"
            />
            <Box flex={1} minWidth={0}>
              <Typography.Paragraph
                noMargin
                strong
                size="sm"
                color="foreground-secondary"
              >
                {me.user.username}
              </Typography.Paragraph>
              <Link href={`/user/${me.user.username}`}>
                <Typography.Link color="primary" size="xs">
                  {t("user.profile")}
                </Typography.Link>
              </Link>
            </Box>
          </Box>
        ) : (
          <>
            <Button
              styling="link"
              color="primary"
              onPress={logIn}
              fullWidth
              title={t("common.signIn")}
            />
          </>
        )}
      </Box>
    </div>
  );
};

const LayoutAppDesktop: React.FC<{ height: number }> = ({ height }) => {
  const router = useRouter();

  return (
    <>
      <Sidebar height={height} />
      {router.pathname !== "/story/[storyId]" && (
        <div className="z-10 bottom-4 fixed" style={{ width: 640 }}>
          <PlayerMinibar />
        </div>
      )}
    </>
  );
};

export default LayoutAppDesktop;
