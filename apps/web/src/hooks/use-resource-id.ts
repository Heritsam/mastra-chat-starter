import { useState } from "react";
import { getOrCreateResourceId } from "@/lib/resource-id";

export function useResourceId() {
  const [resourceId] = useState(() =>
    typeof window === "undefined" ? "" : getOrCreateResourceId(),
  );

  return resourceId;
}
