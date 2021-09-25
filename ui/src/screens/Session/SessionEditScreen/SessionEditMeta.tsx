import type { InputRef } from "@/components";
import { Button, Input, Spacer, Text, toast } from "@/components";
import { Size } from "@/styles";
import type { LocationInput, Session } from "@auralous/api";
import { useSessionUpdateMutation } from "@auralous/api";
import type { FC } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  content: { flex: 1, padding: Size[4] },
  contentContainer: {
    alignItems: "center",
  },
  item: { marginBottom: Size[8], width: "100%" },
});

export const SessionEditMeta: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();
  const [{ fetching }, sessionUpdate] = useSessionUpdateMutation();

  const textRef = useRef<InputRef>(null);

  useEffect(() => {
    textRef.current?.setValue(session.text);
  }, [session]);

  const onSubmit = useCallback(async () => {
    const location: LocationInput | null = null;
    const result = await sessionUpdate({
      id: session.id,
      text: textRef.current?.value || session.text,
      location,
    });
    if (!result.error) {
      toast.success(t("session_edit.updated"));
    }
  }, [session, sessionUpdate, t]);

  return (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.item}>
        <Text align="center" bold>
          {t("session.text")}
        </Text>
        <Spacer y={4} />
        <Input
          ref={textRef}
          accessibilityLabel={t("session.text")}
          defaultValue={session.text}
        />
      </View>
      <Spacer y={4} />
      <Button variant="primary" disabled={fetching} onPress={onSubmit}>
        {t("common.action.save")}
      </Button>
    </ScrollView>
  );
};
