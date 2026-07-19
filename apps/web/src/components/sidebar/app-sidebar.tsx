import { Link } from "@tanstack/react-router";
import { MessageCirclePlus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "../ui/sidebar";
import NavUser from "./nav-user";
import ThreadList from "./thread-list";

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Button
          className="w-full cursor-default"
          variant="outline"
          render={<Link from="/" to="/" search={(prev) => prev} />}
        >
          <MessageCirclePlus data-icon="inline-start" />
          New chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="scroll-fade-y">
        <SidebarGroup>
          <SidebarGroupLabel>Recent</SidebarGroupLabel>

          <SidebarGroupContent>
            <ThreadList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
