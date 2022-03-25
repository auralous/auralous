import { IconArrowRight, IconLogIn } from "@/assets";
import { Button } from "@/components/Button";
import type { InputRef } from "@/components/Input";
import { Input } from "@/components/Input";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import type { PlaybackCurrentMeta } from "@/player";
import { Size } from "@/styles/spacing";
import { useTimeDiffFormatter } from "@/ui-context";
import { AuthPrompt } from "@/views/AuthPrompt";
import type { Message } from "@auralous/api";
import {
  MessageType,
  useMeQuery,
  useMessageAddedSubscription,
  useMessageAddMutation,
  useMessagesQuery,
} from "@auralous/api";
import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { FlatList, Keyboard, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  content: {
    borderRadius: 50,
    flex: 1,
    paddingVertical: Size[2],
  },
  contentSpecial: {
    padding: Size[1.5],
  },
  icon: {
    backgroundColor: "rgba(255, 255, 255, .1)",
    borderRadius: 9999,
    padding: Size[1],
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, .1)",
    flex: 1,
    marginRight: Size[1],
  },
  inputContainer: {
    flexDirection: "row",
  },
  list: {
    flex: 1,
    paddingHorizontal: Size[1],
  },
  listContent: {
    paddingHorizontal: Size[2],
  },
  listItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginBottom: Size[3],
  },
  root: {
    height: "100%",
    width: "100%",
  },
  textHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: Size[3],
  },
});

const ChatItemJoin = memo<{
  message: Message;
}>(function ChatItemJoin({ message }) {
  const { t } = useTranslation();
  return (
    <View style={styles.listItem}>
      <View style={styles.icon}>
        <IconLogIn width={18} height={18} />
      </View>
      <Spacer x={1} />
      <View style={[styles.content, styles.contentSpecial]}>
        <Text color="textSecondary">
          {t("chat.join", { username: message.creator.username })}
        </Text>
      </View>
    </View>
  );
});

const ChatItemText = memo<{ message: Message }>(function ChatItemText({
  message,
}) {
  const tdf = useTimeDiffFormatter();
  const timeDiffText = useMemo(() => tdf(message.createdAt), [tdf, message]);
  return (
    <View style={styles.listItem}>
      <View style={styles.content}>
        <View style={styles.textHead}>
          <Text bold>{message.creator.username}</Text>
          <Spacer x={2} />
          <Text size="sm" color="textTertiary">
            {timeDiffText}
          </Text>
        </View>
        <Text color="textSecondary" lineGapScale={1}>
          {message.text}
        </Text>
      </View>
    </View>
  );
});

const renderItem: ListRenderItem<Message> = ({ item: message }) => {
  if (message.type === MessageType.Join)
    return <ChatItemJoin key={message.id} message={message} />;

  return <ChatItemText key={message.id} message={message} />;
};

const LIMIT = 20;

const ChatList: FC<{ id: string }> = ({ id }) => {
  const ref = useRef<FlatList>(null);
  const scrollShouldFollow = useRef(true);

  const [next, setNext] = useState<string | undefined>();
  const [{ data }] = useMessagesQuery({
    variables: { id, limit: LIMIT, next },
    requestPolicy: "cache-and-network",
  });

  const prevMessages = data?.messages;

  const [{ data: newMessages }] = useMessageAddedSubscription<Message[]>(
    { variables: { id }, pause: !prevMessages },
    (prev = [], response) => {
      if (!response) return prev;
      return [
        ...prev,
        {
          ...response.messageAdded,
          createdAt: new Date(response.messageAdded.createdAt),
        },
      ];
    }
  );

  const displayingMessages = useMemo(() => {
    const allMessages = Array.from(prevMessages || []).reverse();
    newMessages?.forEach((nM) => {
      // Filter out messages from new that already exist in prev
      if (!allMessages.some((m) => m.id === nM.id)) allMessages.push(nM);
    });
    return allMessages;
  }, [prevMessages, newMessages]);

  const onContentSizeChange = useCallback(() => {
    if (scrollShouldFollow.current && ref.current) {
      // Scrool to bottom
      ref.current.scrollToEnd();
    }
  }, []);

  const prevScrollY = useRef(0);
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currScrollY = event.nativeEvent.contentOffset.y;
      if (currScrollY <= 0 && prevMessages?.length) {
        // scroll is at top, try to load more
        setNext(prevMessages[prevMessages.length - 1].id);
      }
      // autoscroll
      if (
        prevScrollY.current !== -1 &&
        currScrollY < prevScrollY.current - 10
      ) {
        // user scroll up, disable autoscroll
        scrollShouldFollow.current = false;
      }
      prevScrollY.current = currScrollY;
    },
    [prevMessages]
  );
  return (
    <FlatList
      ref={ref}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      renderItem={renderItem}
      data={displayingMessages}
      onScroll={onScroll}
      removeClippedSubviews
      onContentSizeChange={onContentSizeChange}
      onResponderEnd={() => (prevScrollY.current = -1)}
      onEndReached={() => (scrollShouldFollow.current = true)}
      onEndReachedThreshold={20}
    />
  );
};

const ChatInput: FC<{ id: string }> = ({ id }) => {
  const { t } = useTranslation();
  const inputRef = useRef<InputRef>(null);

  const [{ fetching }, addMessage] = useMessageAddMutation();

  const onSend = useCallback(async () => {
    if (!inputRef.current) return;
    const trimMsg = inputRef.current.value.trim();
    if (fetching || trimMsg.length === 0) return;
    addMessage({ id, text: trimMsg }).then(() => inputRef.current?.clear());
  }, [fetching, id, addMessage]);

  const [keyboardPadding, setKeyboardPadding] = useState(0);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardPadding(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardPadding(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View style={[styles.inputContainer, { paddingBottom: keyboardPadding }]}>
      <Input
        ref={inputRef}
        onSubmit={onSend}
        accessibilityLabel={t("chat.input_label")}
        placeholder={t("chat.input_label")}
        style={styles.input}
        blurOnSubmit={false}
      />
      <Button
        accessibilityLabel={t("chat.send_message")}
        icon={<IconArrowRight />}
        onPress={onSend}
        disabled={fetching}
        variant="text"
      />
    </View>
  );
};

const ChatView: FC<{
  currentMeta: PlaybackCurrentMeta | null;
}> = ({ currentMeta }) => {
  const { t } = useTranslation();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  if (!currentMeta?.id) return null;

  if (!me) return <AuthPrompt prompt={t("playlist_adder.auth_prompt")} />;

  return (
    <View style={styles.root}>
      <ChatList id={currentMeta.id} />
      <ChatInput id={currentMeta.id} />
    </View>
  );
};

export default ChatView;
