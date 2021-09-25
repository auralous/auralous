import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import type { InputRef } from "@/components/Input";
import { Input } from "@/components/Input";
import { Spacer } from "@/components/Spacer";
import { toast } from "@/components/Toast";
import { Text } from "@/components/Typography";
import type { PlatformName, User } from "@auralous/api";
import { useMeUpdateMutation } from "@auralous/api";
import type { FC } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});

const UserEditor: FC<{ user: User; platform: PlatformName }> = ({
  platform,
  user,
}) => {
  const { t } = useTranslation();

  const usernameRef = useRef<InputRef>(null);

  const [{ fetching }, meUpdate] = useMeUpdateMutation();

  useEffect(() => {
    usernameRef.current?.setValue(user.username);
  }, [user]);

  const onSubmit = useCallback(async () => {
    const result = await meUpdate({
      username: usernameRef.current?.value || "",
    });
    if (!result.error) {
      toast.success(t("settings.me_updated"));
    }
  }, [meUpdate, t]);

  return (
    <>
      {/* Profile Picture */}
      <Text color="textSecondary" bold align="center">
        {t("user.profile_picture")}
      </Text>
      <Spacer y={2} />
      <View style={styles.center}>
        <Avatar username={user.username} href={user.profilePicture} size={24} />
      </View>
      <Spacer y={2} />
      <Text size="sm" color="textTertiary" align="center">
        {t("settings.profile_picture_note", {
          name: t(`music_platform.${platform}.name`),
        })}
      </Text>
      <Spacer y={8} />
      {/* Username */}
      <Text color="textSecondary" bold align="center">
        {t("user.username")}
      </Text>
      <Spacer y={2} />
      <Input ref={usernameRef} />
      <Spacer y={4} />
      <Button variant="primary" disabled={fetching} onPress={onSubmit}>
        {t("common.action.save")}
      </Button>
    </>
  );
};

export default UserEditor;
