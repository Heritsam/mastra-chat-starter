const prefix = "mastra-chat-starter:pending-message:";

export function setPendingMessage(threadId: string, text: string) {
  sessionStorage.setItem(prefix + threadId, text);
}

export function takePendingMessage(threadId: string): string | null {
  const key = prefix + threadId;
  const value = sessionStorage.getItem(key);

  if (value !== null) {
    sessionStorage.removeItem(key);
  }

  return value;
}
