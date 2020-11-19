import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import ms from "ms";
import { useCurrentUser } from "~/hooks/user";
import {
  useMessagesQuery,
  useAddMessageMutation,
  useOnMessageAddedSubscription,
  Message,
  useUserQuery,
} from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";

const LIMIT = 10;
const GROUPED_TIME_DIFF = 10 * 60 * 1000; // within 10 min should be grouped

const MessageItem: React.FC<{
  message: Message;
  isGrouped: boolean;
}> = ({ message, isGrouped }) => {
  const user = useCurrentUser();
  const isCurrentUser = user?.id === message.creatorId;
  const dateDiff = Date.now() - message.createdAt;
  const dateDiffTxt = dateDiff < 1000 ? "Just now" : ms(dateDiff);
  const [{ data: { user: sender } = { user: undefined } }] = useUserQuery({
    variables: { id: message.creatorId },
  });

  return (
    <div
      role="listitem"
      className={`relative w-full pl-12 pr-8 hover:bg-background-secondary ${
        isGrouped ? "" : "mt-3"
      }`}
    >
      {!isGrouped && (
        <>
          <img
            className="absolute top-1 left-1 w-8 h-8 rounded-full object-cover"
            src={sender?.profilePicture}
            alt={sender?.username}
          />{" "}
          <div className="flex opacity-75 text-xs pt-1">
            <span
              className={`${
                isCurrentUser ? "bg-success-light rounded-lg px-1" : ""
              } text-white font-bold`}
            >
              {sender?.username || ""}
            </span>{" "}
            <span className="text-white opacity-75 ml-1">{dateDiffTxt}</span>
          </div>
        </>
      )}
      <p className="text-white text-sm leading-relaxed text-opacity-75">
        {message.text}
      </p>
    </div>
  );
};

const MessageList: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useI18n();

  const scrollShouldFollow = useRef(true);

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
    console.log(scrollShouldFollow.current);
    if (scrollShouldFollow.current)
      // Scroll to bottom
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight -
        messageListRef.current.offsetHeight;
  }, [messages]);

  const hasMore = useMemo(
    () => Boolean(data?.messages && data.messages.length >= LIMIT),
    [data]
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
        <button
          onClick={() => setOffset(messages.length)}
          disabled={fetching}
          className="button w-full text-xs p-1"
        >
          {t("message.loadOlder")}
        </button>
      )}
      {messages.map((message, index) => {
        // Whether message should be merged to previous
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const isGrouped =
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
      <MessageInput id={id} />
    </div>
  );
};

export default Messager;
