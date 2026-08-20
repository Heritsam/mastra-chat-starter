import { Sparkle } from "lucide-react";

import { agentName } from "@/lib/agent";
import { SidebarMenu, SidebarMenuButton } from "../ui/sidebar";

export default function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuButton
        size="lg"
        className="cursor-default justify-start gap-2 rounded-lg"
      >
        <Sparkle className="size-4 text-muted-foreground" />
        <span className="truncate font-medium">{agentName}</span>
      </SidebarMenuButton>
    </SidebarMenu>
  );
}
