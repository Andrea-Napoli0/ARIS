import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function AgentsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="auto-deploy" className="text-sm font-medium">Auto-deploy agents</Label>
        <Switch id="auto-deploy" className="data-[state=checked]:bg-green-500! data-[state=unchecked]:bg-gray-700!" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="parallel-tasking" className="text-sm font-medium">Parallel Tasking</Label>
        <Switch id="parallel-tasking" className="data-[state=checked]:bg-green-500! data-[state=unchecked]:bg-gray-700!" />
      </div>
    </div>
  );
}
