import { IconArrowRight, IconLogIn } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import type { InputRef } from "@/components/Input";
import { Input } from "@/components/Input";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import type { PlaybackContextMeta } from "@/player";
import { Size } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import type { Message } from "@auralous/api";
import {
  MessageType,
  useMeQuery,
  useMessageAddedSubscription,
  useMessageAddMutation,
  useMessagesQuery,
} from "@auralous/api";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { FlatList, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  auth: {
    flex: 1,
    justifyContent: "center",
    padding: Size[6],
  },
  content: {
    paddingTop: Size[1.5],
  },
  icon: {
    backgroundColor: "rgba(255, 255, 255, .1)",
    borderRadius: 9999,
    padding: Size[1],
  },
  input: {
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
  listItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginBottom: Size[4],
  },
  root: {
    flex: 1,
    padding: Size[6],
    paddingTop: Size[2],
  },
});

const ChatItemJoin: FC<{
  message: Message;
}> = ({ message }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.listItem}>
      <View style={styles.icon}>
        <IconLogIn width={18} height={18} />
      </View>
      <Spacer x={2} />
      <View style={styles.content}>
        <Text color="textSecondary">
          {t("chat.join", { username: message.creator.username })}
        </Text>
      </View>
    </View>
  );
};

const ChatItemText: FC<{
  message: Message;
}> = ({ message }) => {
  return (
    <View style={styles.listItem}>
      <Avatar
        size={6}
        username={message.creator.username}
        href={message.creator.profilePicture}
      />
      <Spacer x={2} />
      <View style={styles.content}>
        <Text>
          <Text bold>{message.creator.username}</Text>
          <Spacer x={2} />
          <Text color="text">{message.text}</Text>
        </Text>
      </View>
    </View>
  );
};

const renderItem: ListRenderItem<Message> = ({ item: message }) => {
  if (message.type === MessageType.Join)
    return <ChatItemJoin key={message.id} message={message} />;

  return <ChatItemText key={message.id} message={message} />;
};

const ChatList: FC<{ id: string }> = ({ id }) => {
  const ref = useRef<FlatList>(null);
  const scrollShouldFollow = useRef(true);

  const [offset, setOffset] = useState(0);
  const [{ data }] = useMessagesQuery({
    variables: { id, limit: 20, offset },
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

  const messages = useMemo(() => {
    const allMessages = Array.from(prevMessages || []);
    newMessages?.forEach((nM) => {
      // Filter out messages from new that already exist in prev
      if (!allMessages.some((m) => m.id === nM.id)) allMessages.push(nM);
    });
    return allMessages;
  }, [prevMessages, newMessages]);

  useEffect(() => {
    if (scrollShouldFollow.current && ref.current) {
      // Scrool to bottom
      ref.current.scrollToEnd();
    }
  }, [messages.length]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (event.nativeEvent.contentOffset.y <= 0) {
        // scroll is at top, try to load more
        setOffset(messages.length);
      }
    },
    [messages]
  );
  return (
    <FlatList
      ref={ref}
      style={styles.list}
      renderItem={renderItem}
      data={messages}
      onScroll={onScroll}
      removeClippedSubviews
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

  return (
    <View style={styles.inputContainer}>
      <Input
        ref={inputRef}
        onSubmit={onSend}
        accessibilityLabel={t("chat.input_label")}
        placeholder={t("chat.input_label")}
        style={styles.input}
      />
      <Button
        accessibilityLabel={t("chat.send_message")}
        icon={<IconArrowRight />}
        onPress={onSend}
        disabled={fetching}
      ></Button>
    </View>
  );
};

const ChatView: FC<{
  contextMeta: PlaybackContextMeta | null;
}> = ({ contextMeta }) => {
  const { t } = useTranslation();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const uiDispatch = useUiDispatch();
  const onUnauthenticated = useCallback(
    () => uiDispatch({ type: "signIn", value: { visible: true } }),
    [uiDispatch]
  );

  if (!contextMeta?.id) return null;

  if (!me)
    return (
      <View style={styles.auth}>
        <Text align="center">{t("chat.auth_prompt")}</Text>
        <Spacer y={4} />
        <Button variant="primary" onPress={onUnauthenticated}>
          {t("sign_in.title")}
        </Button>
      </View>
    );

  return (
    <View style={styles.root}>
      <ChatList id={contextMeta.id} />
      <ChatInput id={contextMeta.id} />
    </View>
  );
};

export default ChatView;
