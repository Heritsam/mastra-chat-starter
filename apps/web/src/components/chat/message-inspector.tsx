import type { DynamicToolUIPart, ToolUIPart } from "ai";
import { Brain, SearchIcon, WrenchIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Response } from "@/components/chat/response";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

type ToolPart = ToolUIPart | DynamicToolUIPart;

const STATUS_LABELS: Partial<Record<ToolPart["state"], string>> = {
  "input-streaming": "Pending",
  "input-available": "Running",
  "output-available": "Completed",
  "output-error": "Error",
  "approval-requested": "Awaiting approval",
  "approval-responded": "Responded",
  "output-denied": "Denied",
};

const toJsonBlock = (value: unknown) =>
  `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;

const toolName = (part: ToolPart) =>
  part.type === "dynamic-tool"
    ? part.toolName
    : part.type.replace(/^tool-/, "");

function InspectorItem({
  value,
  trigger,
  children,
}: {
  value: string;
  trigger: ReactNode;
  children: ReactNode;
}) {
  return (
    <AccordionItem
      className="rounded-3xl not-last:border-b-0 border-none"
      value={value}
    >
      <Card className="gap-0 p-0">
        <AccordionTrigger>{trigger}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </Card>
    </AccordionItem>
  );
}

export function MessageInspector({
  reasoning,
  tools,
}: {
  reasoning: string[];
  tools: ToolPart[];
}) {
  const count = reasoning.length + tools.length;

  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger
        className="w-fit"
        render={<Button size="sm" variant="outline" />}
      >
        <SearchIcon data-icon="inline-start" />
        Inspect · {count}
      </DrawerTrigger>

      <DrawerContent className="h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)]">
        <DrawerHeader className="pb-2">
          <DrawerTitle>Inspect</DrawerTitle>
          <DrawerDescription>
            Reasoning and tool calls for this message
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="min-h-0 flex-1">
          <Accordion className="gap-3 rounded-none border-none p-4">
            {reasoning.map((text, index) => (
              <InspectorItem
                key={`reasoning-${index}`}
                trigger={
                  <span className="flex items-center gap-2">
                    <Brain className="size-4 text-muted-foreground" />
                    Thought process
                  </span>
                }
                value={`reasoning-${index}`}
              >
                <Response className="text-muted-foreground">{text}</Response>
              </InspectorItem>
            ))}

            {tools.map((part) => (
              <InspectorItem
                key={part.toolCallId}
                trigger={
                  <span className="flex items-center gap-2">
                    <WrenchIcon className="size-4 text-muted-foreground" />
                    {toolName(part)}
                    <Badge variant="secondary" className="text-xs">
                      {STATUS_LABELS[part.state] ?? part.state}
                    </Badge>
                  </span>
                }
                value={part.toolCallId}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-muted-foreground text-xs uppercase">
                      Payload
                    </span>
                    <Response>{toJsonBlock(part.input)}</Response>
                  </div>

                  {part.state === "output-available" && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-muted-foreground text-xs uppercase">
                        Response
                      </span>
                      <Response>{toJsonBlock(part.output)}</Response>
                    </div>
                  )}

                  {part.state === "output-error" && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-destructive text-xs uppercase">
                        Error
                      </span>
                      <p className="text-destructive text-sm">
                        {part.errorText}
                      </p>
                    </div>
                  )}
                </div>
              </InspectorItem>
            ))}
          </Accordion>
        </ScrollArea>

        <DrawerFooter className="pt-2">
          <DrawerClose render={<Button variant="secondary" />}>
            Back to chat
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
