import imageDefaultPlaylist from "@/assets/images/default_playlist.jpg";
import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import { useTimeDiffFormatter } from "@/ui-context";
import type { Session } from "@auralous/api";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, StyleSheet, View } from "react-native";

interface SessionItemProps {
  session: Session;
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
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
    borderRadius: Size[1],
    height: 0,
    overflow: "hidden",
    paddingBottom: "156.25%",
    position: "relative",
    width: "100%",
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
  const tdf = useTimeDiffFormatter();
  const timeDiffText = useMemo(
    () =>
      session.isLive
        ? t("common.status.live").toUpperCase()
        : tdf(session.createdAt),
    [tdf, t, session]
  );

  return (
    <View style={styles.root}>
      <ImageBackground
        source={session.image ? { uri: session.image } : imageDefaultPlaylist}
        defaultSource={imageDefaultPlaylist}
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
              <Text size="xs">{timeDiffText}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SessionItem;
