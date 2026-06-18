import { useSidebar } from "@/components/ui/sidebar"
import { Settings } from "lucide-react"

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar()


  return (
    <button 
        className="absolute right-1 top-5 z-50 p-2 border-none shadow-none outline-none bg-transparent!
            transition-colors text-white"
        onClick={(e) => {
            toggleSidebar();
            e.currentTarget.blur(); // Forza la perdita del focus dopo il click
        }} 
        aria-label="Toggle Sidebar"
        >                       
        <Settings className="h-5 w-5" />
    </button>
  )
}