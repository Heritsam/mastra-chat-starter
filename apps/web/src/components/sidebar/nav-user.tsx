import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, Sparkle } from "lucide-react";
import { useState } from "react";

import { useAgentId } from "@/hooks/use-agent-id";
import { useAgents } from "@/hooks/use-agents";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SidebarMenu, SidebarMenuButton } from "../ui/sidebar";

export default function NavUser() {
  const agentId = useAgentId();
  const { data: agents, status, error } = useAgents();
  const navigate = useNavigate({ from: "/" });

  const [open, setOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(agentId);

  const currentAgentName =
    agents?.find((agent) => agent.id === agentId)?.name ?? agentId;

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setSelectedAgentId(agentId);
    }
    setOpen(next);
  };

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();
    navigate({
      to: "/",
      search: (prev) => ({ ...prev, agent: selectedAgentId }),
    });
    setOpen(false);
  };

  return (
    <SidebarMenu>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={
            <SidebarMenuButton
              size="lg"
              className="justify-start gap-2 rounded-lg data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            />
          }
        >
          <Sparkle className="size-4 text-muted-foreground" />
          <span className="truncate font-medium">{currentAgentName}</span>
          <ChevronDown className="ml-auto size-4 text-muted-foreground" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Agent Configuration</DialogTitle>
              <DialogDescription>
                Make changes to your agent here.
              </DialogDescription>
            </DialogHeader>

            <section className="flex flex-col gap-4">
              <Field className="w-full">
                <FieldLabel>Agent</FieldLabel>

                <Select
                  items={agents?.map((agent) => ({
                    label: agent.name,
                    value: agent.id,
                  }))}
                  disabled={status !== "success"}
                  value={selectedAgentId}
                  onValueChange={(value) => {
                    if (value) {
                      setSelectedAgentId(value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Agent</SelectLabel>

                      {agents?.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {status === "error" && (
                  <FieldError errors={[{ message: error.message }]} />
                )}
              </Field>

              <Field className="w-full">
                <FieldLabel>User ID</FieldLabel>

                <Input
                  id="userId"
                  autoComplete="off"
                  placeholder="fff269a0-e84b-466d-a498-f0392b8ad292 "
                />
              </Field>
            </section>

            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Cancel
              </DialogClose>

              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
}
