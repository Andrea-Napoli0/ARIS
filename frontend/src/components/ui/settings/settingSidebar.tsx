import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  VoiceSection,
  AgentsSection,
  MemorySection,
  PermissionSection,
} from "./settingSections";

import { SettingsSection } from "./sections/settingSections";


export function SettingSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-black text-white " side="right"   {...props}>
      <SidebarHeader className="bg-black p-7 flex">
        <h2 className="text-lg font-bold">A.R.I.S. CONTROL PANEL</h2>
      </SidebarHeader>
      <SidebarContent className="bg-black">
              <SidebarGroup className="text-white">
        <SettingsSection title="Voice Settings">
          <VoiceSection />
        </SettingsSection>
      </SidebarGroup>

      <SidebarGroup>
        <SettingsSection title="Agents">
          <AgentsSection />
        </SettingsSection>
      </SidebarGroup>

      <SidebarGroup>
        <SettingsSection title="Memory">
          <MemorySection />
        </SettingsSection>
      </SidebarGroup>

      <SidebarGroup>
        <SettingsSection title="Permissions">
          <PermissionSection />
        </SettingsSection>
      </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-black" />
    </Sidebar>
  )
}