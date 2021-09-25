import { useMeQuery } from "@auralous/api";
import {
  Avatar,
  Button,
  Colors,
  IconBell,
  IconLogo,
  IconSettings,
  Size,
  Spacer,
  Text,
  TextButton,
  useUiDispatch,
} from "@auralous/ui";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Link, useHistory, useLocation } from "react-router-dom";
import classNames from "./Layout.module.css";

const styles = StyleSheet.create({
  left: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  logoContainer: {
    paddingVertical: Size[2],
  },
  navItem: {
    alignItems: "center",
    borderRadius: Size[2],
    flexDirection: "row",
    height: Size[10],
    paddingHorizontal: Size[4],
  },
  navItemActive: {
    backgroundColor: "#282828",
  },
  navItemText: {
    flex: 1,
  },
  placeholder: {
    height: 58,
  },
  right: {
    alignItems: "center",
    flexDirection: "row",
  },
});

const NavItem: FC<{ text: string; to: string }> = ({ text, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to}>
      <View style={[styles.navItem, isActive && styles.navItemActive]}>
        <Text
          color={isActive ? "text" : "textSecondary"}
          bold={isActive ? true : "medium"}
          style={styles.navItemText}
        >
          {text}
        </Text>
      </View>
    </Link>
  );
};

export const Nav: FC = () => {
  const { t } = useTranslation();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const uiDispatch = useUiDispatch();

  const history = useHistory();

  const gotoNotifications = useCallback(
    () => history.push("/notifications"),
    [history]
  );

  const gotoSettings = useCallback(() => history.push("/settings"), [history]);

  return (
    <nav className={classNames.nav}>
      <View style={styles.left}>
        <Link to="/">
          <View style={styles.logoContainer}>
            <IconLogo color={Colors.text} width={148} />
          </View>
        </Link>
        <Spacer x={8} />
        <NavItem to="/map" text={t("map.title")} />
        <Spacer x={2} />
        <NavItem to="/search" text={t("search.title")} />
      </View>
      <View style={styles.right}>
        <TextButton
          icon={<IconBell strokeWidth={1} />}
          accessibilityLabel={t("notifications.title")}
          onPress={gotoNotifications}
        />
        <Spacer x={1} />
        <TextButton
          icon={<IconSettings strokeWidth={1} />}
          accessibilityLabel={t("settings.title")}
          onPress={gotoSettings}
        />
        <Spacer x={1} />
        {me ? (
          <Link to={`/user/${me.user.username}`}>
            <Avatar size={10} username={me.user.username} />
          </Link>
        ) : (
          <Button
            onPress={() =>
              uiDispatch({ type: "signIn", value: { visible: true } })
            }
          >
            {t("sign_in.title")}
          </Button>
        )}
      </View>
    </nav>
  );
};

export const NavPlaceholder: FC = () => (
  <View
    pointerEvents="none"
    style={styles.placeholder}
    accessibilityElementsHidden={true}
    importantForAccessibility="no-hide-descendants"
  />
);
