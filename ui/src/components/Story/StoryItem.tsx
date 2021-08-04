import { imageSources } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Typography";
import { makeStyles, Size } from "@/styles";
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
  text: {
    color: "#ffffff",
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

const useStyles = makeStyles((theme, isLive: boolean) => ({
  root: {
    width: Size[44],
    height: Size[44] * 1.5625,
    borderRadius: Size[2],
    overflow: "hidden",
    backgroundColor: theme.colors.backgroundSecondary,
  },
  tag: {
    paddingHorizontal: Size[3],
    paddingVertical: 3,
    borderRadius: 9999,
    flexGrow: 0,
    marginTop: Size[1],
    backgroundColor: isLive ? theme.colors.primary : "rgba(0,0,0,.5)",
  },
}));

const StoryItem: FC<StoryItemProps> = ({ story }) => {
  const { t } = useTranslation();

  const dstyles = useStyles(story.isLive);

  const dateStr = useMemo(() => {
    if (!story) return "";
    if (story.isLive) return t("common.status.live").toUpperCase();
    const d = Date.now() - story.createdAt.getTime();
    return t("common.time.ago", { time: formatMs(t, d) });
  }, [story, t]);

  return (
    <View style={dstyles.root}>
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
            <View style={dstyles.tag}>
              <Text size="xs">{dateStr}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default memo(StoryItem);
