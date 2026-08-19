import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { ChatInput } from "@/components/chat/chat-input";
import { setPendingFiles } from "@/lib/pending-files";
import { setPendingMessage } from "@/lib/pending-message";

export const Route = createFileRoute("/_app/")({
  component: NewChatPage,
});

function NewChatPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const navigate = Route.useNavigate();

  const handleSubmit = () => {
    const text = input.trim();
    if (!text && files.length === 0) {
      return;
    }

    const threadId = crypto.randomUUID();
    setPendingMessage(threadId, text);
    setPendingFiles(threadId, files);
    navigate({
      to: "/chat/$id",
      params: { id: threadId },
      search: (prev) => prev,
      viewTransition: true,
    });
  };

  return (
    <div className="fade-in-0 slide-in-from-bottom-1 mx-auto flex w-full max-w-3xl flex-1 animate-in flex-col items-center justify-center gap-2 px-4 pb-12 duration-200">
      <ChatEmptyState onSuggestion={setInput} />

      <div className="w-full [view-transition-name:chat-input]">
        <ChatInput
          attachments={files}
          onAttach={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
          onChange={setInput}
          onRemoveAttachment={(index) =>
            setFiles((prev) => prev.filter((_, i) => i !== index))
          }
          onStop={() => {}}
          onSubmit={handleSubmit}
          status="ready"
          value={input}
        />
      </div>
    </div>
  );
}
