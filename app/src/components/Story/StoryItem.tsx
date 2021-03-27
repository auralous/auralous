import { format as formatMs } from "@lukeed/ms";
import { Spacer } from "components/Spacer";
import { Text } from "components/Typography";
import { Story, useUserQuery } from "gql/gql.gen";
import React, { useMemo } from "react";
import { View } from "react-native";
import { Size } from "styles";
import { useTranslation } from "utils/i18n";

const StoryItem: React.FC<{ story: Story }> = ({ story }) => {
  const { t } = useTranslation();

  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId },
  });

  const dateStr = useMemo(() => {
    const d = Date.now() - story.createdAt.getTime();
    return d ? formatMs(d) : "";
  }, [story]);

  const altText = `${t("story.ofUsername", {
    username: user?.username || "",
  })} - ${story.text}`;

  return (
    <View
      style={{ width: "100%" }}
      aria-label={`${t("story.play")}: ${altText}`}
    >
      <View style={{ padding: Size[2], width: "100%" }}>
        <Text bold align="left">
          {story.text}
        </Text>
        <Text color="textSecondary" align="left" size="sm">
          {story.isLive ? (
            <span className="font-bold bg-primary animate-pulse uppercase leading-none py-0.5 px-1 rounded-full">
              {t("common.live")}
            </span>
          ) : (
            <Text color="textSecondary">{dateStr} •</Text>
          )}
          <Spacer size={1} axis="horizontal" />
          <Text>{user?.username}</Text>
        </Text>
      </View>
    </View>
  );
};

export default StoryItem;
