import { env } from "@repo/env/web";
import { queryOptions } from "@tanstack/react-query";
import type { UIMessage } from "ai";

type ThreadMessagesResponse = {
  uiMessages: UIMessage[];
};

async function fetchThreadMessages(agentId: string, threadId: string) {
  const response = await fetch(
    `${env.VITE_SERVER_URL}/threads/${encodeURIComponent(threadId)}/messages?agentId=${encodeURIComponent(agentId)}`,
  );

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  const data: ThreadMessagesResponse = await response.json();

  return data.uiMessages;
}

export function threadMessagesQueryOptions(agentId: string, threadId: string) {
  return queryOptions({
    queryKey: ["thread-messages", agentId, threadId],
    queryFn: () => fetchThreadMessages(agentId, threadId),
  });
}
