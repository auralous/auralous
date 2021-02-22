import {
  SvgActivity,
  SvgLogIn,
  SvgMapPin,
  SvgPlayCircle,
  SvgPlus,
  SvgUser,
} from "assets/svg";
import clsx from "clsx";
import { useLogin } from "components/Auth";
import { PlayerMinibar } from "components/Player";
import { Box } from "components/View";
import { useMe } from "hooks/user";
import { useI18n } from "i18n/index";
import Link from "next/link";
import { useRouter } from "next/router";
import { fullLayoutPathnames } from "./common";
import useHasNotification from "./useHasNotification";

const AppbarItem: React.FC<{
  title: string;
  href: string;
  as?: string;
  isBold?: boolean;
}> = ({ children, href, as, title, isBold }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link href={href} as={as}>
      <a
        className={clsx(
          "relative btn btn-transparent text-foreground border-primary py-1 font-light rounded-none flex-1",
          isActive && !isBold && "bg-background-tertiary",
          isBold && "bg-gradient-to-l from-secondary to-primary"
        )}
        title={title}
      >
        {children}
      </a>
    </Link>
  );
};

const Appbar: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const me = useMe();
  const [, logIn] = useLogin();

  const hasNotification = useHasNotification(me?.user);

  if (fullLayoutPathnames.includes(router.pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-10">
      <Box padding={1}>
        <PlayerMinibar />
      </Box>
      <div
        className="flex h-12 rounded-t-3xl overflow-hidden"
        style={{ backgroundColor: "rgb(18, 18, 24)" }}
      >
        <AppbarItem href="/listen" title={t("listen.title")}>
          <SvgPlayCircle className="w-4 h-4" />
        </AppbarItem>
        <AppbarItem href="/map" title={t("map.title")}>
          <SvgMapPin className="w-4 h-4" />
        </AppbarItem>
        <AppbarItem isBold href="/new" title={t("story.create")}>
          <SvgPlus className="w-6 h-6" />
        </AppbarItem>
        <AppbarItem href="/notifications" title={t("notification.title")}>
          <SvgActivity className="w-4 h-4" />
          {hasNotification && (
            <span className="w-2 h-2 rounded-full bg-primary absolute top-2 left-1/2 ml-2 animate-pulse" />
          )}
        </AppbarItem>
        {me ? (
          <AppbarItem
            as={`/user/${me.user.username}`}
            href="/user/[username]"
            title={t("user.profile")}
          >
            <SvgUser className="w-4 h-4" />
          </AppbarItem>
        ) : (
          <button
            className="btn btn-transparent border-primary py-1 rounded-none flex-1"
            title={t("common.signIn")}
            onClick={logIn}
          >
            <SvgLogIn className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const LayoutAppMobile: React.FC = () => {
  return <Appbar />;
};

export default LayoutAppMobile;
