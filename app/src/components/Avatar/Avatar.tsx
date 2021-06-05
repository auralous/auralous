import { useColors } from "@/styles";
import { Size } from "@/styles/layout";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface AvatarProps {
  href?: string | null;
  username: string;
  size: keyof typeof Size;
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 128,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

const Avatar: React.FC<AvatarProps> = ({ href, username, size }) => {
  const colors = useColors();
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.backgroundSecondary,
          width: Size[size],
          height: Size[size],
        },
      ]}
    >
      <Image
        style={styles.image}
        source={
          href ? { uri: href } : require("@/assets/images/default_user.jpg")
        }
        defaultSource={require("@/assets/images/default_user.jpg")}
        accessibilityLabel={username}
      />
    </View>
  );
};

export default Avatar;
