import { Text } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import Config from "react-native-config";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
  },
  pressable: {
    padding: Size[3],
    borderRadius: 9999,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Size[1],
  },
  text: {
    marginLeft: Size[1],
  },
});

interface ContinueButtonProps {
  name: string;
  platform: "google" | "spotify";
  icon: JSX.Element;
  listenOn: string;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  name,
  platform,
  icon,
  listenOn,
}) => {
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <View>
      <Text color="textSecondary" align="center">
        {t("sign_in.listen_on", { name: listenOn })}
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          { opacity: pressed ? 0.75 : 1, backgroundColor: colors[platform] },
        ]}
        onPress={() =>
          Linking.openURL(`${Config.API_URI}/auth/${platform}?is_app_login=1`)
        }
      >
        {icon}
        <Text
          style={[
            styles.text,
            { color: colors[`${platform}Label` as keyof typeof colors] },
          ]}
          bold
        >
          {t("sign_in.continue_with", { name })}
        </Text>
      </Pressable>
    </View>
  );
};

export default ContinueButton;
