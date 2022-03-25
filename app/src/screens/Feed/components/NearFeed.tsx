import { Text } from "@/components/Typography";
import { SessionFeed } from "@/views/SessionFeed";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { styles } from "./styles";

const NearFeed: FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <Text color="textSecondary" style={styles.description}>
        (WIP) {t("feed.near.description")}
      </Text>
      <SessionFeed contentContainerStyle={styles.content} />
    </View>
  );
};

export default NearFeed;
