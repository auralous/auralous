import { Avatar } from "components/Avatar";
import { Text } from "components/Typography";
import { Maybe, Story, User } from "gql/gql.gen";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Size, useColors } from "styles";
import { format as formatMs } from "utils/ms";

interface StoryItemProps {
  story: Maybe<Story>;
  creator: Maybe<User>;
  loading?: boolean;
}

const styles = StyleSheet.create({
  root: {
    width: Size[44],
    height: Size[44] * 1.5625,
    backgroundColor: "red",
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
  },
  tag: {
    paddingHorizontal: Size[3],
    paddingVertical: 3,
    borderRadius: 99,
    flexGrow: 0,
    marginTop: Size[1],
  },
});

const StoryItem: React.FC<StoryItemProps> = ({ story, creator }) => {
  const { t } = useTranslation();

  const colors = useColors();

  const dateStr = useMemo(() => {
    if (!story) return "";
    if (story.isLive) return t("common.status.live").toUpperCase();
    const d = Date.now() - story.createdAt.getTime();
    return t("common.time.ago", { time: formatMs(t, d) });
  }, [story, t]);

  return (
    <View style={styles.root}>
      <ImageBackground source={{ uri: story?.image }} style={styles.background}>
        <View style={styles.overlay}>
          <View style={styles.top}>
            {creator && (
              <Avatar
                href={creator.profilePicture}
                username={creator.username}
                size={12}
              />
            )}
          </View>
          <View style={styles.bottom}>
            <Text style={styles.text} bold size="xl">
              {creator?.username}
            </Text>
            {Boolean(story?.text) && (
              <Text style={styles.text} color="textSecondary" numberOfLines={3}>
                {story?.text}
              </Text>
            )}
            <View
              style={[
                styles.tag,
                {
                  backgroundColor: story?.isLive
                    ? colors.primary
                    : "rgba(0,0,0,.5)",
                },
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

export default StoryItem;
