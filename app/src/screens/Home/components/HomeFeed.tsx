import player from "@/player";
import { Size } from "@/styles/spacing";
import { SessionPager } from "@/views/SessionPager";
import { useSessionsQuery } from "@auralous/api";
import { useIsFocused } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  slider: {
    borderRadius: Size[4],
    flex: 1,
    overflow: "hidden",
  },
});

const limit = 10;

const HomeFeed: FC<{ isFollowing: boolean }> = ({ isFollowing }) => {
  const [next, setNext] = useState<undefined | string>();
  const [{ data }] = useSessionsQuery({
    variables: {
      limit,
      next,
      following: isFollowing,
    },
  });

  const isFocused = useIsFocused();

  const onSelected = useCallback(
    (index: number) => {
      if (!isFocused) return;
      if (!data?.sessions) return;
      const session = data.sessions[index];
      if (!session) return;
      player.playContext({
        id: session.id,
        shuffle: false,
        type: "session",
      });
      if (data.sessions.length > limit && data.sessions.length - index <= 2) {
        setNext(data.sessions[data.sessions.length - 1].id);
      }
    },
    [data?.sessions, isFocused]
  );

  return (
    <View style={styles.slider}>
      <SessionPager sessions={data?.sessions || []} onSelected={onSelected} />
    </View>
  );
};

export default HomeFeed;
