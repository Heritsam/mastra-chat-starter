const storageKey = "mastra-chat-starter:resource-id";

export function getOrCreateResourceId(): string {
  const existing = localStorage.getItem(storageKey);

  if (existing) return existing;

  const id = crypto.randomUUID();

  localStorage.setItem(storageKey, id);

  return id;
}
