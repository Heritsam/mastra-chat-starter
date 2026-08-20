import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_app")({
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
            <span className="font-medium text-sm">Threadline Analyst</span>
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </>
  );
}
