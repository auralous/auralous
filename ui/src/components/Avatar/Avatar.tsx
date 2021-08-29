import { ImageSources } from "@/assets";
import { Colors, Size } from "@/styles";
import type { FC } from "react";
import { memo } from "react";
import { Image, StyleSheet, View } from "react-native";

interface AvatarProps {
  href?: string | null;
  username: string;
  size: keyof typeof Size;
}

const styles = StyleSheet.create({
  image: {
    height: "100%",
    resizeMode: "cover",
    width: "100%",
  },
  root: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 128,
    overflow: "hidden",
  },
});
const Avatar: FC<AvatarProps> = ({ href, username, size }) => {
  return (
    <View style={[styles.root, { width: Size[size], height: Size[size] }]}>
      <Image
        style={styles.image}
        source={href ? { uri: href } : ImageSources.defaultUser}
        defaultSource={ImageSources.defaultUser}
        accessibilityLabel={username}
      />
    </View>
  );
};

export default memo(Avatar);
