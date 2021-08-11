import { imageSources } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Typography";
import { Colors, Size } from "@/styles";
import { format as formatMs } from "@/utils";
import { Story } from "@auralous/api";
import { FC, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, StyleSheet, View } from "react-native";

interface StoryItemProps {
  story: Story;
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
    paddingVertical: 3,
  },
  text: {
    color: Colors.white,
    lineHeight: 18,
  },
  textSecondary: {
    color: "rgba(255, 255, 255, 0.75)",
    lineHeight: 18,
  },
  top: {
    flex: 1,
  },
});

const StoryItem: FC<StoryItemProps> = ({ story }) => {
  const { t } = useTranslation();

  const dateStr = useMemo(() => {
    if (!story) return "";
    if (story.isLive) return t("common.status.live").toUpperCase();
    const d = Date.now() - story.createdAt.getTime();
    return t("common.time.ago", { time: formatMs(t, d) });
  }, [story, t]);

  return (
    <View style={styles.root}>
      <ImageBackground
        source={
          story.image ? { uri: story.image } : imageSources.defaultPlaylist
        }
        defaultSource={imageSources.defaultPlaylist}
        style={styles.background}
        accessible={false}
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
              <Text style={styles.textSecondary} numberOfLines={3}>
                {story.text}
              </Text>
            )}
            <View
              style={[
                styles.tag,
                story.isLive && { backgroundColor: Colors.primary },
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

export default memo(StoryItem);
