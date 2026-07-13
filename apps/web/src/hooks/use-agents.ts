import { env } from "@repo/env/web";
import { useQuery } from "@tanstack/react-query";

export type MastraAgent = {
  id: string;
  name: string;
  description?: string;
};

type AgentsResponse = Record<string, MastraAgent>;

async function fetchAgents(): Promise<MastraAgent[]> {
  const response = await fetch(`${env.VITE_SERVER_URL}/api/agents`);

  if (!response.ok) {
    throw new Error(`Failed to load agents (${response.status})`);
  }

  const data: AgentsResponse = await response.json();

  return Object.values(data);
}

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
