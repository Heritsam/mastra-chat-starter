import type { ComponentProps } from "react";
import { Streamdown } from "streamdown";

import { cn } from "@/lib/utils";

export function Response({
  className,
  ...props
}: ComponentProps<typeof Streamdown>) {
  return (
    <Streamdown
      components={{
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
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p+table]:mt-4 [&_table+p]:mt-4",
        className,
      )}
      {...props}
    />
  );
}
