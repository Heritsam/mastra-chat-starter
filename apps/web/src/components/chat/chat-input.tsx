import type { ChatStatus } from "ai";
import { ArrowUpIcon, PaperclipIcon, SquareIcon, XIcon } from "lucide-react";
import { type KeyboardEvent, useRef } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  status,
  attachments = [],
  onAttach,
  onRemoveAttachment,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  status: ChatStatus;
  attachments?: File[];
  onAttach?: (files: File[]) => void;
  onRemoveAttachment?: (index: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isBusy = status === "submitted" || status === "streaming";
  const canSubmit = value.trim().length > 0 || attachments.length > 0;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (canSubmit && !isBusy) {
      onSubmit();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (canSubmit && !isBusy) {
        onSubmit();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {attachments.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {attachments.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs"
            >
              <span className="max-w-40 truncate font-medium">{file.name}</span>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onRemoveAttachment?.(index)}
                type="button"
              >
                <XIcon className="size-3" />
                <span className="sr-only">Remove {file.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <InputGroup className="rounded-2xl border-border bg-card shadow-xs">
        <InputGroupTextarea
          className="h-14 min-h-14 overflow-hidden px-4 py-3.5"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about anything"
          value={value}
          autoFocus
        />
        <InputGroupAddon align="block-end">
          {onAttach && (
            <>
              <input
                className="hidden"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  if (files.length > 0) {
                    onAttach(files);
                  }
                  event.target.value = "";
                }}
                ref={fileInputRef}
                type="file"
              />
              <InputGroupButton
                onClick={() => fileInputRef.current?.click()}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <PaperclipIcon />
                <span className="sr-only">Attach files</span>
              </InputGroupButton>
            </>
          )}
          <InputGroupButton
            className="ml-auto"
            disabled={!isBusy && !canSubmit}
            onClick={isBusy ? onStop : undefined}
            size="icon-sm"
            type={isBusy ? "button" : "submit"}
            variant="default"
          >
            {status === "submitted" ? (
              <Spinner />
            ) : isBusy ? (
              <SquareIcon />
            ) : (
              <ArrowUpIcon />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
