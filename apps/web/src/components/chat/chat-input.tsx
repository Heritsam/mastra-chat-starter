import type { ChatStatus } from "ai";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { type KeyboardEvent, useLayoutEffect, useRef, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const MAX_TEXTAREA_HEIGHT = 160;

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  status,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  status: ChatStatus;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMultiline, setIsMultiline] = useState(false);
  const isBusy = status === "submitted" || status === "streaming";
  const canSubmit = value.trim().length > 0;

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    const nextHeight = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";

    const styles = window.getComputedStyle(textarea);
    const singleLineHeight =
      Number.parseFloat(styles.lineHeight) +
      Number.parseFloat(styles.paddingTop) +
      Number.parseFloat(styles.paddingBottom);

    setIsMultiline(textarea.scrollHeight > Math.ceil(singleLineHeight) + 1);
  });

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
      <InputGroup
        className={cn(
          "rounded-full border-border bg-card shadow-xs has-[textarea]:rounded-full",
          isMultiline && "rounded-lg has-[textarea]:rounded-lg",
        )}
      >
        <InputGroupTextarea
          className="ml-2 max-h-40 min-h-0 leading-6"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about anything"
          ref={textareaRef}
          rows={1}
          value={value}
          autoFocus
        />
        <InputGroupAddon align={isMultiline ? "block-end" : "inline-end"}>
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
