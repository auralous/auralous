import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Link from "next/link";
import ms from "ms";
import { useModal } from "~/components/Modal";
import { TrackMenu } from "~/components/Track";
import { useCurrentUser } from "~/hooks/user";
import {
  useMessagesQuery,
  useAddMessageMutation,
  useOnMessageAddedSubscription,
  Message,
  useUserQuery,
  MessageType,
  useTrackQuery,
} from "~/graphql/gql.gen";
import { t, useI18n } from "~/i18n/index";
import { SvgMusic, SvgLogIn } from "~/assets/svg";

const LIMIT = 20;
const GROUPED_TIME_DIFF = 10 * 60 * 1000; // within 10 min should be grouped

const MessageItemJoin: React.FC<{
  message: Message;
}> = ({ message }) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: message.creatorId },
  });
  const dateDiff = Date.now() - message.createdAt;
  const dateDiffTxt = dateDiff < 1000 ? "Just now" : ms(dateDiff);
  return (
    <div role="listitem" className="w-full text-left text-sm mt-3 p-1">
      <SvgLogIn className="inline w-6 h-6 mr-2 bg-foreground-backdrop p-1 rounded-full" />
      <span className="text-foreground-tertiary">
        {t("message.join.text", { username: user?.username || "" })}
      </span>{" "}
      <span className="text-foreground-tertiary opacity-50 ml-1">
        {"• "}
        {dateDiffTxt}
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
  const dateDiff = Date.now() - message.createdAt;
  const dateDiffTxt = dateDiff < 1000 ? "Just now" : ms(dateDiff);
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
          {dateDiffTxt}
        </span>
        {track && (
          <button
            className="block font-semibold opacity-75 text-inline-link text-left text-foreground leading-tight"
            onClick={show}
          >
            <i>{track.artists.map(({ name }) => name).join(", ")}</i> -{" "}
            {track.title}
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
                    ? "bg-success-light leading-tight text-opacity-75 rounded-lg px-1"
                    : "text-white"
                } text-sm font-bold`}
              >
                {sender?.username}
              </a>
            </Link>
            <span className="text-foreground-tertiary text-sm opacity-50 ml-1">
              {" • "}
              {dateDiffTxt}
            </span>
          </div>
        </>
      )}
      <p className="text-white leading-tight text-sm text-opacity-75">
        {message.text}
      </p>
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
      response.messageAdded.createdAt = new Date(
        response.messageAdded.createdAt
      );
      return [...prev, response.messageAdded];
    }
  );

  const messages = useMemo(
    () => [...(prevMessages || []), ...(newMessages || [])],
    [prevMessages, newMessages]
  );

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
        <button
          onClick={() => setOffset(messages.length)}
          disabled={fetching}
          className="btn btn-transparent bg-foreground-backdrop w-full text-xs p-1"
        >
          {t("message.loadOlder")}
        </button>
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
        placeholder={t("message.inputPlaceholder")}
        className="w-full input bg-background-secondary border-none focus:bg-background-tertiary"
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
