import { Avatar } from "components/Avatar";
import { Text } from "components/Typography";
import { Maybe, Story, User } from "gql/gql.gen";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Size } from "styles";

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
  },
});

const StoryItem: React.FC<StoryItemProps> = ({ story, creator }) => {
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
            <Text bold size="xl">
              {creator?.username}
            </Text>
            <Text color="textSecondary" numberOfLines={3}>
              {story?.text}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default StoryItem;
