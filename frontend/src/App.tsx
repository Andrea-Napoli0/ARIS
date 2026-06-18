import Visualizer from "./components/ui/visualizer/visualizer";
import { SidebarProvider} from "@/components/ui/sidebar"
import { SettingSidebar } from "@/components/ui/settings/settingSidebar"
import {CustomTrigger} from "@/components/ui/settings/settingButton"

export default function App() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-screen overflow-hidden"> {/* Inserted the Div to hide overflow */ }
        
        <main className="flex-1 relative bg-black">
          <CustomTrigger />
          <Visualizer />
        </main>
        <SettingSidebar side="right" />
      </div>
    </SidebarProvider>
  );
}
