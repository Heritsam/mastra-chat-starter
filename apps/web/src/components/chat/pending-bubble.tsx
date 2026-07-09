import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";

export function PendingBubble() {
  return (
    <Message align="start">
      <MessageContent>
        <Bubble align="start" variant="muted">
          <BubbleContent>
            <span className="flex items-center gap-1 py-1">
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
            </span>
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}
