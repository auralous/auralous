import { Text } from "@/components/Typography";
import { SessionFeed } from "@/views/SessionFeed";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { styles } from "./styles";

const FollowingFeed: FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <Text color="textSecondary" style={styles.description}>
        {t("feed.following.description")}
      </Text>
      <SessionFeed following contentContainerStyle={styles.content} />
    </View>
  );
};

export default FollowingFeed;
