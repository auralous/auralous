import React, { useState, useEffect, useRef, useMemo } from "react";
import ms from "ms";
import {
  FixedSizeList as List,
  ListChildComponentProps,
  areEqual,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useCurrentUser } from "~/hooks/user";
import {
  useMessagesQuery,
  useAddMessageMutation,
  useOnMessageAddedSubscription,
  Message,
  useUserQuery,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { SvgChevronDown } from "~/assets/svg";

const MessageItem: React.FC<{
  message: Message;
  style?: React.CSSProperties;
}> = ({ message, style }) => {
  const user = useCurrentUser();
  const isCurrentUser = user?.id === message.creatorId;
  const dateDiff = Date.now() - message.createdAt;
  const dateDiffTxt = dateDiff < 1000 ? "Just now" : ms(dateDiff);
  const [{ data: { user: sender } = { user: undefined } }] = useUserQuery({
    variables: { id: message.creatorId },
  });

  return (
    <div className="text-sm w-full" style={style}>
      <div className="opacity-75 text-xs">
        <span
          className={`${
            isCurrentUser ? "bg-success-light rounded-lg px-1" : ""
          } text-white font-bold`}
        >
          {sender?.username || ""}
        </span>
        {" • "}
        <span className="text-white opacity-75">{dateDiffTxt}</span>
      </div>
      <p className="text-white text-sm leading-tight text-opacity-75 truncate">
        {message.text}
      </p>
    </div>
  );
};

const MessageRow = React.memo<ListChildComponentProps>(function MessageRow({
  data,
  index,
  style,
}) {
  const { t } = useI18n();
  if (index === 0) {
    return (
      <div className="h-12">
        {data.hasMore ? (
          <button
            onClick={data.loadMore}
            disabled={data.fetching}
            className="button w-full text-sm p-2"
          >
            {t("message.loadOlder")}
          </button>
        ) : (
          <p className="h-12 flex flex-center p-4 text-foreground-tertiary">
            {t("message.welcomeMessage")}
          </p>
        )}
      </div>
    );
  }
  return (
    <MessageItem
      key={data.messages[index - 1].id}
      message={data.messages[index - 1]}
      style={style}
    />
  );
},
areEqual);

const LIMIT = 10;

const MessageList: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useI18n();

  const shouldScrollToBottom = useRef(true);

  const [isFollowing, setIsFollowing] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);

  const [offset, setOffset] = useState(0);

  const [{ data, fetching }] = useMessagesQuery({
    variables: { id, limit: LIMIT, offset },
  });

  useEffect(() => {
    if (!data?.messages?.length) return;
    setMessages((prevMessages) => [...data.messages, ...prevMessages]);
  }, [data]);

  useOnMessageAddedSubscription<Message[]>(
    { variables: { id } },
    (_, response) => {
      response.messageAdded.createdAt = new Date(
        response.messageAdded.createdAt
      );
      setMessages([...messages, response.messageAdded]);
      return [];
    }
  );

  useEffect(() => {
    setMessages([]);
  }, [id]);

  const messageListRef = useRef<List>(null);

  useEffect(() => {
    if (!messageListRef.current || !shouldScrollToBottom.current) return;
    if (!isFollowing) return;
    // The first item is the load more button
    messageListRef.current.scrollToItem(messages.length - 1 + 1);
  }, [isFollowing, messages]);

  const hasMore = useMemo(
    () => Boolean(data?.messages && data.messages.length >= LIMIT),
    [data]
  );

  const itemData = useMemo(() => {
    return {
      messages,
      fetching,
      loadMore: () => setOffset(messages.length),
      hasMore,
    };
  }, [messages, hasMore, fetching]);

  return (
    <div className="relative overflow-x-hidden overflow-y-auto p-4 w-full h-full flex flex-col">
      <AutoSizer defaultHeight={1} defaultWidth={1}>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={messages.length + 1}
            itemSize={48}
            itemData={itemData}
            ref={messageListRef}
            onScroll={({ scrollDirection }) =>
              !fetching &&
              scrollDirection === "backward" &&
              setIsFollowing(false)
            }
          >
            {MessageRow}
          </List>
        )}
      </AutoSizer>
      {!isFollowing && (
        <button
          title={t("message.loadLatest")}
          onClick={() => setIsFollowing(true)}
          className="button button-success p-1 w-6 h-6 absolute absolute-center top-auto bottom-2"
        >
          <SvgChevronDown />
        </button>
      )}
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
        placeholder={t("message.inputPlaceholder")}
        className="w-full input bg-background-secondary border-none focus:bg-background-tertiary"
        value={messageContent}
        onChange={(e) => setMessageList(e.target.value)}
      />
    </form>
  );
};

const Messager: React.FC<{ id: string }> = ({ id }) => {
  return (
    <div className="h-full w-full flex flex-col justify-between">
      <MessageList id={id} />
      <div className="flex-none">
        <MessageInput id={id} />
      </div>
    </div>
  );
};

export default Messager;
