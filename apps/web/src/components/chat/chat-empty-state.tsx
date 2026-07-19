import { SparklesIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useAgentId } from "@/hooks/use-agent-id";
import { useAgents } from "@/hooks/use-agents";
import { Button } from "../ui/button";

const SUGGESTIONS = [
  "What's the weather in Tokyo?",
  "Is it raining in London?",
  "Compare weather in Paris and Rome",
  "Should I bring an umbrella in Seattle?",
] as const;

export function ChatEmptyState({
  onSuggestion,
}: {
  onSuggestion: (suggestion: string) => void;
}) {
  const agentId = useAgentId();
  const { data: agents } = useAgents();
  const agentName = agents?.find((agent) => agent.id === agentId)?.name;

  return (
    <Empty className="flex-none border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SparklesIcon />
        </EmptyMedia>
        <EmptyTitle className="text-4xl">Hello, developer!</EmptyTitle>
        <EmptyDescription>
          You're talking to{" "}
          <span className="font-medium text-primary-foreground">
            {agentName ?? agentId}.
          </span>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="mt-2 max-w-xl">
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((suggestion, index) => (
            <Button
              className="fade-in-0 slide-in-from-bottom-1 animate-in rounded-full fill-mode-both duration-300"
              key={suggestion}
              onClick={() => onSuggestion(suggestion)}
              size="sm"
              style={{ animationDelay: `${index * 40}ms` }}
              type="button"
              variant="outline"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </EmptyContent>
    </Empty>
  );
}
