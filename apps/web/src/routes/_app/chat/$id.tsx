import { useChat } from "@ai-sdk/react";
import { env } from "@repo/env/web";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useState } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { ErrorBubble } from "@/components/chat/error-bubble";
import { MessageView } from "@/components/chat/message-view";
import { PendingBubble } from "@/components/chat/pending-bubble";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { useResourceId } from "@/hooks/use-resource-id";
import { threadMessagesQueryOptions } from "@/hooks/use-thread-messages";
import { takePendingMessage } from "@/lib/pending-message";

export const Route = createFileRoute("/_app/chat/$id")({
  loaderDeps: ({ search }) => ({ agentId: search.agent }),
  loader: async ({ context, params, deps }) => {
    await context.queryClient.ensureQueryData(
      threadMessagesQueryOptions(deps.agentId, params.id),
    );
  },
  component: ChatPage,
});

function ChatPage() {
  const { id: threadId } = Route.useParams();

  return <ChatThread key={threadId} threadId={threadId} />;
}

function ChatThread({ threadId }: { threadId: string }) {
  const { agent: agentId } = Route.useSearch();
  const { data: initialMessages } = useSuspenseQuery(
    threadMessagesQueryOptions(agentId, threadId),
  );
  const resourceId = useResourceId();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${env.VITE_SERVER_URL}/chat/${agentId}`,
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages: [messages[messages.length - 1]],
            memory: { thread: threadId, resource: resourceId },
          },
        }),
      }),
    [threadId, resourceId, agentId],
  );

  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onFinish: () => {
      queryClient.invalidateQueries({
        queryKey: ["threads", agentId, resourceId],
      });
    },
    onError: (err) => {
      console.error("Chat stream error:", err);
    },
  });

  useEffect(() => {
    const pending = takePendingMessage(threadId);
    if (pending) {
      sendMessage({ text: pending });
    }
  }, [threadId, sendMessage]);

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) {
      return;
    }
    sendMessage({ text });
    setInput("");
  };

  return (
    <>
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto w-full max-w-3xl px-4 pt-6 pb-10">
              {messages.map((message, index) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={message.id}
                  scrollAnchor={message.role === "user"}
                  className="fade-in-0 slide-in-from-bottom-1 animate-in duration-200"
                >
                  <MessageView
                    isStreaming={
                      status === "streaming" && index === messages.length - 1
                    }
                    message={message}
                  />
                </MessageScrollerItem>
              ))}
              {status === "submitted" && (
                <MessageScrollerItem
                  messageId="pending"
                  className="fade-in-0 slide-in-from-bottom-1 animate-in duration-200"
                >
                  <PendingBubble />
                </MessageScrollerItem>
              )}
              {status === "error" && error && (
                <MessageScrollerItem
                  messageId="error"
                  className="fade-in-0 slide-in-from-bottom-1 animate-in duration-200"
                >
                  <ErrorBubble error={error} onRetry={() => regenerate()} />
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4 [view-transition-name:chat-input]">
        <ChatInput
          onChange={setInput}
          onStop={stop}
          onSubmit={handleSubmit}
          status={status}
          value={input}
        />
      </div>
    </>
  );
}
