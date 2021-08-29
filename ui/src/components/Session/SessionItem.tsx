import { ImageSources } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors, Size } from "@/styles";
import { formatTime } from "@/utils";
import type { Session } from "@auralous/api";
import type { FC } from "react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, StyleSheet, View } from "react-native";

interface SessionItemProps {
  session: Session;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  bottom: {
    alignItems: "flex-start",
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: { backgroundColor: "rgba(0,0,0,.5)", flex: 1, padding: Size[4] },
  root: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Size[2],
    height: Size[44] * 1.5625,
    overflow: "hidden",
    width: Size[44],
  },
  tag: {
    backgroundColor: "rgba(0,0,0,.5)",
    borderRadius: 9999,
    flexGrow: 0,
    marginTop: Size[1],
    paddingHorizontal: Size[3],
    paddingVertical: Size[1.5],
  },
  text: {
    color: Colors.white,
  },
  textSecondary: {
    color: "rgba(255, 255, 255, 0.75)",
  },
  top: {
    flex: 1,
  },
});

const SessionItem: FC<SessionItemProps> = ({ session }) => {
  const { t } = useTranslation();

  const dateStr = useMemo(() => {
    if (!session) return "";
    if (session.isLive) return t("common.status.live").toUpperCase();
    const diff = Date.now() - session.createdAt.getTime();
    if (diff < 60 * 1000) {
      return t("common.time.just_now");
    }
    return t("common.time.ago", { time: formatTime(t, diff) });
  }, [session, t]);

  return (
    <View style={styles.root}>
      <ImageBackground
        source={
          session.image ? { uri: session.image } : ImageSources.defaultPlaylist
        }
        defaultSource={ImageSources.defaultPlaylist}
        style={styles.background}
        accessible={false}
      >
        <View style={styles.overlay}>
          <View style={styles.top}>
            <Avatar
              href={session.creator.profilePicture}
              username={session.creator.username}
              size={12}
            />
          </View>
          <View style={styles.bottom}>
            <Text style={styles.text} bold size="xl">
              {session.creator.username}
            </Text>
            <Spacer y={2} />
            <Text style={styles.textSecondary} numberOfLines={3}>
              {session.text}
            </Text>
            <Spacer y={3} />
            <View
              style={[
                styles.tag,
                session.isLive && { backgroundColor: Colors.primary },
              ]}
            >
              <Text size="xs">{dateStr}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default memo(SessionItem);
