import { RotateCcwIcon } from "lucide-react";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Message, MessageContent } from "@/components/ui/message";

export function ErrorBubble({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  return (
    <Message align="start">
      <MessageContent>
        <Bubble variant="ghost">
          <BubbleContent className="flex flex-col gap-2">
            <p>
              Something went wrong while generating a response
              {error.message ? `: ${error.message}` : "."}
            </p>
            <Button
              className="self-start"
              onClick={onRetry}
              size="sm"
              variant="outline"
            >
              <RotateCcwIcon data-icon="inline-start" />
              Retry
            </Button>
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}
