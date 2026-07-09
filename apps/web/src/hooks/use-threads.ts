import { env } from "@agent-ts/env/web";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type MastraThread = {
  id: string;
  title?: string;
  resourceId: string;
  createdAt: string;
  updatedAt: string;
};

type ListThreadsResponse = {
  threads: MastraThread[];
};

function threadsUrl(agentId: string) {
  return `${env.VITE_SERVER_URL}/api/memory/threads?agentId=${encodeURIComponent(agentId)}`;
}

function threadUrl(agentId: string, threadId: string) {
  return `${env.VITE_SERVER_URL}/api/memory/threads/${encodeURIComponent(threadId)}?agentId=${encodeURIComponent(agentId)}`;
}

const titleGenerationWindowMs = 2 * 60 * 1000;

function isAwaitingGeneratedTitle(thread: MastraThread) {
  return (
    !thread.title &&
    Date.now() - new Date(thread.createdAt).getTime() < titleGenerationWindowMs
  );
}

export function useThreads(agentId: string, resourceId: string) {
  return useQuery({
    queryKey: ["threads", agentId, resourceId],
    queryFn: async () => {
      const response = await fetch(
        `${threadsUrl(agentId)}&resourceId=${encodeURIComponent(resourceId)}`,
      );

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data: ListThreadsResponse = await response.json();

      return data.threads;
    },
    enabled: Boolean(resourceId),
    // Mastra generates a thread's title asynchronously after the reply is
    // sent, so a freshly-created thread often shows up here title-less.
    // Poll until it arrives (or we give up after titleGenerationWindowMs).
    refetchInterval: (query) => {
      const threads = query.state.data;
      if (!threads?.some(isAwaitingGeneratedTitle)) {
        return false;
      }
      return 1500;
    },
  });
}

export function useRenameThread(agentId: string, resourceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      threadId,
      title,
    }: {
      threadId: string;
      title: string;
    }) => {
      const response = await fetch(threadUrl(agentId, threadId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data: MastraThread = await response.json();

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["threads", agentId, resourceId],
      });
    },
  });
}

export function useDeleteThread(agentId: string, resourceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (threadId: string) => {
      const response = await fetch(
        `${threadUrl(agentId, threadId)}&resourceId=${encodeURIComponent(resourceId)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data: { resule: string } = await response.json();

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["threads", agentId, resourceId],
      });
    },
  });
}
