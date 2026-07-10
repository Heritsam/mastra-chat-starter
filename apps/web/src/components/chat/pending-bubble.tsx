import { TextShimmer } from "@/components/loading-ui/text-shimmer";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";

export function PendingBubble() {
  return (
    <Message align="start">
      <MessageContent>
        <Bubble variant="ghost">
          <BubbleContent>
            <TextShimmer>Thinking…</TextShimmer>
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}
