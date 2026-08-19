// File objects aren't serializable, so unlike pending-message.ts this can't use
// sessionStorage. It relies on the SPA staying in the same JS context between the
// new-chat page and the thread page it navigates to.
const pendingFiles = new Map<string, File[]>();

export function setPendingFiles(threadId: string, files: File[]) {
  if (files.length > 0) {
    pendingFiles.set(threadId, files);
  }
}

export function takePendingFiles(threadId: string): File[] {
  const files = pendingFiles.get(threadId);
  pendingFiles.delete(threadId);
  return files ?? [];
}
