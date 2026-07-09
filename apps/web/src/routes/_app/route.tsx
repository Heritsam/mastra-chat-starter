import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { defaultAgentId } from "@/lib/agent";

const searchSchema = z.object({
  agent: z.string().catch(defaultAgentId),
});

export const Route = createFileRoute("/_app")({
  validateSearch: searchSchema,
  component: AppLayout,
});

function AppLayout() {
  return (
    <>
      <AppSidebar />

      <SidebarInset className="min-h-0 overflow-hidden border">
        <header className="flex shrink-0 items-center gap-2 border-b px-4 py-3">
          <SidebarTrigger />

          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Agent Tester</span>
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </>
  );
}
