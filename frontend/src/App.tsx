import Visualizer from "./components/ui/visualizer/visualizer";
import { SidebarProvider} from "@/components/ui/sidebar"
import { SettingSidebar } from "@/components/ui/settings/settingSidebar"
import {CustomTrigger} from "@/components/ui/settings/settingButton"
import { TitleBar } from "./components/ui/titleBar/title-bar";
import TestComponent from "./components/ui/test/testComponent";

 
export default function App() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-screen overflow-hidden"> {/* Inserted the Div to hide overflow */ }
        
        <main className="flex-1 relative bg-black">
          <TitleBar/>
          <CustomTrigger />
          <TestComponent/>
          <Visualizer />
        </main>
        <SettingSidebar/>
      </div>
    </SidebarProvider>
  );
}
