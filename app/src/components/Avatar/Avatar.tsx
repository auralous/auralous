import imageDefaultUser from "@/assets/images/default_user.jpg";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
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
        source={href ? { uri: href } : imageDefaultUser}
        defaultSource={imageDefaultUser}
        accessibilityLabel={username}
      />
    </View>
  );
};

export default memo(Avatar);
