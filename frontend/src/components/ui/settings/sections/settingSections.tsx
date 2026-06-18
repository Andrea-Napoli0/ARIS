import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}


export function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  return (
    <Collapsible className="group/collapsible">

      <CollapsibleTrigger asChild>
        <SidebarGroupLabel className="text-white cursor-pointer flex items-center justify-between text-base font-semibold tracking-wide font-sans">
          {title}
          <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
        </SidebarGroupLabel>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarGroupContent className="px-4 mt-4">
          {children}
        </SidebarGroupContent>
      </CollapsibleContent>

    </Collapsible>
  );
}