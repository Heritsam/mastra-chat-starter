import { useSearch } from "@tanstack/react-router";

export function useAgentId() {
  return useSearch({ from: "/_app", select: (search) => search.agent });
}
