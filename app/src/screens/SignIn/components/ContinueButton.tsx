import { Colors, Size, Spacer, Text, ThemeColorKey } from "@auralous/ui";
import { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  Pressable,
  PressableStateCallbackType,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Config from "react-native-config";

interface ContinueButtonProps {
  name: string;
  platform: "google" | "spotify";
  icon: JSX.Element;
  listenOn: string;
}

const ContinueButton: FC<ContinueButtonProps> = ({
  name,
  platform,
  icon,
  listenOn,
}) => {
  const styles = useMemo<{ text: TextStyle; pressable: ViewStyle }>(
    () => ({
      text: {
        marginLeft: Size[1],
        color: Colors[`${platform}Label` as ThemeColorKey],
      },
      pressable: {
        padding: Size[3],
        borderRadius: 9999,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: Size[1],
        backgroundColor: Colors[platform],
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
  const doLogin = useCallback(
    () => Linking.openURL(`${Config.API_URI}/auth/${platform}?is_app_login=1`),
    [platform]
  );

  return (
    <View>
      <Text color="textSecondary" align="center">
        {t("sign_in.listen_on", { name: listenOn })}
      </Text>
      <Spacer y={2} />
      <Pressable style={style} onPress={doLogin}>
        {icon}
        <Text style={styles.text} bold>
          {t("sign_in.continue_with", { name })}
        </Text>
      </Pressable>
    </View>
  );
};

export default ContinueButton;
