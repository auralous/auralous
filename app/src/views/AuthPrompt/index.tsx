import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Size } from "@/styles/spacing";
import { useUIDispatch } from "@/ui-context";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  auth: {
    flex: 1,
    justifyContent: "center",
    padding: Size[6],
  },
});

export const AuthPrompt: FC<{ prompt: string }> = ({ prompt }) => {
  const { t } = useTranslation();
  const uiDispatch = useUIDispatch();
  return (
    <View style={styles.auth}>
      <Text align="center">{prompt}</Text>
      <Spacer y={4} />
      <Button
        variant="primary"
        onPress={() => uiDispatch({ type: "signIn", value: { visible: true } })}
      >
        {t("sign_in.title")}
      </Button>
    </View>
  );
};
