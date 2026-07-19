import { Link, useMatch, useNavigate } from "@tanstack/react-router";
import {
  CloudLightning,
  Loader2Icon,
  MessageCircle,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useResourceId } from "@/hooks/use-resource-id";
import {
  type MastraThread,
  useDeleteThread,
  useRenameThread,
  useThreads,
} from "@/hooks/use-threads";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

export default function ThreadList() {
  const resourceId = useResourceId();
  const navigate = useNavigate({ from: "/" });
  const match = useMatch({ from: "/_app/chat/$id", shouldThrow: false });
  const selectedThreadId = match?.params.id;

  const { data: threads, status } = useThreads(resourceId);
  const renameThread = useRenameThread(resourceId);
  const deleteThread = useDeleteThread(resourceId);

  const handleDelete = (threadId: string) => {
    deleteThread.mutate(threadId);
    if (threadId === selectedThreadId) {
      navigate({ to: "/", search: (prev) => prev });
    }
  };

  return (
    <SidebarMenu>
      {status === "pending" && (
        <>
          <SidebarMenuItem>
            <Skeleton className="flex h-9 w-full items-center gap-2 rounded-full px-3 py-2 text-sm">
              <Loader2Icon className="size-4.5 animate-spin" />
              Loading…
            </Skeleton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Skeleton className="h-9 w-full rounded-full bg-muted/30" />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Skeleton className="h-9 w-full rounded-full bg-muted/10" />
          </SidebarMenuItem>
        </>
      )}

      {status === "error" && (
        <SidebarMenuItem>
          <span className="flex items-center gap-2 px-3 py-1.5 text-rose-400">
            <CloudLightning className="size-4" />
            Failed to load chats
          </span>
        </SidebarMenuItem>
      )}

      {status === "success" &&
        threads.map((thread) => (
          <ThreadRow
            key={thread.id}
            thread={thread}
            isActive={thread.id === selectedThreadId}
            onRename={(title) =>
              renameThread.mutate({ threadId: thread.id, title })
            }
            onDelete={() => handleDelete(thread.id)}
          />
        ))}
    </SidebarMenu>
  );
}

function ThreadRow({
  thread,
  isActive,
  onRename,
  onDelete,
}: {
  thread: MastraThread;
  isActive: boolean;
  onRename: (title: string) => void;
  onDelete: () => void;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [title, setTitle] = useState(thread.title ?? "");

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        render={
          <Link
            from="/"
            to="/chat/$id"
            params={{ id: thread.id }}
            search={(prev) => prev}
          />
        }
      >
        <MessageCircle />
        <span className="truncate">{thread.title || "New chat"}</span>
      </SidebarMenuButton>

      <DropdownMenu>
        <DropdownMenuTrigger render={<SidebarMenuAction showOnHover />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem
            onClick={() => {
              setTitle(thread.title ?? "");
              setIsRenaming(true);
            }}
          >
            <PencilIcon />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
          </DialogHeader>

          <Input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <DialogFooter className="mt-4">
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              onClick={() => {
                onRename(title);
                setIsRenaming(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  );
}
