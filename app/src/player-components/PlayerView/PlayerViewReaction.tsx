import imageDefaultUser from "@/assets/images/default_user.jpg";
import { Dialog, useDialog } from "@/components/Dialog";
import { Image } from "@/components/Image";
import { ResultEmptyScreen } from "@/components/Result";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type {
  MeQuery,
  NowPlayingReactionItem,
  NowPlayingReactionsQuery,
} from "@auralous/api";
import {
  useMeQuery,
  useNowPlayingReactionsQuery,
  useNowPlayingReactionsUpdatedSubscription,
  useNowPlayingReactMutation,
} from "@auralous/api";
import type { FC, PropsWithChildren } from "react";
import { createContext, memo, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 9999,
    flexDirection: "row",
    height: Size[8],
    justifyContent: "center",
    width: Size[14],
  },
  buttonMainWrap: {
    marginLeft: Size[2],
  },
  buttonReacted: {
    backgroundColor: "rgba(255, 46, 84, 0.5)",
  },
  buttonText: {
    color: "#FFFFFF",
  },
  buttons: {
    borderBottomColor: Colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Size[4],
    paddingBottom: Size[4],
  },
  content: {
    height: 480,
    width: "100%",
  },
  list: {
    flex: 1,
  },
  listItem: {
    alignItems: "center",
    marginBottom: Size[12],
    width: "25%",
  },
  listItemContent: {
    alignItems: "center",
  },
  listItemImage: {
    borderRadius: 9999,
    height: Size[14],
    marginBottom: Size[2],
    width: Size[14],
  },
  listItemReaction: {
    alignItems: "center",
    bottom: 14,
    height: 20,
    justifyContent: "center",
    position: "absolute",
    right: -3,
    width: 20,
  },
});

/** Reaction calculation */
const getMyReaction = (
  dataAll: NowPlayingReactionsQuery | undefined,
  dataMe: MeQuery | undefined
): string | null => {
  const meId = dataMe?.me?.user.id;
  if (!meId) return null;
  if (!dataAll?.nowPlayingReactions) return null;
  return (
    dataAll.nowPlayingReactions.find((r) => r.userId === meId)?.reaction || null
  );
};
const getReactionCounts = (dataAll: NowPlayingReactionsQuery | undefined) => {
  if (!dataAll?.nowPlayingReactions) return { counts: {}, countTotal: 0 };
  const s: Record<string, number> = {};
  for (const reaction of dataAll.nowPlayingReactions) {
    if (!s[reaction.reaction]) s[reaction.reaction] = 0;
    s[reaction.reaction] += 1;
  }
  return { counts: s, countTotal: dataAll.nowPlayingReactions.length };
};
interface ReactionCalculationValue {
  mine: string | null;
  counts: Record<string, number>;
  countTotal: number;
}
const ReactionCalculationContext = createContext(
  {} as ReactionCalculationValue
);
export const useReactionCalculation = () =>
  useContext(ReactionCalculationContext);
const ReactionCalculationProvider: FC<
  PropsWithChildren<{
    id: string;
    dataAll: NowPlayingReactionsQuery | undefined;
  }>
> = ({ dataAll, children }) => {
  const [{ data: dataMe }] = useMeQuery();

  const value = useMemo(
    () => ({
      mine: getMyReaction(dataAll, dataMe),
      ...getReactionCounts(dataAll),
    }),
    [dataAll, dataMe]
  );
  return (
    <ReactionCalculationContext.Provider value={value}>
      {children}
    </ReactionCalculationContext.Provider>
  );
};

/** Reaction buttons */
const ReactionButton: FC<{
  reactionType: string | null;
  id: string;
  onLongPress?(): void;
}> = ({ reactionType, id, onLongPress }) => {
  const { t } = useTranslation();
  const { mine, counts, countTotal } = useReactionCalculation();
  const count = (reactionType ? counts[reactionType] : countTotal) || 0;
  const [, addReaction] = useNowPlayingReactMutation();
  const isReacted = useMemo(() => {
    if (!reactionType) return Boolean(mine);
    return mine === reactionType;
  }, [mine, reactionType]);
  const mutateReactionType = reactionType || "❤️";
  const onPress = useCallback(() => {
    if (mine !== mutateReactionType) {
      addReaction({
        id,
        reaction: mutateReactionType,
      });
    } else {
      addReaction({
        id,
        reaction: "",
      });
    }
  }, [mutateReactionType, mine, id, addReaction]);
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={`${t("now_playing_reaction.react_with", {
        reaction: mutateReactionType,
      })}: ${count}. ${
        onLongPress ? t("now_playing_reaction.long_tap_to_view") : ""
      }`}
      onLongPress={onLongPress}
      style={[styles.button, isReacted && styles.buttonReacted]}
    >
      <Text style={styles.buttonText}>{mutateReactionType}</Text>
      <Spacer x={1} />
      <Text bold style={styles.buttonText}>
        {count}
      </Text>
    </TouchableOpacity>
  );
};
const ReactionModalButtons: FC<{ id: string }> = ({ id }) => {
  return (
    <View style={styles.buttons}>
      <ReactionButton id={id} reactionType="❤️" />
      <Spacer x={2} />
      <ReactionButton id={id} reactionType="✨" />
      <Spacer x={2} />
      <ReactionButton id={id} reactionType="🔥" />
      <Spacer x={2} />
      <ReactionButton id={id} reactionType="😢" />
    </View>
  );
};

/** Reacted user */
const ReactionUserItem = memo<{ item: NowPlayingReactionItem }>(
  function ReactionUserItem({ item }) {
    return (
      <View style={styles.listItem}>
        <View style={styles.listItemContent}>
          <Image
            source={
              item.user?.profilePicture
                ? { uri: item.user.profilePicture }
                : imageDefaultUser
            }
            defaultSource={imageDefaultUser}
            style={styles.listItemImage}
          />
          <Text fontWeight="medium">{item.user?.username}</Text>
          <View style={styles.listItemReaction}>
            <Text>{item.reaction}</Text>
          </View>
        </View>
      </View>
    );
  }
);
const renderItem: ListRenderItem<NowPlayingReactionItem> = ({ item }) => {
  return <ReactionUserItem key={item.userId} item={item} />;
};

const ReactionModal: FC<{
  id: string;
  data: NowPlayingReactionsQuery | undefined;
}> = ({ id, data }) => {
  return (
    <View style={styles.content}>
      <ReactionModalButtons id={id} />
      <FlatList
        numColumns={4}
        style={styles.list}
        data={data?.nowPlayingReactions}
        renderItem={renderItem}
        ListEmptyComponent={ResultEmptyScreen}
      />
    </View>
  );
};

const PlayerViewReaction: FC<{ id: string }> = ({ id }) => {
  const { t } = useTranslation();

  const [{ data }] = useNowPlayingReactionsQuery({
    variables: { id },
  });
  useNowPlayingReactionsUpdatedSubscription({ variables: { id } });

  const [visible, present, dismiss] = useDialog();

  return (
    <ReactionCalculationProvider dataAll={data} id={id}>
      <View style={styles.buttonMainWrap}>
        <ReactionButton reactionType={null} id={id} onLongPress={present} />
      </View>
      <Dialog.Dialog visible={visible} onDismiss={dismiss}>
        <Dialog.Title>{t("now_playing_reaction.title")}</Dialog.Title>
        <Dialog.Content>
          <ReactionModal data={data} id={id} />
        </Dialog.Content>
      </Dialog.Dialog>
    </ReactionCalculationProvider>
  );
};

export default PlayerViewReaction;
