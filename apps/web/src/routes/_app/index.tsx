import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { ChatInput } from "@/components/chat/chat-input";
import { setPendingMessage } from "@/lib/pending-message";

export const Route = createFileRoute("/_app/")({
  component: NewChatPage,
});

function NewChatPage() {
  const [input, setInput] = useState("");
  const navigate = Route.useNavigate();

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) {
      return;
    }

    const threadId = crypto.randomUUID();
    setPendingMessage(threadId, text);
    navigate({
      to: "/chat/$id",
      params: { id: threadId },
      search: (prev) => prev,
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-2 px-4 pb-12">
      <ChatEmptyState onSuggestion={setInput} />

      <div className="w-full">
        <ChatInput
          onChange={setInput}
          onStop={() => {}}
          onSubmit={handleSubmit}
          status="ready"
          value={input}
        />
      </div>
    </div>
  );
}
