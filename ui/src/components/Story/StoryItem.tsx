import { Story } from "@auralous/api";
import { Avatar } from "@auralous/ui/components/Avatar";
import { Text } from "@auralous/ui/components/Typography";
import { Size, useColors } from "@auralous/ui/styles";
import { format as formatMs } from "@auralous/ui/utils";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, StyleSheet, View } from "react-native";

interface StoryItemProps {
  story: Story;
}

const styles = StyleSheet.create({
  root: {
    width: Size[44],
    height: Size[44] * 1.5625,
    borderRadius: Size[2],
    overflow: "hidden",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,.5)", padding: Size[4] },
  top: {
    flex: 1,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  text: {
    lineHeight: 18,
    color: "#ffffff",
  },
  textSecondary: {
    color: "rgba(255, 255, 255, 0.75)",
  },
  tag: {
    paddingHorizontal: Size[3],
    paddingVertical: 3,
    borderRadius: 99,
    flexGrow: 0,
    marginTop: Size[1],
  },
});

const StoryItem: FC<StoryItemProps> = ({ story }) => {
  const { t } = useTranslation();

  const colors = useColors();

  const dateStr = useMemo(() => {
    if (!story) return "";
    if (story.isLive) return t("common.status.live").toUpperCase();
    const d = Date.now() - story.createdAt.getTime();
    return t("common.time.ago", { time: formatMs(t, d) });
  }, [story, t]);

  return (
    <View
      style={[styles.root, { backgroundColor: colors.backgroundSecondary }]}
    >
      <ImageBackground
        source={
          story.image
            ? { uri: story.image }
            : require("@auralous/ui/assets/images/default_playlist.jpg")
        }
        defaultSource={require("@auralous/ui/assets/images/default_playlist.jpg")}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.top}>
            <Avatar
              href={story.creator.profilePicture}
              username={story.creator.username}
              size={12}
            />
          </View>
          <View style={styles.bottom}>
            <Text style={styles.text} bold size="xl">
              {story.creator.username}
            </Text>
            {Boolean(story.text) && (
              <Text
                style={[styles.text, styles.textSecondary]}
                numberOfLines={3}
              >
                {story.text}
              </Text>
            )}
            <View
              style={[
                styles.tag,
                {
                  backgroundColor: story.isLive
                    ? colors.primary
                    : "rgba(0,0,0,.5)",
                },
              ]}
            >
              <Text size="xs" style={{ color: "#ffffff" }}>
                {dateStr}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default StoryItem;
