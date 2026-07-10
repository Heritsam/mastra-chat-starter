import type { DynamicToolUIPart, ToolUIPart, UIMessage } from "ai";

import { MessageInspector } from "@/components/chat/message-inspector";
import { Response } from "@/components/chat/response";
import { TextShimmer } from "@/components/loading-ui/text-shimmer";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";

type MessagePart = UIMessage["parts"][number];
type ToolPart = ToolUIPart | DynamicToolUIPart;
type TextPart = Extract<MessagePart, { type: "text" }>;
type ReasoningPart = Extract<MessagePart, { type: "reasoning" }>;

const isTextPart = (part: MessagePart): part is TextPart =>
  part.type === "text";
const isReasoningPart = (part: MessagePart): part is ReasoningPart =>
  part.type === "reasoning";
const isToolPart = (part: MessagePart): part is ToolPart =>
  part.type === "dynamic-tool" || part.type.startsWith("tool-");

const toolName = (part: ToolPart) =>
  part.type === "dynamic-tool"
    ? part.toolName
    : part.type.replace(/^tool-/, "");

export function MessageView({
  message,
  isStreaming,
}: {
  message: UIMessage;
  isStreaming: boolean;
}) {
  const isUser = message.role === "user";
  const textParts = message.parts.filter(isTextPart);

  // user
  if (isUser) {
    return (
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="default">
            <BubbleContent>
              {textParts.map((part, index) => (
                <Response key={`${message.id}-text-${index}`}>
                  {part.text}
                </Response>
              ))}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    );
  }

  const reasoning = message.parts
    .filter(isReasoningPart)
    .map((part) => part.text);
  const tools = message.parts.filter(isToolPart);
  const hasText = textParts.some((part) => part.text.trim().length > 0);
  const runningTool = tools.find(
    (part) =>
      part.state === "input-streaming" || part.state === "input-available",
  );
  const inspectable = reasoning.length + tools.length > 0;

  // agent
  return (
    <Message align="start">
      <MessageContent>
        <Bubble variant="ghost">
          <BubbleContent className="flex flex-col gap-2">
            {inspectable && (
              <MessageInspector reasoning={reasoning} tools={tools} />
            )}

            {textParts.map((part, index) => (
              <Response
                isStreaming={isStreaming}
                key={`${message.id}-text-${index}`}
              >
                {part.text}
              </Response>
            ))}

            {isStreaming && !hasText && (
              <TextShimmer>
                {runningTool
                  ? `Running ${toolName(runningTool)}…`
                  : "Thinking…"}
              </TextShimmer>
            )}
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}
