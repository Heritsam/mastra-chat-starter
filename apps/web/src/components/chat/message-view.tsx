import type { DynamicToolUIPart, ToolUIPart, UIMessage } from "ai";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { MessageInspector } from "@/components/chat/message-inspector";
import { Response } from "@/components/chat/response";
import { TextShimmer } from "@/components/loading-ui/text-shimmer";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
    <Message align="start" className="group">
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

            {hasText && !isStreaming && (
              <div className="flex translate-y-0 opacity-100 transition-[opacity,transform] duration-150 ease-out starting:translate-y-1 starting:opacity-0 motion-reduce:duration-0">
                <Tooltip>
                  <TooltipTrigger
                    render={<Button variant="ghost" size="icon-sm" />}
                  >
                    <Copy className="size-4 text-transparent transition-colors group-hover:text-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Copy</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={<Button variant="ghost" size="icon-sm" />}
                  >
                    <ThumbsUp className="size-4 text-transparent transition-colors group-hover:text-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Good response</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={<Button variant="ghost" size="icon-sm" />}
                  >
                    <ThumbsDown className="size-4 text-transparent transition-colors group-hover:text-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Bad response</TooltipContent>
                </Tooltip>
              </div>
            )}
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}
