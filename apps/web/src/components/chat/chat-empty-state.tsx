import { SparklesIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { agentName } from "@/lib/agent";
import { Button } from "../ui/button";

const SUGGESTIONS = [
  "What were our top 5 products by revenue this year?",
  "Show revenue by category as a bar chart",
  "Plot monthly revenue trend for the last year",
  "Compare revenue and units sold by region",
] as const;

export function ChatEmptyState({
  onSuggestion,
}: {
  onSuggestion: (suggestion: string) => void;
}) {
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
            {agentName}.
          </span>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="mt-2 max-w-3xl">
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
