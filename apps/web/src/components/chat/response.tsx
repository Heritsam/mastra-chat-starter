import type { ComponentProps } from "react";
import { Streamdown } from "streamdown";

import { cn } from "@/lib/utils";

export function Response({
  className,
  isStreaming,
  ...props
}: ComponentProps<typeof Streamdown> & { isStreaming?: boolean }) {
  return (
    <Streamdown
      components={{
        h1: ({ children }) => (
          <h1 className="mt-4 mb-2.5 font-bold text-4xl">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-4 mb-2.5 font-bold text-2xl">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-4 mb-2.5 font-bold text-xl">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="my-2.5 leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="my-2.5 list-inside list-disc leading-relaxed">
            {children}
          </ul>
        ),
        li: ({ children }) => <li className="mb-1">{children}</li>,
      }}
      animated={{ animation: "slideUp" }}
      isAnimating={isStreaming}
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p+table]:mt-4 [&_table+p]:mt-4",
        className,
      )}
      {...props}
    />
  );
}
