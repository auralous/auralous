import { SvgLogIn, SvgMusic } from "assets/svg";
import { Input } from "components/Form";
import { useModal } from "components/Modal";
import { Button, PressableHighlight } from "components/Pressable";
import { TrackMenu } from "components/Track";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import {
  Message,
  MessageType,
  useAddMessageMutation,
  useMessagesQuery,
  useOnMessageAddedSubscription,
  useTrackQuery,
  useUserQuery,
} from "gql/gql.gen";
import { useMe } from "hooks/user";
import { t, useI18n } from "i18n/index";
import ms from "ms";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const LIMIT = 20;
const GROUPED_TIME_DIFF = 10 * 60 * 1000; // within 10 min should be grouped

const getDateDiffTxt = (createdAt: Date) => {
  const dateDiff = Date.now() - createdAt.getTime();
  return dateDiff < 1000 ? t("common.time.justNow") : ms(dateDiff);
};

const MessageItemSpecial: React.FC<{
  text: React.ReactNode;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  createdAt: Date;
}> = ({ text, Icon, createdAt }) => (
  <div role="listitem" className="w-full text-left p-1">
    <Box row alignItems="center" gap="xs">
      <Icon className="inline w-6 h-6 bg-foreground-backdrop p-1 rounded-full" />
      <Typography.Text color="foregroundTertiary" size="sm">
        {text}
      </Typography.Text>
      <Typography.Text color="foregroundTertiary">{" • "}</Typography.Text>
      <Typography.Text color="foregroundTertiary" size="sm">
        {getDateDiffTxt(createdAt)}
      </Typography.Text>
    </Box>
  </div>
);

const MessageItemJoin: React.FC<{
  message: Message;
}> = ({ message }) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: message.creatorId },
  });

  return (
    <MessageItemSpecial
      text={t("message.join.text", { username: user?.username || "" })}
      Icon={SvgLogIn}
      createdAt={message.createdAt}
    />
  );
};

const MessageItemPlay: React.FC<{
  message: Message;
}> = ({ message }) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: message.creatorId },
  });
  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id: message.text || "" },
    pause: !message.text,
  });
  const [active, show, close] = useModal();
  return (
    <Box alignItems="start">
      <MessageItemSpecial
        text={<>{t("message.play.text", { username: user?.username || "" })}</>}
        Icon={SvgMusic}
        createdAt={message.createdAt}
      />
      {track && (
        <>
          <PressableHighlight onPress={show}>
            <Typography.Paragraph noMargin>
              <Typography.Text size="xs" emphasis>
                {track.artists.map(({ name }) => name).join(", ")}
              </Typography.Text>{" "}
              - <Typography.Text size="xs">{track.title}</Typography.Text>
            </Typography.Paragraph>
          </PressableHighlight>
          <TrackMenu
            id={message.text as string}
            active={active}
            close={close}
          />
        </>
      )}
    </Box>
  );
};

const MessageItem: React.FC<{
  message: Message;
  isGrouped: boolean;
}> = ({ message, isGrouped }) => {
  const me = useMe();
  const isCurrentUser = me?.user.id === message.creatorId;

  const [{ data: { user: sender } = { user: undefined } }] = useUserQuery({
    variables: { id: message.creatorId },
  });

  return (
    <div role="listitem" className="relative w-full pl-10 pr-8">
      {!isGrouped && (
        <>
          <img
            className="absolute top-1 left-1 w-8 h-8 rounded-full object-cover"
            src={sender?.profilePicture}
            alt={sender?.username}
          />{" "}
          <Box row alignItems="center" gap="xs">
            <Link href={`/user/${sender?.username}`}>
              <Typography.Link
                size="sm"
                strong
                color={isCurrentUser ? "primary" : "foreground-secondary"}
              >
                {sender?.username}
              </Typography.Link>
            </Link>
            <Typography.Text color="foregroundTertiary">
              {" • "}
            </Typography.Text>
            <Typography.Text size="sm" color="foregroundTertiary">
              {getDateDiffTxt(message.createdAt)}
            </Typography.Text>
          </Box>
        </>
      )}
      {isGrouped && <div className="-mt-3" />}
      <Typography.Paragraph noMargin size="sm">
        {message.text}
      </Typography.Paragraph>
    </div>
  );
};

const MessageList: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useI18n();

  const scrollShouldFollow = useRef(true);

  const [offset, setOffset] = useState(0);

  const [
    { data: { messages: prevMessages } = { messages: undefined }, fetching },
  ] = useMessagesQuery({
    variables: { id, limit: LIMIT, offset },
    requestPolicy: "cache-and-network",
  });

  const [{ data: newMessages }] = useOnMessageAddedSubscription<Message[]>(
    { variables: { id }, pause: !prevMessages },
    (prev = [], response) => {
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

  const messageListRef = useRef<HTMLDivElement>(null);

  // Handle scroll and follow
  const onScroll = useCallback(
    ({ currentTarget }: React.UIEvent<HTMLDivElement, UIEvent>) => {
      // Should unfollow if scroll up and follow again if scroll back to bottom
      scrollShouldFollow.current =
        currentTarget.scrollTop >=
        currentTarget.scrollHeight - currentTarget.offsetHeight;
    },
    []
  );

  useEffect(() => {
    if (!messageListRef.current) return;
    if (scrollShouldFollow.current)
      // Scroll to bottom
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight -
        messageListRef.current.offsetHeight;
  }, [messages]);

  const hasMore = useMemo(
    () => offset < (prevMessages?.length || 0) + (newMessages?.length || 0),
    [prevMessages, newMessages, offset]
  );

  return (
    <div
      className="relative flex-1 min-h-0 overflow-x-hidden overflow-y-auto p-4 space-y-4"
      onScroll={onScroll}
      ref={messageListRef}
      aria-label={t("message.listLabel", { name: "" })}
      role="log"
      aria-live="off"
    >
      {hasMore && (
        <Button
          onPress={() => setOffset(messages.length)}
          disabled={fetching}
          fullWidth
          title={t("message.loadOlder")}
          size="xs"
        />
      )}
      {messages.map((message, index) => {
        if (message.type === MessageType.Play)
          return <MessageItemPlay key={message.id} message={message} />;

        if (message.type === MessageType.Join)
          return <MessageItemJoin key={message.id} message={message} />;

        // Whether message should be merged to previous
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const isGrouped =
          prevMessage?.type === MessageType.Message &&
          prevMessage?.creatorId === message.creatorId &&
          message.createdAt.getTime() - prevMessage.createdAt.getTime() <
            GROUPED_TIME_DIFF;
        return (
          <MessageItem
            key={message.id}
            message={message}
            isGrouped={isGrouped}
          />
        );
      })}
    </div>
  );
};

const MessageInput: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useI18n();
  const [messageContent, setMessageList] = useState("");
  const [{ fetching }, addMessage] = useAddMessageMutation();
  function handleSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimMsg = messageContent.trim();
    if (fetching || !trimMsg) return;
    addMessage({ id, text: trimMsg }).then(() => setMessageList(""));
  }
  return (
    <form autoComplete="off" onSubmit={handleSubmitMessage}>
      <Box row alignItems="center" padding="sm">
        <Input
          accessibilityLabel={t("message.inputLabel")}
          fullWidth
          value={messageContent}
          onChangeText={setMessageList}
        />
      </Box>
    </form>
  );
};

const Messenger: React.FC<{ id: string }> = ({ id }) => {
  return (
    <Box fullWidth fullHeight justifyContent="between">
      <MessageList id={id} />
      <MessageInput id={id} />
    </Box>
  );
};

export default Messenger;
