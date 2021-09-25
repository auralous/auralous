/* eslint-disable react-native/no-unused-styles */
import type { ThemeColorKey } from "@auralous/ui";
import { Colors, Size, Spacer, Text } from "@auralous/ui";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type {
  PressableStateCallbackType,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Pressable, StyleSheet, View } from "react-native";

interface ContinueButtonProps {
  name: string;
  platform: "google" | "spotify";
  icon: JSX.Element;
  listenOn: string;
  onSignIn: (platform: "google" | "spotify") => void;
}

const ContinueButton: FC<ContinueButtonProps> = ({
  name,
  platform,
  icon,
  listenOn,
  onSignIn,
}) => {
  const styles = useMemo<{ text: TextStyle; pressable: ViewStyle }>(
    () =>
      StyleSheet.create({
        pressable: {
          alignItems: "center",
          backgroundColor: Colors[platform],
          borderRadius: 9999,
          flexDirection: "row",
          justifyContent: "center",
          marginTop: Size[1],
          padding: Size[3],
        },
        text: {
          color: Colors[`${platform}Label` as ThemeColorKey],
          marginLeft: Size[1],
        },
      }),
    [platform]
  );

  const { t } = useTranslation();
  const style = useCallback(
    ({ pressed }: PressableStateCallbackType) => [
      styles.pressable,
      { opacity: pressed ? 0.75 : 1 },
    ],
    [styles]
  );

  return (
    <View>
      <Text color="textSecondary" align="center" size="sm">
        {t("sign_in.listen_on", { name: listenOn })}
      </Text>
      <Spacer y={2} />
      <Pressable style={style} onPress={() => onSignIn(platform)}>
        {icon}
        <Text style={styles.text} bold>
          {t("sign_in.continue_with", { name })}
        </Text>
      </Pressable>
    </View>
  );
};

export default ContinueButton;
