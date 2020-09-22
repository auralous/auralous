import React, { useState, useEffect, useRef } from "react";
import ms from "ms";
import {
  FixedSizeList as List,
  ListChildComponentProps,
  areEqual,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useCurrentUser } from "~/hooks/user";
import { useLogin } from "~/components/Auth/index";
import {
  useSendMessageMutation,
  useOnMessageAddedSubscription,
  Message,
} from "~/graphql/gql.gen";

const MessageItem: React.FC<{
  message: Message;
  style?: React.CSSProperties;
}> = ({ message, style }) => {
  const user = useCurrentUser();
  const isCurrentUser = user?.id === message.from.id;
  const dateDiff = Date.now() - message.createdAt;
  const dateDiffTxt = dateDiff < 1000 ? "Just now" : ms(dateDiff);
  return (
    <div className="pb-2" style={style}>
      <div
        className="p-2 text-sm rounded-lg flex w-full"
        style={
          isCurrentUser
            ? {
                background:
                  "linear-gradient(134deg, rgba(0, 112, 243, 0.38), transparent 60%)",
              }
            : undefined
        }
      >
        {!isCurrentUser && (
          <span className="flex-shrink-0 mr-2">
            <img
              src={message.from.photo}
              alt={message.from.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </span>
        )}
        <div>
          <div className="opacity-75 text-xs">
            {!isCurrentUser && (
              <>
                <span className="text-white font-bold">
                  {message.from.name}
                </span>
                {" • "}
              </>
            )}
            <span className="text-white opacity-75">{dateDiffTxt}</span>
          </div>
          <p className="text-white text-opacity-75">{message.message}</p>
        </div>
      </div>
    </div>
  );
};

const ChatRow = React.memo<ListChildComponentProps>(function ChatRow({
  data: messages,
  index,
  style,
}) {
  return (
    <MessageItem
      key={messages[index].id}
      message={messages[index]}
      style={style}
    />
  );
},
areEqual);

const ChatBox: React.FC<{ roomId: string }> = ({ roomId }) => {
  const shouldScrollToBottom = useRef(true);

  const [messages, setMessages] = useState<Message[]>([]);

  useOnMessageAddedSubscription<Message[]>(
    { variables: { roomId } },
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
  }, [roomId]);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  // scroll to bottom on new messages
  function onChatBoxScroll({
    currentTarget,
  }: React.UIEvent<HTMLDivElement, UIEvent>) {
    const isAtBottom = () =>
      currentTarget.scrollTop ===
      currentTarget.scrollHeight - currentTarget.offsetHeight;

    if (shouldScrollToBottom.current && !isAtBottom()) {
      shouldScrollToBottom.current = false;
    }

    if (!shouldScrollToBottom.current && isAtBottom()) {
      shouldScrollToBottom.current = true;
    }
  }

  useEffect(() => {
    if (!chatBoxRef.current) return;
    if (shouldScrollToBottom.current)
      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight - chatBoxRef.current.offsetHeight;
  }, [messages]);

  return (
    <div
      ref={chatBoxRef}
      className="overflow-x-hidden overflow-y-auto p-4 w-full h-full flex flex-col"
      onScroll={onChatBoxScroll}
    >
      <AutoSizer defaultHeight={1} defaultWidth={1}>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={messages.length}
            itemSize={60}
            itemData={messages}
          >
            {ChatRow}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

const ChatInput: React.FC<{ roomId: string }> = ({ roomId }) => {
  const user = useCurrentUser();
  const [messageContent, setMessageContent] = useState("");
  const [{ fetching }, submitMessage] = useSendMessageMutation();
  const [, openLogin] = useLogin();
  function handleSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimMsg = messageContent.trim();
    if (fetching || !trimMsg) return;
    submitMessage({ roomId, message: trimMsg }).then(() =>
      setMessageContent("")
    );
  }
  if (!user) {
    return (
      <div className="p-2">
        <button
          onClick={openLogin}
          type="button"
          className="button button-light p-4 rounded-lg opacity-75 w-full"
        >
          Join chat
        </button>
      </div>
    );
  }
  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmitMessage}
      className="flex items-center mb-2 px-2"
    >
      <input
        aria-label="Enter chat message"
        placeholder="Say something, I'm giving up on you 🎵"
        className="w-full opacity-75 outline-none text-white bg-white bg-opacity-10 p-4 rounded"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      />
    </form>
  );
};

const Chatbox: React.FC<{ roomId: string }> = ({ roomId }) => (
  <div className="h-full w-full flex flex-col justify-between">
    <ChatBox roomId={roomId} />
    <div className="flex-none">
      <ChatInput roomId={roomId} />
    </div>
  </div>
);

export default Chatbox;
