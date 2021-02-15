import { SvgLogIn, SvgMusic } from "assets/svg";
import { useModal } from "components/Modal";
import { Button } from "components/Pressable";
import { TrackMenu } from "components/Track";
import { Typography } from "components/Typography";
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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const LIMIT = 20;
const GROUPED_TIME_DIFF = 10 * 60 * 1000; // within 10 min should be grouped

const getDateDiffTxt = (createdAt: Date) => {
  const dateDiff = Date.now() - createdAt.getTime();
  return dateDiff < 1000 ? t("common.time.justNow") : ms(dateDiff);
};

const MessageItemJoin: React.FC<{
  message: Message;
}> = ({ message }) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: message.creatorId },
  });

  return (
    <div role="listitem" className="w-full text-left text-sm mt-3 p-1">
      <SvgLogIn className="inline w-6 h-6 mr-2 bg-foreground-backdrop p-1 rounded-full" />
      <span className="text-foreground-tertiary">
        {t("message.join.text", { username: user?.username || "" })}
      </span>{" "}
      <span className="text-foreground-tertiary opacity-50 ml-1">
        {"• "}
        {getDateDiffTxt(message.createdAt)}
      </span>
    </div>
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
    <div role="listitem" className="w-full flex text-sm mt-3 p-1">
      <SvgMusic className="flex-none w-6 h-6 mr-2 bg-foreground-backdrop p-1 rounded-full" />
      <div>
        <span className="text-foreground-tertiary">
          {t("message.play.text", { username: user?.username || "" })}
        </span>
        <span className="text-foreground-tertiary opacity-50 ml-1">
          {" • "}
          {getDateDiffTxt(message.createdAt)}
        </span>
        {track && (
          <button
            className="block font-bold opacity-75 text-inline-link text-left text-foreground leading-tight"
            onClick={show}
          >
            <Typography.Text emphasis>
              {track.artists.map(({ name }) => name).join(", ")}
            </Typography.Text>{" "}
            - {track.title}
          </button>
        )}
      </div>
      <TrackMenu id={message.text as string} active={active} close={close} />
    </div>
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
    <div
      role="listitem"
      className={`relative w-full pl-10 pr-8 ${isGrouped ? "" : "mt-3"}`}
    >
      {!isGrouped && (
        <>
          <img
            className="absolute top-1 left-1 w-8 h-8 rounded-full object-cover"
            src={sender?.profilePicture}
            alt={sender?.username}
          />{" "}
          <div className="flex items-center text-foreground text-opacity-75 pt-1">
            <Link href={`/user/${sender?.username}`}>
              <a
                className={`${
                  isCurrentUser
                    ? "bg-primary-light leading-tight text-opacity-75 rounded-lg px-1"
                    : "text-white"
                } text-sm font-bold`}
              >
                {sender?.username}
              </a>
            </Link>
            <span className="text-foreground-tertiary text-sm opacity-50 ml-1">
              {" • "}
              {getDateDiffTxt(message.createdAt)}
            </span>
          </div>
        </>
      )}
      <Typography.Paragraph paragraph={false} size="sm">
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
      className="relative flex-1 h-0 overflow-x-hidden overflow-y-auto p-4"
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
    <form
      autoComplete="off"
      onSubmit={handleSubmitMessage}
      className="flex items-center mb-2 px-2"
    >
      <input
        aria-label={t("message.inputLabel")}
        className="w-full input bg-background-secondary bg-opacity-50 border-none focus:bg-opacity-75"
        value={messageContent}
        onChange={(e) => setMessageList(e.target.value)}
      />
    </form>
  );
};

const Messenger: React.FC<{ id: string }> = ({ id }) => {
  return (
    <div className="h-full w-full flex flex-col justify-between">
      <MessageList id={id} />
      <MessageInput id={id} />
    </div>
  );
};

export default Messenger;
